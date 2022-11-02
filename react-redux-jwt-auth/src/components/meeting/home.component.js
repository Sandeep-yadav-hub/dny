import React,{useState,useContext, useEffect} from 'react';
import Header from './header.component';
import {useNavigate} from "react-router-dom"
import VideoCallIcon from '@mui/icons-material/VideoCall';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { Button, Grid, IconButton } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import MeetingContext from '../../context/meeting.context';
import { useDispatch } from 'react-redux';

const infoCarousel = [
    {title:"Your meeting is safe.",des:"No one can join meeting unless invited or admitted by the host."},
    {title:"Get a link you can share", des:"Click on New Meeting to get link you can send to people you want to have meeting with."}
]

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

const Home = () => {
    let history = useNavigate()
    const [currentInfoToShow,setCurrentInfoToShow] = useState(0)
    const {meetingUserName,setMeetingUserName,meetingId,setMeetingId} = useContext(MeetingContext)
    const [meetingLink,setMeetingLink] = useState(null)

    const makeMeetingId = ()=>{
        let id  = `${makeid(4)}-${makeid(3)}-${makeid(3)}-${makeid(4)}`
        setMeetingId(id)
        return id
    }

    const openLink = (url) => window.location = url;

    useEffect(()=>{
        document.getElementById("root").style.background = "#fff"
        document.getElementById("root").style.height = "100vh"
        document.getElementsByTagName("main")[0].style.marginRight =  `0px`
        return ()=>{
            document.getElementById("root").style.background = "#fff"
        }
    },[])

    return (
        <>
            <Header />
            <Grid container>
                <Grid item xs={6}>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"80vh"}}>
                        <h1 style={{fontWeight:"400"}}>Video Meetings. Now free for everyone.</h1>
                        <div style={{width:"100%",display:"flex",alignItems:"center",marginTop:"20px"}}>
                            <Button variant='contained' onClick={()=>history(`/meeting/waiting/${makeMeetingId()}`)} style={{display:"flex",alignItems:"center",padding:"10px 15px"}}>
                            {/* <Button variant='contained' onClick={()=>history(`/meeting/waiting#init`)} style={{display:"flex",alignItems:"center",padding:"10px 15px"}}> */}
                            
                                <VideoCallIcon style={{marginTop:"-2px",marginRight:"3px"}} />
                                New Meeting
                            </Button>
                            <div style={{marginLeft:"20px",display:"flex",justifyContent:"center",alignItems:"center",padding:"8px 15px", borderRadius:"4px", border:"1px solid #555",background:"transparent"}}>
                                <KeyboardIcon />
                                <input style={{marginLeft:"5px",border:"0px",outline:"none",width:"100%",height:"100%"}} value={meetingLink?meetingLink:""} onChange={(e)=>setMeetingLink(e.target.value)} placeholder="Enter a code or link"/>
                            </div>
                            <Button variant="text" onClick={()=>{
                                if (meetingLink){
                                    if (!meetingLink.includes(window.location.host)){
                                        if (meetingLink.split("-").length==4){
                                            history(`/meeting/waiting/${meetingLink}`)
                                        }else{
                                            console.log("Invalid Code")
                                        }
                                    }else{
                                        var meetID = meetingLink.split("waiting/")[1]
                                        if (meetID.split("-").length==4){
                                            history(`/meeting/waiting/${meetID}`)
                                        }else{
                                            console.log("Invalid Link")
                                        }
                                    }
                                }else{
                                    console.log("Invalid Link or Code")
                                }
                            }}>Join</Button>
                        </div>
                    </div> 
                </Grid>
                <Grid item xs={6} style={{position:"relative"}}>
                    <IconButton style={{position:"absolute",top:"50%",left:"60px",transform:"translateY(-100%)"}} onClick={()=>{
                        setCurrentInfoToShow(prev=>{
                            if (prev-1<0){
                                return infoCarousel.length-1
                            }else{
                                return prev-1
                            }
                        })
                    }}>
                        <KeyboardArrowLeft />
                    </IconButton>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"80vh"}}>
                        {infoCarousel.map((item,idx)=>{
                            if (idx == currentInfoToShow){
                                return(
                                    <div key={idx} style={{width:"50%",textAlign:"center"}}>
                                        <h3 style={{fontWeight:"400"}}>{item.title}</h3>
                                        <p>{item.des}</p>
                                    </div>
                                )
                            }
                        })}
                        <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",width:"50%"}}>
                            {infoCarousel.map((item,idx)=>{
                                let background = "gray"
                                if (idx==currentInfoToShow){
                                    background = "blue"
                                }
                                return(
                                    <span key={idx} style={{width:"5px",height:"5px",background:background,margin:"2px"}}></span>
                                )
                            })}
                        </div>
                    </div>
                    <IconButton style={{position:"absolute",top:"50%",right:"60px",transform:"translateY(-100%)"}} onClick={()=>{
                        setCurrentInfoToShow(prev=>{
                            if (prev+1>infoCarousel.length-1){
                                return 0
                            }else{
                                return prev+1
                            }
                        })
                    }}>
                        <KeyboardArrowRight />
                    </IconButton>
                </Grid>

            </Grid>
        </>
    );
}

export default Home;
