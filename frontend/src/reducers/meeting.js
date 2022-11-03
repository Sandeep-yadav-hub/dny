import { SETMEETINGID, SETISMEETINGADMIN,SETMEETINGMESSAGE,SETISENDED,SETISPRESENTING,SETVIDEOFEED,SETAUDIOFEED,RESETMEETINGSTORE } from "../actions/type";


const initalState = {
    meetingId:null,
    isAdmin:false,
    messages:[],
    isEnded:true,
    isPresenting:false,
    videoFeed:false,
    audioFeed:false
}

export default function (state = {...initalState}, action) {
  const { type, payload } = action;
  switch (type) {
    case SETMEETINGID:
        return {...state,meetingId:payload.meetingId}
    case SETISMEETINGADMIN:
        return {...state,isAdmin:payload.isAdmin}
    case SETISENDED:
        return {...state,isEnded:payload.isEnded}
    case SETISPRESENTING:
        return {...state,isPresenting:payload.isPresenting}
    case SETVIDEOFEED:
        return {...state,videoFeed:payload.videoFeed}
    case SETAUDIOFEED:
        return {...state,audioFeed:payload.audioFeed}
    case SETMEETINGMESSAGE:
        var newState = {...state}
        newState.messages.push(payload.msgItem)
        return newState
    case RESETMEETINGSTORE:
        return initalState
    default:
      return state;
  }
}
