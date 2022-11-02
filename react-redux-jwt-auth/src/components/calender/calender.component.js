import React, {useEffect,useState,useContext} from 'react';
import {getMonth} from "../../helpers/calender.helper"
import CalenderHeader from "./header.component"
import CalenderMonth from "./month.component"
import CalenderSidebar from './sidebar.component';

import dayjs from "dayjs"

// import CalenderContext from '../../context/calender.context';
// import CalenderContextWrapper from '../../context/calender.context.wrapper';

// material ui imports
import { Grid } from '@mui/material';

const CalenderComponent = ({setTabOpend}) => {
    const [currentMonth,setCurrentMonth] = useState(getMonth())
    const [monthIdx,setMonthIdx] = useState(dayjs().month())

    const [selectedLableToShow, setSelectedLableToShow] = React.useState('all');

    useEffect(()=>{setTabOpend("CALENDER")},[])

    useEffect(() => {
        setCurrentMonth(getMonth(monthIdx))

    }, [monthIdx]);
    
    return (
        <>
           <CalenderHeader monthIdx={monthIdx} setMonthIdx={setMonthIdx}/>
            <div>
                <Grid container >
                    <Grid item xs={2}>
                        <CalenderSidebar globalMonthIdx={monthIdx} selectedLableToShow={selectedLableToShow} globalSetMonthIdx={setMonthIdx} setSelectedLableToShow={setSelectedLableToShow}/>
                    </Grid>
                    <Grid item xs={10} style={{paddingLeft:"15px"}}>
                        <CalenderMonth month={currentMonth} setMonthIdx={setMonthIdx} selectedLableToShow={selectedLableToShow} />
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default CalenderComponent;
