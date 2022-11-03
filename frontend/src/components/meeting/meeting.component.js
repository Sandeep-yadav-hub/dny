import React,{useContext,useState,useEffect} from 'react';
import Header from './header.component';
import {Route,Routes} from "react-router-dom"

import MeetingContext from '../../context/meeting.context';
import CallPage from './callPage.component';
import Home from './home.component';
import Lobby from './lobby.component';

const Meeting = ({setTabOpend}) => {
    const [test,setTest] = useState("hello")
    const [meetingUserName,setMeetingUserName] = useState("Anonymous")
    const [meetingId,setMeetingId] = useState("Anonymous")
    const [localStream,setLocalStream]= useState(null)
    const [volumeCallback,setVolumeCallback] = useState(null)
    const [volumeInterval,setVolumeInterval] = useState()
    const [messages,setMessages] = useState([])
    const [isAdminOfMeeting,setIsAdminOfMeeting]= useState(false)
    const [meetingLobbyUsers,setMeetingLobbyUsers] = useState([])
    const [meetingRoomUsers,setMeetingRoomUsers] = useState([])

    useEffect(()=>{setTabOpend("MEETING")},[])

    return (
        <MeetingContext.Provider value={{
            test,
            setTest,
            meetingUserName,
            setMeetingUserName,
            meetingId,
            setMeetingId,
            localStream,
            setLocalStream,
            volumeCallback,
            setVolumeCallback,
            volumeInterval,
            setVolumeInterval,
            messages,
            setMessages,
            isAdminOfMeeting,
            setIsAdminOfMeeting,
            meetingLobbyUsers,
            setMeetingLobbyUsers,
            meetingRoomUsers,
            setMeetingRoomUsers
        }}>
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/waiting/:id" element={<Lobby />} />
                <Route path="/call_page/:id" element={<CallPage />} />
            </Routes>
        </MeetingContext.Provider>
    );
}

export default Meeting;
