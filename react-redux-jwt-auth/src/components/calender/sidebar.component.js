import React from 'react';
import CalenderSmall from './calender.small.component';
import CreateEventButton from './createEventButton.component';
import {Grid, Stack } from '@mui/material';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const lables = ["purple","red","blue","yellow","green"]

const SidebarComponent = ({globalMonthIdx,globalSetMonthIdx,selectedLableToShow, setSelectedLableToShow}) => {

    const handleChange = (event) => {
        setSelectedLableToShow(event.target.value);
    };

    return (
        <Stack spacing={2}>
            <CreateEventButton />
            <CalenderSmall globalMonthIdx={globalMonthIdx} globalSetMonthIdx={globalSetMonthIdx}/>
            <>
            <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">Lables</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={selectedLableToShow}
                    onChange={handleChange}
                    sx={{
                        "& .MuiFormControlLabel-root":{width:"100%",marginTop:0},
                        "& .MuiFormControlLabel-label": {width:"100%",padding:"4px 8px"} 
                    }} 
                    
                >
                    <FormControlLabel value={"all"} control={<Radio />} label={"Show all"} />
                    {lables.map((lable,idx)=>{
                        return(
                            <Grid key={idx} sx={{
                                "& .MuiFormControlLabel-label": {background:lable,borderRadius:"4px",color:"#fff"} 
                            }} >
                                <FormControlLabel value={lable} control={<Radio />} label={lable} />
                            </Grid>
                        )
                    })}
                </RadioGroup>
                </FormControl>
            </>
            
        </Stack>
    );
}

export default SidebarComponent;
