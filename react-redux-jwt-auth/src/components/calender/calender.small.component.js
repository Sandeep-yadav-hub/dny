import React, {useEffect,useState,useContext} from 'react';
import {getMonth} from "../../helpers/calender.helper"
import CalenderMonth from "./month.component"

import dayjs from "dayjs"

import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Grid,Button } from '@mui/material';
import { Stack } from '@mui/system';


const CalenderSmall = ({globalMonthIdx,globalSetMonthIdx}) => {
    const [currentMonth,setCurrentMonth] = useState(getMonth())
    const [monthIdx,setMonthIdx] = useState(dayjs().month())

    const handlePrevMonth = ()=>{
        console.log(monthIdx)
        setMonthIdx(monthIdx-1)
    }
    const handleNextMonth = ()=>{
        console.log(monthIdx)
        setMonthIdx(monthIdx+1)
    }

    useEffect(() => {
        setCurrentMonth(getMonth(monthIdx))
    }, [monthIdx]);

    useEffect(() => {
        setMonthIdx(globalMonthIdx)
    }, [globalMonthIdx]);

    return (
        <>
            <Stack spacing={2}>
                <Stack spacing={2} direction={"row"} style={{alignItems:"center",justifyContent:"space-between"}}>
                    <span>
                        {dayjs(new Date(dayjs().year(),monthIdx)).format("MMMM YYYY")}
                    </span>
                    <div>
                        <IconButton onClick={handlePrevMonth} aria-label="previous" size="small">
                            <KeyboardArrowLeftIcon />
                        </IconButton> 
                        <IconButton onClick={handleNextMonth} aria-label="previous" size="small">
                            <KeyboardArrowRightIcon/>
                        </IconButton> 
                    </div>
                </Stack>
                <Grid container>
                    <CalenderMonth month={currentMonth} small={true} setMonthIdx={globalSetMonthIdx} />
                </Grid>
            </Stack>
        </>
    );
}

export default CalenderSmall;
