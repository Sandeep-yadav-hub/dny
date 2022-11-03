import React, {useEffect,useState} from 'react';
import ChatUserCard from './chat.user.card.component';

// Material Ui imports
import { Grid } from '@mui/material';

// Material Ui icons
import SearchIcon from '@mui/icons-material/Search';
import ChatConversation from './chat.conversation.component';

import {socket} from "../helpers/socket.helper";
import { useSelector ,useDispatch} from 'react-redux';
import { socketConnected, socketDisconnected ,joinedServer,disJoinedServer,getChatUsers,addMessage} from '../actions/socket';


const users = [
    {id:"2",profilePic:"",name:"John", lastText:"Default last text to test the UI so we can handle long text also.",lastSent:""},
    {id:"3",profilePic:"",name:"Dow", lastText:"Default last text to test the UI so we can handle long text also.",lastSent:""},
    {id:"4",profilePic:"",name:"Robin", lastText:"Default last text to test the UI so we can handle long text also.",lastSent:""},
    {id:"5",profilePic:"",name:"Lily", lastText:"Default last text to test the UI so we can handle long text also.",lastSent:""},
    {id:"6",profilePic:"",name:"Marshel", lastText:"Default last text to test the UI so we can handle long text also.",lastSent:""},
    {id:"7",profilePic:"",name:"Ted", lastText:"Default last text to test the UI so we can handle long text also.",lastSent:""},
    {id:"8",profilePic:"",name:"Deep", lastText:"Default last text to test the UI so we can handle long text also.",lastSent:""},
    {id:"9",profilePic:"",name:"Default user", lastText:"Default last text to test the UI so we can handle long text also.",lastSent:""},
    
]


const Chat = ({setTabOpend}) => {

    let dispatch = useDispatch()
    const [currentConverstation,setCurrentConverstation] = useState(null)
    const userInfo = useSelector(state =>state.auth?.user || null)
    const socketConnectedStatus = useSelector(state=>state.socketInfo.connected)
    const socketJoinedStatus = useSelector(state=>state.socketInfo.joined)
    const usersToChatWith = useSelector(state=>state.socketInfo.usersToChatWith)
    const currentSocketId = useSelector(state=>state.socketInfo.socketId)


    const handelChatWith = (user)=>{
        setCurrentConverstation({
            profilePic:user.profilePic||"",
            name:user.username,
            id:user.id
        })
    }

    useEffect(() => {
        socket.on('connect', () => {
            console.log("connected",socket)
            
            dispatch(socketConnected({id:socket.id}))
        });
    
        socket.on('disconnect', (socket) => {
            console.log("disconnected",socket)
            dispatch(socketDisconnected())
            dispatch(disJoinedServer())
            // socket.emit("leave",{id:userInfo.id})
        });
        
        return () => {
            console.log("removing component")
            socket.off('connect');
            socket.off('disconnect');
        };
      }, []);
      useEffect(()=>{
        dispatch(getChatUsers())
        setTabOpend("CHAT")
      },[])


      useEffect(() => {
        if (socketConnectedStatus && !socketJoinedStatus){
            socket.emit("join",{username:userInfo.username,id:userInfo.id,socketId:currentSocketId})
            socket.on(`private message`,(data)=>{
                console.log("dispatching message")
                dispatch(addMessage({msgItem:data}))

            })
            dispatch(joinedServer())
        }else{
            console.log(socket)
            if (socket.connected){
                dispatch(socketConnected({id:socket.id}))
            }
            console.log("notEmmiting new socketId creating again")
        }

        return () => {
            if (!socketConnected && socketJoinedStatus){
                socket.emit("leave",{id:userInfo.id})
                dispatch(disJoinedServer())
            }
        };
      }, [socketConnectedStatus]);


    return (
        <Grid container style={{boxShadow:"0px 0px 4px #c3c3c3",height:"80vh"}}>
            <Grid item xs={3} style={{padding:"0px",boxShadow:"4px 0px 4px #f4f4f4",height: "80vh"}}>
                <div style={{width:"80%",margin:"10px auto 30px auto"}}>
                    <h3 onClick={()=>socket.emit("showAll",{})}>Messages</h3>
                </div>
                <div style={searchDivStyled}>
                    <SearchIcon />
                    <input style={searchInputStyled} placeholder="Search"/>
                </div>
                <div style={{marginTop:"15px",marginBottom:"15px",height:"61vh",overflow:"auto"}}>
                    <hr style={{width:"80%",margin:"auto"}}/>
                    {usersToChatWith.map((user,index)=>{
                        return(
                            <ChatUserCard key={index} onClick={()=>handelChatWith(user)} name={user.username||""} lastText={user.lastText|| ""} profilePic={""}/>
                        )
                    })}
                </div>
            </Grid>
            <Grid item xs={9} style={{padding:"10px"}}>
                <ChatConversation socket={socket} profilePic={currentConverstation?.profilePic} name={currentConverstation?.name} currentConverstation={currentConverstation}/>
            </Grid>
        </Grid>
    );
}


// css
const searchDivStyled = {
    padding:"5px 10px",
    border:"1px solid rgba(0, 0, 0, 0.23)",
    borderRadius:"4px",
    display:"flex",
    alignItems:"center",
    width:"80%",
    margin:"auto",
    fontSize:"12px"

}

const searchInputStyled={
    marginLeft:"5px",
    border:"1px solid transparent",
    outline:"none",
    width:"100%"
}
export default Chat;
