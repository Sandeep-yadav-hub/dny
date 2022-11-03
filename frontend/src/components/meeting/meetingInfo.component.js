import React, { useEffect, useState,useContext } from 'react';

import Close from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SecurityIcon from '@mui/icons-material/Security';
import MeetingContext from '../../context/meeting.context';
import { useParams } from 'react-router';

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

const MeetingInfo = () => {
    let {id} = useParams()
    const [callId,setCallId] = useState("")
    const [open,setOpen] = useState(false)
    const {meetingUserName,setMeetingUserName,meetingId,setMeetingId} = useContext(MeetingContext)
    const isAdmin = window.location.hash == "#init" ? true : false;
    
    useEffect(()=>{
        console.log({meetingId})
        if (isAdmin) {
            setOpen(true);
          }
        if (meetingId){
            setCallId(meetingId) 
        }
    },[meetingId])
    useEffect(() => {
        setMeetingId(id)
    }, [id]);
    return (
        <>
            {open && (
                <div style={{width:"350px",padding:"10px",background:"#fff",borderRadius:"5px",position:"absolute",top:"350px",left:"-10px",zIndex:"10"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <h5 style={{fontWeight:400}}>Your meeting's ready</h5>
                        <IconButton onClick={()=>setOpen(false)}>
                            <Close style={{width:"20px",height:"20px"}} />
                        </IconButton>
                    </div>
                    <p style={{fontSize:"14px"}}>Share this meeting link with others you want in the meeting.</p>
                    <div style={{display:"flex",alignItems:"center",background:"#f4f4f4",padding:"4px 6px",justifyContent:"space-between"}}>
                        <p style={{marginBottom:"0",fontSize:"10px"}}>{window.location.host}/meeting/waiting/{callId}</p>
                        <IconButton onClick={()=>{
                                navigator.clipboard.writeText(`${window.location.host}/meeting/waiting/${callId}`)
                            }}>
                            <ContentCopyIcon  style={{width:"20px",height:"20px"}}/>
                        </IconButton>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px"}}>
                        <SecurityIcon style={{color:"blue",width:"18px",height:"18px"}}/>
                        <p style={{marginBottom:"0",fontSize:"12px",marginLeft:"10px",lineHeight:"15px",color:"#555"}}>People who use this meeting link must get your permission before they can join.</p>
                    </div>
                    <p style={{fontSize:"12px",color:"#555",marginTop:"10px"}}>Joined as {meetingUserName}</p>
                </div>
            )}
        </>
    );
}

export default MeetingInfo;
