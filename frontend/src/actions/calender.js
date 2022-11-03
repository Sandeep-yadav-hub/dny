
export const createCalenderEvent = (data)=>(dispatch)=>{
    dispatch({
        type:"PUSH_EVENT_CALENDER",
        payload:data
    })
}

export const editCalenderEvent = (data)=>(dispatch)=>{
    dispatch({
        type:"UPDATE_EVENT_CALENDER",
        payload:data
    })
}

export const deleteCalenderEvent = (data)=>(dispatch)=>{
    dispatch({
        type:"DELETE_EVENT_CALENDER",
        payload:data
    })
}

