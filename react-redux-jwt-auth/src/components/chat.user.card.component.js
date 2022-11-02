import React from 'react';

// Material Ui imports
import { Grid } from '@mui/material';

const ChatUserCard = ({name,lastText,lastSent,profilePic,onClick}) => {
    return (
        <div className="useCardMainDiv" onClick={onClick}>
            <Grid container style={{width:"80%",margin:"auto",height:"90px",border:"0px",borderBottom:"1px solid rgba(0, 0, 0, 0.23)",alignItems:"center"}}>
                <Grid item xs={3} >
                    <div style={{border:"0px",borderRadius:"50%",backgroundColor:"#f4f4f4",width:"50px",height:"50px"}}>
                        <img src={profilePic?profilePic:""} style={{border:"0px",borderRadius:"50%",width:"50px",height:"50px"}} />
                    </div>
                </Grid>
                <Grid item xs={7} style={{marginLeft:"10px"}}>
                    <p style={{fontSize:"14px",fontWeight:"400",margin:"0"}}>{name?name:"Default User"}</p>
                    <div style={{height:"16px",fontSize:"12px",margin:"0",overflow: "hidden",textOverflow: "ellipsis"}}>{lastText?lastText:"Default last text to test the UI so we can handle long text also."}</div>
                </Grid>
            </Grid>
        </div>
    );
}

// styling

const userCardStyled={
    width:"80%",
    margin:"auto",
    padding:"5px",
    height:"90px",
    border:"0px",
    // borderTop:"1px solid rgba(0, 0, 0, 0.23)",
    borderBottom:"1px solid rgba(0, 0, 0, 0.23)",
    display:"flex",
    alignItems:"center"

}

export default ChatUserCard;
