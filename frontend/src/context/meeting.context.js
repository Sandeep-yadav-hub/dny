import React from "react"
import dayjs from "dayjs"

const MeetingContext = React.createContext({
    test:"",
    setTest:()=>{},
    meetingUserName:"",
    setMeetingUserName:()=>{},
    meetingId:null,
    setMeetingId:()=>{},
    localStream:null,
    setLocalStream:()=>{},
    volumeCallback: null,
    setVolumeCallback:()=>{},
    volumeInterval :null,
    setVolumeInterval:()=>{},
    isAdminOfMeeting: false,
    setIsAdminOfMeeting : ()=>{}
})

export default MeetingContext