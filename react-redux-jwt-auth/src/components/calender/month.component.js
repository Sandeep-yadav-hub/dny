import React, { useEffect, useState } from 'react';

import { Grid } from '@mui/material';
import DayComponent from './day.component';
import dayjs from "dayjs"
import CreateEventButton from './createEventButton.component';

const MonthComponent = ({month,setMonthIdx,selectedLableToShow,small=false}) => {
    const [selcDate,setSelcDate] = useState(null)
    const [openDialog,setOpenDialog] = useState(false)
    const [selcDateForEvent,setSelcDateForEvent] = useState(dayjs())
    const [selcDateEvent,setSelcDateEvent] = useState([])
    const [clickedEvent,setClickedEvent] = useState(null)

    useEffect(()=>{
        // console.log(openDialog)
    },[openDialog])
    return (
        <Grid container style={{display:"flex",flexDirection:"row",border:!small?"1px solid gray":"none"}}>
            {month.map((row,i)=>{
                return (
                    <Grid key={i} item xs={12} style={{display:"flex",flexDirection:"row",width:small?"":"100%"}}>
                        {row.map((day,idx)=>{
                            return(
                                <DayComponent setClickedEvent={setClickedEvent} selectedLableToShow={selectedLableToShow} setOpenDialog={setOpenDialog} key={idx} day={day} i={i} small={small} month={month} setMonthIdx={setMonthIdx} selcDate={selcDate} setSelcDate={setSelcDate} setSelcDateForEvent={setSelcDateForEvent} setSelcDateEvent={setSelcDateEvent}/>
                            )
                        })}
                    </Grid>
                )
            })}
            <CreateEventButton clickedEvent={clickedEvent} setClickedEvent={setClickedEvent} day={selcDateForEvent} openDialog={openDialog} showCreateButton={false} setOpenDialog={setOpenDialog} setSelcDateEvent={setSelcDateEvent} events={selcDateEvent}/>
        </Grid>
    );
}

export default MonthComponent;
