import React,{useState,useContext,useEffect, useRef} from 'react';
import { useNavigate, useParams } from 'react-router';
import {useSelector,useDispatch} from "react-redux"
import {socket} from "../../helpers/socket.helper"


import dayjs from "dayjs"

import { styled, useTheme } from '@mui/material/styles';

import MeetingContext from '../../context/meeting.context';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import PresentToAllOutlinedIcon from '@mui/icons-material/PresentToAllOutlined';
import {Button, CssBaseline, IconButton, Toolbar } from '@mui/material';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ChatIcon from '@mui/icons-material/Chat';
import { Box } from '@mui/system';
import SettingsIcon from '@mui/icons-material/Settings';
import MuiAppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SendIcon from '@mui/icons-material/Send';


import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { Store } from 'react-notifications-component';


import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
// import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
// import SaveIcon from '@mui/icons-material/Save';
// import PrintIcon from '@mui/icons-material/Print';
// import ShareIcon from '@mui/icons-material/Share';
// import EditIcon from '@mui/icons-material/Edit';
// import AttachmentIcon from '@mui/icons-material/Attachment';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';

import imageCompression from 'browser-image-compression';
import Backdrop from '@mui/material/Backdrop';



const WEEK = [
    "Sun","Mon","Tue","Wed","Thu","Fri","Sat"
]

const drawerWidth = 300;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginRight: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const CallPageFooter = ({setvideoWidth,peers,socketRef}) => {
    const theme = useTheme();
    let history = useNavigate()
    let dispatch = useDispatch()
    let {id} = useParams()
    const [time,setTime] = useState(dayjs().format("hh:mm a"))
    const [date,setDate] = useState(dayjs().format(" MMM DD"))
    const [day,setDay] = useState(WEEK[dayjs().day()])
    const [lobbyUsers,setLobbyUsers] = useState([])
    const [roomUsers,setRoomUsers] = useState([])
    const [open,setOpen] = useState(false)
    const [sidePanel,setSidePanel] = useState("chat")
    const meetingData = useSelector(state=>state.meeting)
    const {meetingId,setMeetingId,localStream,setLocalStream,volumeInterval,setVolumeInterval,isAdminOfMeeting} = useContext(MeetingContext)

    
    const timer = ()=>{
        setTime(prev=>{
            let now = dayjs().format("hh:mm a")
            if (prev == now){
                return prev
            } else{
                return now
            }
        })
        setDate(prev=>{
            let now = dayjs().format(" MMM DD")
            if (prev== now){
                return prev
            }else{
                return now
            }
        })
        setDay(prev=>{
            let now = WEEK[dayjs().day()]
            if (prev == now){
                return prev
            }else{
                return now
            }
        })

    }

    const endMeet = () =>{
        
        socket.emit("leave room",meetingId?meetingId:id)
        localStream.getVideoTracks()[0].stop();
        localStream.getAudioTracks()[0].stop();
        // initUserFeed.src = ""
        // initUserFeed.pause()
        setLocalStream({active:false})
        socket.emit("leave room")
        dispatch({
            type:"RESETMEETINGSTORE",
        })
        socket.disconnect()
        window.location = "/meeting"

      };

    const handleAudioButton = async()=>{
        if (meetingData.audioFeed){
            clearInterval(volumeInterval);
            setVolumeInterval(null)
            console.log(meetingData.videoFeed)
            try{
                localStream.getAudioTracks()[0].enabled = !meetingData.audioFeed;
                dispatch({
                    type:"SETAUDIOFEED",
                    payload:{audioFeed:!meetingData.audioFeed}
                })
            }catch(error){
                dispatch({
                    type:"SETAUDIOFEED",
                    payload:{audioFeed:meetingData.audioFeed}
                })
            }
        }else{
            try {
                localStream.getAudioTracks()[0].enabled = !meetingData.audioFeed;
                dispatch({
                    type:"SETAUDIOFEED",
                    payload:{audioFeed:!meetingData.audioFeed}
                })
                
            } catch (error) {
                // console.error('Failed to initialize volume visualizer, simulating instead...', error);
                dispatch({
                    type:"SETAUDIOFEED",
                    payload:{audioFeed:meetingData.audioFeed}
                })
            }
        }
    }

    const handleDrawerOpen = async(toOpen)=>{
        document.getElementsByTagName("main")[0].style.marginRight =  `${drawerWidth}px`
        setOpen(true)
        setSidePanel(toOpen)
        
    }
    const handleDrawerClose = async()=>{
        setOpen(false)
        document.getElementsByTagName("main")[0].style.marginRight = "0px"
    }

    useEffect(()=>{
        setTimeout(() => {
            var width = `${peers.length+1>=4?(document.querySelector(".videoContainer")?.clientWidth/4):peers.length+1>=3<4?(document.querySelector(".videoContainer")?.clientWidth/3):peers.length+1>=2<3?(document.querySelector(".videoContainer")?.clientWidth/2):(document.querySelector(".videoContainer")?.clientWidth)}px`
            console.log({width,open})
            console.log(peers)
            setvideoWidth(width)
        }, 200);

    },[open])
    useEffect(()=>{
        if(isAdminOfMeeting){
            socket.on("lobby users",data=>{
                setLobbyUsers(prev=>{
                    var newData = [...prev] 
                    for (const key in data){
                        if(newData.length>0){
                            var a = newData.filter(item=>item.socketID==key)
                            if(!a){
                                newData.push({...data[key]})
                                Store.addNotification({
                                    title: "Meeting",
                                    message: `${data[key].username} is requesting to join the meeting`,
                                    type: "warning",
                                    insert: "top",
                                    container: "top-right",
                                    animationIn: ["animate__animated", "animate__fadeIn"],
                                    animationOut: ["animate__animated", "animate__fadeOut"],
                                    dismiss: {
                                      duration: 2500,
                                      onScreen: true
                                    }
                                });
                            }
                        }else{
                            newData.push({...data[key]})
                            Store.addNotification({
                                title: "Meeting",
                                message: `${data[key].username} is requesting to join the meeting`,
                                type: "warning",
                                insert: "top",
                                container: "top-right",
                                animationIn: ["animate__animated", "animate__fadeIn"],
                                animationOut: ["animate__animated", "animate__fadeOut"],
                                dismiss: {
                                  duration: 2500,
                                  onScreen: true
                                }
                            });
                        }
                    }
                    
                    return newData
                })
            })
        }
    },[isAdminOfMeeting])

    const handleVideoButton = ()=>{
        // var initUserFeed = document.querySelector(".videoFeed_init")
        if (localStream && localStream.getVideoTracks()[0].enabled){
            try {
                dispatch({
                    type:"SETVIDEOFEED",
                    payload:{videoFeed:!localStream.getVideoTracks()[0].enabled}
                })
                localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
            } catch (error) {
                dispatch({
                    type:"SETVIDEOFEED",
                    payload:{videoFeed:localStream.getVideoTracks()[0].enabled}
                })
            }
        }else{
            try {
                dispatch({
                    type:"SETVIDEOFEED",
                    payload:{videoFeed:!localStream.getVideoTracks()[0].enabled}
                })
                localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled
            } catch (error) {
                dispatch({
                    type:"SETVIDEOFEED",
                    payload:{videoFeed:localStream.getVideoTracks()[0].enabled}
                })
            }
        }
    }
    
    useEffect(() => {
        const timeInterval = setInterval(timer, 1000);
        socket.on("kickout",data=>{
            Store.addNotification({
                title: "Meeting",
                message: `Kicked out`,
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 2500,
                  onScreen: true
                }
            });
            setTimeout(() => {
                document.getElementById("endMeetButton").click()
            }, 2000);
        })
        socket.on("all leave room",data=>{
            Store.addNotification({
                title: "Meeting",
                message: `Meeting ended`,
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 2500,
                  onScreen: true
                }
            });
            setTimeout(() => {
                document.getElementById("endMeetButton").click()
            }, 2000);
        })
        
        socket.on("room users",data=>{
            setRoomUsers(data)
            if(data.length>0 && isAdminOfMeeting){
                var lobbyUSER = []
                for (var i=0;i>data.length;i++){
                    for(var j=0;j>lobbyUsers.length;j++){
                        if(lobbyUsers[j].socketID!=data[i].docketID){
                            lobbyUSER.push({...lobbyUSER[j]})
                        }
                    }
                }
                setLobbyUsers(lobbyUSER)
            }
        })
        return()=> {
            clearInterval(timeInterval)
        }
    },[]);

    return (
        <>
            <Box sx={{display:"flex"}}>
                <CssBaseline />
                <AppBar position='fixed' open={open} sx={{bgcolor:"#222",top:"initial",bottom:0}}>
                    <Toolbar style={{justifyContent:"space-between"}}>
                        <div style={{fontSize:"16px",color:"#fff"}}>
                            <p style={{marginBottom:"0px"}}>{time}</p>
                            <p style={{marginBottom:"0px"}}>{meetingId}</p>
                        </div>
                        <div style={{fontSize:"16px",color:"#fff"}}>
                            <Button onClick={handleAudioButton} variant='standard' style={{background:meetingData.audioFeed?"#666":"#F73131",borderRadius:"50%",border:"none",minWidth:"24px",padding: "8px 8px"}}>
                                {meetingData.audioFeed?(
                                    <KeyboardVoiceIcon />
                                ):(
                                    <MicOffOutlinedIcon />
                                )}
                            </Button>
                            <Button onClick={handleVideoButton} variant='standard' style={{background:meetingData.videoFeed?"#666":"#F73131",borderRadius:"50%",border:"none",minWidth:"24px",padding: "8px 8px",marginLeft:"10px"}}>
                                {meetingData.videoFeed?(
                                    <VideocamOutlinedIcon />
                                ):(
                                    <VideocamOffOutlinedIcon />
                                )}
                            </Button>
                            <Button variant='standard' style={{background:"#666",borderRadius:"50%",border:"none",minWidth:"24px",padding: "8px 8px",marginLeft:"10px"}}>
                                <PresentToAllOutlinedIcon />
                            </Button>
                            <Button id="endMeetButton" onClick={endMeet} variant='standard' style={{background:"#F73131",borderRadius:"25px",border:"none",minWidth:"24px",padding: "8px 16px",marginLeft:"10px"}}>
                                <CallEndIcon />
                            </Button>
                        </div>
                        <div>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={()=>handleDrawerOpen("setting")}
                                edge="start"
                                sx={{ mr: 2, ...(open && sidePanel=="setting" && { background: '#777' }) }}
                            >
                                <SettingsIcon />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={()=>handleDrawerOpen("chat")}
                                edge="start"
                                sx={{ mr: 2, ...(open && sidePanel=="chat" && { background: '#777' }) }}
                            >
                                <ChatIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer 
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={open}
                >
                    <DrawerHeader style={{justifyContent:"flex-start"}}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronRightIcon />
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    {sidePanel=="chat"&&(
                        <Message socketRef={socketRef}/>
                    )}
                    {sidePanel == "setting" &&(
                        <Setting  peers={peers} lobbyUsers={lobbyUsers} roomUsers={roomUsers}/>
                    )}
                </Drawer>
            </Box>
        </>
    );
}

const actions = [
    { icon: <CropOriginalIcon style={{color:"#fff"}} onClick={()=>{
      document.querySelector(".imageAttachment").click()
    }}/>, name: 'Image' },
  //   { icon: <SaveIcon />, name: 'Save' },
  //   { icon: <PrintIcon />, name: 'Print' },
  //   { icon: <ShareIcon />, name: 'Share' },
  ];
  
function isValidHttpUrl(string) {
    if (typeof(string)==Object){
        return true
    }else{
        return false
    }
    // try {
    //     const url = new URL(string);
    //     return url.protocol === 'http:' || url.protocol === 'https:';
    // } catch (err) {
    //     return false;
    // }
}

const Message = ({socketRef}) => {
    const [textMsg,setTextMsg] = useState("")
    const {meetingId,messages,meetingUserName} = useContext(MeetingContext)
    const imageAttachmentRef = useRef()
    const [attahcment,setAttchment] = useState()
    const [attchmentThumbnail,setAttchmentThumbnail] = useState()
    const sendText = ()=>{
        if(textMsg.length>0 || attahcment){
            var data = {
                roomID : meetingId,
                msg:textMsg,
                createdAt: dayjs().valueOf(),
                parent:meetingUserName,
                attahcment:attahcment
            }
            socketRef.current.emit("send message in room",data)
            setAttchment(null)
            setAttchmentThumbnail(null)
            setTextMsg("")
        }
    }
    const attchmentProgress = (progress)=>{
        console.log(`${progress}%`)
    }

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'
    
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    
        const i = Math.floor(Math.log(bytes) / Math.log(k))
    
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    const getThumbnail = async(original)=> {
        const options = { 
            maxSizeMB: 200,            // (default: Number.POSITIVE_INFINITY)
            maxWidthOrHeight: 64,     // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
                                          // but, automatically reduce the size to smaller than the maximum Canvas size supported by each browser.
                                          // Please check the Caveat part for details.
            onProgress: attchmentProgress,         // optional, a function takes one progress argument (percentage from 0 to 100) 
          }
        var thumb = await imageCompression(original,options)
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(thumb);
        return {thumb,imageUrl}
      }

    const scrollToBottom = (id) => {
        const element = document.getElementById(id);
        if(element){
            element.scrollTop = element.scrollHeight;
        }
    }
    useEffect(()=>{
        imageAttachmentRef.current?.addEventListener('change', async(e) => {
            console.log(e.target.files[0])
            var file = e.target.files[0]
            const options = { 
                maxSizeMB: 500,            // (default: Number.POSITIVE_INFINITY)
                // maxWidthOrHeight: number,     // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
                                              // but, automatically reduce the size to smaller than the maximum Canvas size supported by each browser.
                                              // Please check the Caveat part for details.
                onProgress: attchmentProgress,         // optional, a function takes one progress argument (percentage from 0 to 100) 
                // useWebWorker: boolean,        // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
              
                // signal: AbortSignal,          // options, to abort / cancel the compression
              
                // following options are for advanced users
                // maxIteration: number,         // optional, max number of iteration to compress the image (default: 10)
                // exifOrientation: number,      // optional, see https://stackoverflow.com/a/32490603/10395024
                // fileType: string,             // optional, fileType override e.g., 'image/jpeg', 'image/png' (default: file.type)
                // initialQuality: number,       // optional, initial quality value between 0 and 1 (default: 1)
                // alwaysKeepResolution: true // optional, only reduce quality, always keep width and height (default: false)
              }
            var attachment = await imageCompression(file,options)
            var thumbnail = await getThumbnail(attachment);
            console.log(thumbnail)
            setAttchmentThumbnail(thumbnail)

            setAttchment(attachment)

        });
        scrollToBottom("meetingMessageBox")
        return ()=>{
            imageAttachmentRef.current?.addEventListener('change', (e) => {
                
            });
        }
    },[])
    useEffect(() => {
        scrollToBottom("meetingMessageBox")

    }, [messages]);


    return (
        <div style={{padding:"20px"}}>
            <h3 style={{fontSize:"18px",fontWeight:"400",marginBottom:"0px"}}>Messages</h3>
            <p style={{fontSize:"10px" , color:"#999"}}>All messages will disappear once meeting ends</p>
            <Divider style={{marginBottom:"5px"}}/>

            <div id="meetingMessageBox" style={{height:"73vh",overflow:"auto"}}>
                {messages.map((msg,idx)=>{
                    console.log(msg)
                    if(msg.from == socket.id){
                        return(
                            <SentMsg key={idx} msg={msg.msg} createdAt={msg.createdAt} parent={msg.parent} attachment={msg.attahcment}/>
                        )
                    }else{
                        return(
                            <RecivedMsg key={idx} msg={msg.msg} createdAt={msg.createdAt} parent={msg.parent} attachment={msg.attahcment}/>
                        )
                    }
                })}
            </div>
            <Divider style={{marginBottom:"5px"}}/>
            <div>
                <div style={{display:"none"}}>
                    <input ref={imageAttachmentRef} className="imageAttachment" name="imageAttachment" type="file" accept="image/png, image/jpeg"/>
                </div>
                <div style={{border:"1px solid #999",borderRadius:"4px",padding:"5px",marginBottom:"2px",display:attahcment?"flex":"none",alignItems:"center"}}>
                    <div style={{height:"64px",width:"64px",overflow:"none",display:"flex",alignItems:"center"}}>
                        <img src={attchmentThumbnail&& attchmentThumbnail.imageUrl} style={{wdith:"100%"}}/>
                    </div>
                    <div style={{marginLeft:"5px"}}>
                        <p style={{fontSize:"12px",display:"flex",flexDirection:"column",marginBottom:"0"}}>
                            <span>Name:{attahcment?.name}</span>
                            <span>Size:{formatBytes(attahcment?.size)}</span>
                        </p>
                    </div>
                </div>
                <div style={{padding:"8px",borderRadius:"4px",border:"1px solid #777",display:"flex",justifyContent:"center",alignItems:"center"}}>
                    {/* <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}> */}
                    {/* <SpeedDial
                            ariaLabel="Attachments"
                            sx={{ position: 'relative', bottom: 27, left: 16,'& .MuiButtonBase-root:hover':{background:"#999"} ,'& .MuiButtonBase-root': { width: "30px", height: '24px',background:"#999" },}}
                            icon={<SpeedDialIcon openIcon={<ClearIcon />} />}
                        >
                            {actions.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                            />
                            ))}
                        </SpeedDial> */}
                    {/* </Box> */}
                    
                    <CropOriginalIcon style={{color:"#000",cursor:"pointer"}} onClick={()=>{
                        document.querySelector(".imageAttachment").click()
                    }}/>
                    <input style={{
                        width:"80%",
                        fontSize:"12px",
                        fontWeight:"400",
                        outline:"none",
                        border:"none",
                        marginLeft:"auto"
                    }}
                        value={textMsg}
                        onChange={(e)=>{
                            setTextMsg(e.target.value)
                        }}
                    />
                    <div style={{width:"max-content"}}>
                        <SendIcon onClick={sendText}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

const SentMsg  = ({msg,createdAt,parent,attachment})=>{
    const [open, setOpen] = React.useState(false);
    const [currentImgToShow,setCurrentImageToShow] = useState()
    const handleClose = () => {
        setOpen(false);
        setCurrentImageToShow("")
    };
    const handleToggle = (attachment) => {
        setOpen(!open);
        console.log(attachment)

        setCurrentImageToShow(attachment)
    };
    return(
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <div style={{width:"100%",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <img style={{maxWidth:"60%",}} src={currentImgToShow}/>
                    <p style={{position:"absolute",right:"10px",top:"0px",cursor:"pointer"}} onClick={()=>{
                        var a = document.createElement("a")
                        a.href = currentImgToShow
                        a.download = "Meeting_Image"
                        a.click()
                    }} >Download</p>
                </div>
            </Backdrop>
            <div style={{
                marginBottom:"15px",
            }}>
                <p style={{fontSize:"10px",textAlign:"right",marginBottom:"10px",color:"#999"}}>{dayjs(createdAt).format("hh:mm")}</p>
                <div onClick={()=>handleToggle(attachment)} style={{display:attachment?"inital":"none",width:"70%",maxHeight:"300px",overflow:"none",marginLeft:"auto",cursor:"pointer"}}>
                    <img style={{maxWidth:"100%",marginBottom:"3px"}} src={attachment} />
                </div>
                <p style={{
                    textAlign:"right",
                    display:msg.length>0?"block":"none"
                }}>
                    <p style={{
                        padding:"12px",
                        background:"#999",
                        borderRadius:"8px 0px 8px 8px",
                        color:"#fff",
                        marginBottom:"0px",
                        fontSize:"12px",
                        maxWidth:msg.length<30?"max-content":"80%",

                        marginBottom:"0",
                        wordWrap: "break-word",
                        marginLeft:"auto"
                    }}>
                        {msg}
                    </p>
                </p>
                {/* <span style={{marginLeft:"86%",fontSize:"10px",padding:"2px 6px",color:"#000"}}>{dayjs(createdAt).format("hh:mm")}</span> */}
            </div>
        </>
    )
}
const RecivedMsg  = ({msg,createdAt,parent,attachment})=>{
    const [open, setOpen] = React.useState(false);
    const [currentImgToShow,setCurrentImageToShow] = useState()

    const handleClose = () => {
        setOpen(false);
        setCurrentImageToShow("")
    };
    const handleToggle = (attachment) => {
        setOpen(!open);
        console.log(attachment)
        setCurrentImageToShow(attachment)
    };
    return(
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <div style={{width:"70%",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <img style={{maxWidth:"60%",}} src={currentImgToShow}/>
                    <p style={{position:"absolute",right:"10px",top:"0px",cursor:"pointer"}} onClick={()=>{
                        var a = document.createElement("a")
                        a.href = currentImgToShow
                        a.download = "Meeting_Image"
                        a.click()
                    }} >Download</p>
                </div>
            </Backdrop>
            <div style={{
                marginBottom:"15px",
                display:"flex",
                flexDirection:"column"
            }}>
                <span style={{fontSize:"10px",color:"#999"}}>{parent} at {dayjs(createdAt).format("hh:mm")}</span>
                <div onClick={()=>handleToggle(attachment)} style={{display:attachment?"inital":"none",width:"70%",maxHeight:"300px",overflow:"none",cursor:"pointer"}}>
                    <img style={{maxWidth:"100%",marginBottom:"3px"}} src={attachment} />
                </div>
                <p style={{
                    padding:"12px",
                    background:"#444",
                    borderRadius:"0px 8px 8px 8px",
                    color:"#fff",
                    marginBottom:"0px",
                    fontSize:"12px",
                    maxWidth:msg.length<30?"max-content":"80%",
                    wordWrap: "break-word",

                    display:msg.length>0?"block":"none"
                }}>{msg}</p>
                {/* <span style={{fontSize:"10px",padding:"2px 6px",color:"#000"}}>{dayjs(createdAt).format("hh:mm")}</span> */}
            </div>
        </>
    )
}

const Setting = ({peers,lobbyUsers,roomUsers}) => {
    const {isAdminOfMeeting,meetingId,setMeetingLobbyUsers} = useContext(MeetingContext)
    
    const addInRoom = (item)=>{
        socket.emit("add users from lobby to meeting",{roomID:meetingId,userSocketID:item.socketID})
    }
    const kickOut = (item)=>{
        socket.emit("kickout",{roomID:meetingId,userSocketID:item.socketID})
    }

    return (
        <div  style={{padding:"20px"}}>
            <h3 style={{fontSize:"18px",fontWeight:"400"}}>Settings</h3>
            <p style={{fontSize:"12px"}}>Meeting ID : {meetingId}</p>
            <hr />
            {lobbyUsers.length>0 && isAdminOfMeeting && (
                <>
                    <h3 style={{fontSize:"16px",fontWeight:"400"}}>Lobby <span style={{fontSize:"12px"}}>({lobbyUsers.length})</span></h3>
                    {lobbyUsers?.map((item,idx)=>{
                        if(socket.id!=item.socketID){
                            return(
                                <p key={idx} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"13px"}}>
                                    {item.username.toUpperCase()}
                                    <IconButton style={{borderRadius:"4px"}} onClick={()=>addInRoom(item)}>
                                        <AddIcon /><span style={{fontSize:"11px"}}>Add</span>
                                    </IconButton>
                                </p>
                            )
                        }
                    })}
                    <hr />
                </>
            )}
            <h3 style={{fontSize:"16px",fontWeight:"400"}}>Room <span style={{fontSize:"12px"}}>({roomUsers.length})</span></h3>
            {roomUsers?.map((item,idx)=>{
                return(
                    <p key={idx} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"13px"}}>
                        {item.username.toUpperCase()}
                        {socket.id!=item.socketID && isAdminOfMeeting ? (
                            <IconButton style={{borderRadius:"4px"}} onClick={()=>kickOut(item)}>
                                <ClearIcon /><span style={{fontSize:"11px"}}>Remove from room</span>
                            </IconButton>
                        ):(
                            isAdminOfMeeting ?(
                                <IconButton style={{borderRadius:"4px"}}>
                                   <span style={{fontSize:"11px"}}> ADMIN</span>
                                </IconButton>
                            ):(
                                <IconButton style={{borderRadius:"4px"}}>
                                   <span style={{fontSize:"11px"}}> USER</span>
                                </IconButton>
                            )
                        )}
                    </p>
                )
            })}

        </div>
    );
}

export default CallPageFooter;
