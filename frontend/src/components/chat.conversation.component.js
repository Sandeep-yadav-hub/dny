import React ,{useEffect,useState}from 'react';
import moment from 'moment'
import {useSelector,useDispatch} from "react-redux"
import {getChatList,getChatBetween} from "../actions/socket"

// Material Ui imports
import { Grid } from '@mui/material';


// Material Ui icons
import SendIcon from '@mui/icons-material/Send';
import { addMessage } from '../actions/socket';



const intial = [
    {id:1,msg:"Default last text to test the UI so we can handle long text also. Default last text to test the UI so we can handle long text also. Default last text to test the UI so we can handle long text also.",sentTo:2,sentBy:1,createdAt:new Date(),attached:false,attachmentType:"",attachment:"",parent:1},
    {id:2,msg:"hey",sentTo:2,sentBy:1,createdAt:new Date(),attached:false,attachmentType:"",attachment:"",parent:1},
    {id:5,msg:"hey",sentTo:2,sentBy:1,createdAt:new Date(),attached:false,attachmentType:"",attachment:"",parent:1},
    {id:8,msg:"hey",sentTo:2,sentBy:1,createdAt:new Date(),attached:false,attachmentType:"",attachment:"",parent:1},
    {id:9,msg:"hey",sentTo:2,sentBy:1,createdAt:new Date(),attached:false,attachmentType:"",attachment:"",parent:1},
    {id:10,msg:"hello",sentTo:4,sentBy:1,createdAt:new Date(),attached:false,attachmentType:"",attachment:"",parent:1},
    {id:11,msg:"hey",sentTo:4,sentBy:1,createdAt:new Date(),attached:false,attachmentType:"",attachment:"",parent:1},
    {id:12,msg:"hey",sentTo:4,sentBy:1,createdAt:new Date(),attached:false,attachmentType:"",attachment:"",parent:1},
    {id:13,msg:"hey hello",sentTo:1,sentBy:2,createdAt:new Date(),attached:false,attachmentType:"",attachment:"",parent:2},
    {id:14,msg:"hey",sentTo:1,sentBy:2,createdAt:new Date(),attached:false,attachmentType:"",attachment:"",parent:2},
    {id:15,msg:"hey",sentTo:1,sentBy:2,createdAt:new Date(),attached:false,attachmentType:"",attachment:"",parent:2},

]


const ChatConversation = ({profilePic,name,currentConverstation,socket}) => {
    let dispatch = useDispatch()
    const currentUserId = useSelector(state=>state.auth.user?.id)
    const [messages,setMessages] = useState([])
    const allMessages = useSelector(state=>state.socketInfo)
    const[text,setText] = useState("")

    const handleSendingText = async()=>{
        var senderId = currentUserId
        var parent = currentUserId
        var reciverId = currentConverstation.id
        // var text = text
        console.log(text)
        var data = {
            msg:text,
            sentTo:currentConverstation.id,
            sentBy:currentUserId,
            createdAt:new Date(),
            attached:false,
            attachmentType:"",
            attachment:"",
            parent:currentUserId
        }
        dispatch(addMessage({msgItem:data}))

        socket.emit("textMessage",{data})
    }
    useEffect(() => {
        if (currentConverstation){
            setMessages(allMessages.messages.filter((item,index)=>{
                if (item){
                    if(item.sentTo == currentConverstation.id || item.sentBy == currentConverstation.id){
                        return item
                    }
                }
            }))
            console.log("hello")
        }
        return () => {
            setMessages([])
            console.log(messages)
        };
    }, [allMessages]);

    useEffect(() => {
        dispatch(getChatList({parent:currentUserId})).then(data=>{
            console.log({data})
            dispatch({
                type:"messageFromDB",
                payload:{msgItems:data}
            })
        })
    }, [currentConverstation]);

    if (currentConverstation == null){
        return (
            <div>
                Start a Converstation
            </div>
        )
    }else{
        return (
            <>
                <Grid container  style={{width:"80%",margin:"auto",height:"90px",border:"0px",borderBottom:"1px solid rgba(0, 0, 0, 0.23)",alignItems:"center"}}>
                    <Grid item xs={1} >
                        <div style={{border:"0px",borderRadius:"50%",backgroundColor:"#f4f4f4",width:"50px",height:"50px"}}>
                            <img src={profilePic?profilePic:""} style={{border:"0px",borderRadius:"50%",width:"50px",height:"50px"}} />
                        </div>
                    </Grid>
                    <Grid item xs={10} style={{marginLeft:"10px"}}>
                        <p style={{fontSize:"14px",fontWeight:"400",margin:"0"}}>{name?name:"Default User"}</p>
                    </Grid>
                </Grid>
                <Grid container flexDirection={"column"} style={{width:"80%",margin:"auto", padding:"10px 0px 10px 0px"}}>
                    <div style={{height:"50vh",overflow:"auto",padding:"10px"}}>
                        {messages.map((item,index)=>{
                            if (item){
                                // console.log(item.parent == currentUserId && item.sentTo==currentConverstation.id,item.sentTo == currentUserId && item.sentBy == currentConverstation.id )
                                // console.log(item,currentUserId,currentConverstation)
                                if (item.parent == currentUserId && item.sentTo==currentConverstation.id){
                                    return(
                                        <ReciverText key={item.id?item.id:index+1} text={item.msg} id={item.id?item.id:index+1} sentAt={item.createdAt}/>
                                    )
                                }else if(item.sentTo == currentUserId && item.sentBy == currentConverstation.id ){
                                    return(
                                        <SendersText key={item.id?item.id:index+1} text={item.msg} id={item.id?item.id:index+1} sentAt={item.createdAt}/>
                                    )
                                }
                            }
                        })}
                    </div>
                    <hr />
                    <div style={{display:"flex",alignItems:"center"}}>
                        <input  placeholder="Type something..." onChange={(e)=>setText(e.target.value)} value={text} style={{padding:"5px",outline:"none",border:"none",fontSize:"12px",width:"100%"}} />
                        <div style={{width:"max-content"}}>
                            <SendIcon onClick={handleSendingText}/>
                        </div>
                    </div>
    
    
                </Grid>
            </>
        );
    }
}


const ReciverText = ({text,id,sentAt})=>{
    return(
        <div style={{display:"flex",alignItems:"center"}}>
            <div style={reciverText}>
                <span style={{marginRight:"10px"}}>
                    {text}
                </span>
                <div style={{display:"flex",alignItems:"end",fontSize:"9px"}}>
                    <span style={{width:"45px",marginLeft:"auto"}}>{moment(sentAt).format("hh:mm a")}</span>
                </div>
            </div>
        </div>
    )
}

const SendersText = ({text,id,sentAt})=>{
    return(
        <div style={{display:"flex",alignItems:"center"}}>
            <div style={sendersText}>
                <span style={{marginRight:"10px"}}>
                    {text}
                </span>
                <div style={{display:"flex",alignItems:"end",fontSize:"9px"}}>
                    <span style={{width:"45px",marginRight:"auto"}}>{moment(sentAt).format("hh:mm a")}</span>
                </div>
            </div>
        </div>
    )
}

// styling
const reciverText = {
    maxWidth: "80%",
    minWidth: "40px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: "10px",
    background: "#282828",
    color: "#fff",
    borderRadius: "8px 8px 0px 8px",
    marginBottom:"20px",
    marginLeft:"auto",
    display:"flex"
}

const sendersText = {
    maxWidth: "80%",
    minWidth: "40px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: "10px",
    background: "#434343",
    color: "#fff",
    borderRadius: "0px 8px 8px 8px",
    marginBottom:"20px",
    display:"flex"
}

export default ChatConversation;
