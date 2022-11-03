import React, { useEffect,useState,useRef,useContext } from 'react';


import { Button } from '@mui/material';
import Switch from '@mui/material/Switch';


import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';


import MeetingContext from '../../context/meeting.context';
import {socket} from "../../helpers/socket.helper"

import { Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';





function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
   }
   return result;
}



const Lobby = () => {
    const {id} = useParams()
    let dispatch = useDispatch()
    let history = useNavigate()
    const [videoStream,setVideoStream] = useState(null)
    const [audioFeed,setAudioFeed] = useState(true)
    const [videoFeed,setVideoFeed] = useState(true)
    const {meetingUserName,setMeetingUserName,meetingId,setMeetingId,setIsAdminOfMeeting,isAdminOfMeeting,meetingLobbyUsers,setMeetingLobbyUsers} = useContext(MeetingContext)
    var isAdmin=false
    const socketRef = useRef();

    const runOnSocketConnetction = (socket)=>{
        socketRef.current = socket
        // initWebRTC()
    }
    useEffect(() => {
        if (socketRef.current){
            console.log(id,meetingUserName)
            socketRef.current.emit("create meeting",({roomID:id,username:meetingUserName}))
            socketRef.current.on("meeting created",data=>{
                console.log({data})
                if (data.isAdmin){
                    setIsAdminOfMeeting(data.isAdmin)
                    isAdmin = data.isAdmin
                    Store.addNotification({
                        title: "Meeting",
                        message: `Your Meeting is created`,
                        type: "success",
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
            })
            socketRef.current.on("joined lobby as admin/user",(data)=>{
                console.log(`joined lobby as admin/user ${JSON.stringify(data)}`)
                if (data.admin){
                    history(`/meeting/${data.redirect}/${meetingId}#init`)
                    Store.addNotification({
                        title: "Meeting",
                        message: `Your meeting has started`,
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                          duration: 3000,
                          onScreen: true
                        }
                    });
                }else{
                    console.log("waiting till accepted")
                    Store.addNotification({
                        title: "Meeting",
                        message: `You will enter the meeting once the admin accepts`,
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                          duration: 5000,
                          onScreen: true
                        }
                    });
                }
            })
            socketRef.current.on("request accepted by admin",(data)=>{
                Store.addNotification({
                    title: "Meeting",
                    message: `Admin accepted the request. Your will be joining shortly`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 6000,
                      onScreen: true
                    }
                });
                history(`/meeting/${data.redirect}/${meetingId}`)
            })
        }
    }, [socketRef.current]);

    useEffect(()=>{
        init(id)
        if (socket.connected){
            console.log(socket.connected)
            runOnSocketConnetction(socket)
        }else{
            socket.on('connect', () => {
                console.log("connected",socket)
                runOnSocketConnetction(socket)
                
            });
        
            socket.on('disconnect', (socket) => {
                console.log("disconnected",socket)
            });
        }
        return ()=>{
            console.log(" lobby_page component removed which means runOnSocketConnetction function will run again")
            console.log("removing component")
        }
    },[])

    const init=(id=undefined)=>{
        navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: {
                sampleSize: 16,
                channelCount: 2,
                echoCancellation: true
            },
        }).then(async(stream)=>{
            setVideoStream(stream)
            dispatch({
                type:"SETAUDIOFEED",
                payload:{audioFeed:true}
            })
            dispatch({
                type:"SETVIDEOFEED",
                payload:{videoFeed:true}
            })
        }).catch(err=>{
            console.log({err})
        })
        makeMeetingId(id)
    }

    const handleJoin = ()=>{
        socketRef.current.emit("join lobby",{roomID:id,username:meetingUserName})
        console.log({roomID:id})
        // history(`/meeting/call_page/${meetingId}${isAdmin?"#init":""}`)
    }

    const makeMeetingId = (id=undefined)=>{
        console.log({id})
        if (id){
            setMeetingId(id)
        }else{
            let id  = `${makeid(4)}-${makeid(3)}-${makeid(3)}-${makeid(4)}`
            setMeetingId(id)
        }
        return id
    }

    return (
        <>
            <h3 style={{textAlign:"center"}}>Meeting Lobby</h3>
            <div className='container' style={{maxWidth:"100%",height:"70vh",padding:"0",display:"flex",justifyContent:"center",alignItems:"center"}}>
                <div style={{width:"600px",border:"1px solid #222",borderRadius:"4px",padding:"10px"}}>
                    <Video  video ={videoStream}/>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                            <input value={meetingUserName} onChange={(e)=>{
                                setMeetingUserName(e.target.value)
                            }} style={{outline:"none",borderRadius:"4px",fontSize:"!2px",border:"1px solid #777",padding:"4px 8px"}} placeholder="Name" />
                            <Button variant="standard" style={{color:"blue"}} onClick={handleJoin}> JOIN </Button>
                        </div>
                        <div style={{display:"flex",alignItems:"center"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <p style={{marginBottom:"0"}}>Video</p>
                                <Switch onChange={(e)=>{
                                    videoStream.getVideoTracks()[0].enabled = e.target.checked
                                    setVideoFeed(e.target.checked)
                                    dispatch({
                                        type:"SETVIDEOFEED",
                                        payload:{videoFeed:e.target.checked}
                                    })
                                }} checked={videoFeed}  color="secondary"/>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <p style={{marginBottom:"0"}}>Audio</p>
                                <Switch onChange={(e)=>{
                                    videoStream.getAudioTracks()[0].enabled = e.target.checked
                                    setAudioFeed(e.target.checked)
                                    dispatch({
                                        type:"SETAUDIOFEED",
                                        payload:{audioFeed:e.target.checked}
                                    })
                                }} checked={audioFeed}  color="secondary"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Lobby;

// setting the constraints of video box
const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Video = ({video}) => {
    const ref = useRef();

    useEffect(() => {
        if (video){
            ref.current.srcObject = video;
            ref.current.style.display="initial"
        }
    }, [video]);

    return (
        <video playsInline autoPlay ref={ref} style={{
            maxWidth:"100%",
            border:"2px solid #fff",
            borderRadius:"4px",
            display:"none",
            margin:"auto"
        }} />
    );
}
