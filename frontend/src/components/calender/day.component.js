import React,{useEffect,useState, useRef} from 'react';
import dayjs from "dayjs"
import {useSelector} from "react-redux"

import {Experimental_CssVarsProvider, Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';




const DayComponent = ({day,i,setMonthIdx,selectedLableToShow,selcDate,setSelcDate,setOpenDialog,setSelcDateForEvent,setClickedEvent,small=false}) => {
    const dayEvents  = useSelector(state=>state.calender)
    const [events,setEvents] = useState([])
    const handleMonthChangeOnDateClick = (day)=>{
        setMonthIdx(day.month())
        setSelcDate(day)
    }

    const getDayClass=(day)=>{
        var format="DD-MM-YY"
        var currDay = day.format(format)
        var nowDay = dayjs().format(format)
        var selectedDay = selcDate && selcDate.format(format)
        if (nowDay==currDay){
            return "currentCalenderDay textWhite"
        }else if (selectedDay == currDay){
            return "clickedCalenderDay textBlack"
        }else{
            if (day.month()==dayjs().month()){
                return "textBlack"
            }
            return "textGray"
        }
    }

    const updateEvents = ()=>{
        const evts = dayEvents.filter((evt=>{
            if (dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")){
                if (selectedLableToShow == "all"){
                    return evt
                }else if (selectedLableToShow == evt.lable){
                    return evt
                }
            }
        }))
        setEvents(evts)
    }
    
    useEffect(()=>{
        updateEvents()
    },[day,dayEvents,selectedLableToShow])
    
    if (small){
        return(
            <Grid item xs={12/7} style={{textAlign:"center",border:"none"}}>
                {i==0 &&(
                    <p style={{marginBottom:"2px",color:"gray",fontSize:"12px"}}>{day.format('ddd').toUpperCase()[0]}</p>
                )}
                <IconButton className={`${getDayClass(day)}`} onClick={()=>handleMonthChangeOnDateClick(day )} style={{padding: "5px"}}>
                    <span style={{fontSize:"12px"}}>
                        {day.format('DD')}
                    </span>
                </IconButton>
            </Grid>
        )
    }
    return (
        <Grid  onClick={(e)=>{
            if (e.target.id.includes("event")){
                setClickedEvent(events[e.target.id.split("_")[1]])
            }else{
                setClickedEvent(null)
                setSelcDateForEvent(day)
                setOpenDialog(true)
            }
        }} item xs={12/7} style={{height:"120px",textAlign:"center",border:"1px solid gray"}}>
            {i==0 &&(
                <p style={{marginBottom:"2px",color:"gray",fontSize:"12px"}}>{day.format('ddd').toUpperCase()}</p>
            )}
            <div  style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:"12px",marginTop:"2px",marginBottom:"2px",borderRadius:"50%",fontSize:"13px",padding:"5px 8px",background:day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")?"blue":"",color:day.format("DD-MM-YY").split("-")[1]==dayjs().format("DD-MM-YY").split("-")[1]?(day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")?"#fff":"#000"):"gray"}}>
                    {day.format('DD')}
                </span>
                {events.map((evt,idx)=>{
        
                    if (events.length<3){
                        return(
                            <div id={`event_${idx}`} key={idx} style={{textAlign:"left",background:`${evt.lable}`,width:"90%",borderRadius:"4px",color:"#f4f4f4",overflow:"hidden",padding:"4px 4px",textOverflow: "ellipsis",whiteSpace:"nowrap",fontSize:"12px",marginTop:idx==0?"0px":"3px"}}>{evt.title}</div>
                        )
                    }else if (events.length >=3 && idx<1 ){
                        return(
                            <div id={`event_${idx}`} key={idx} style={{textAlign:"left",background:`${evt.lable}`,width:"90%",borderRadius:"4px",color:"#f4f4f4",overflow:"hidden",padding:"4px 4px",textOverflow: "ellipsis",whiteSpace:"nowrap",fontSize:"12px",marginTop:idx==0?"0px":"3px"}}>{evt.title}</div>
                        )
                    }
                })}
                {events?.length>2&&(
                    <div id ={"more"} style={{ color:"#000 !important",textAlign:"left",background:"transparent",width:"90%",borderRadius:"4px",overflow:"hidden",padding:"4px 4px",textOverflow: "ellipsis",whiteSpace:"nowrap",fontSize:"12px",marginTop:"2px"}}>+ More</div>
                )}
            </div>
        </Grid>
    );
}


export default DayComponent;
