import { Button, Grid} from '@mui/material';
import React ,{useContext} from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CalenderContext from '../../context/calender.context';

import dayjs from "dayjs"

const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 12,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: 'transparent',
    borderColor: '#5f6368',
    '&:hover': {
        backgroundColor: '#F1F3F4',
        borderColor: '#5f6368',
        boxShadow: 'none',
    },
    '&:active':{
        backgroundColor: '#F1F3F4',
        borderColor: '#5f6368',
        boxShadow: 'none',
    },
    // '&:focus': {
    //     boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    // },
  });

const HeaderComponent = ({monthIdx,setMonthIdx}) => {

    const handlePrevMonth = ()=>{
        console.log(monthIdx)
        setMonthIdx(monthIdx-1)
    }
    const handleNextMonth = ()=>{
        console.log(monthIdx)
        setMonthIdx(monthIdx+1)
    }
    const handelReset = ()=>{
        console.log(dayjs().month())
        setMonthIdx(dayjs().month())
    }

    return (
        <Grid container style={{marginBottom:"5px"}}>
            <Grid item xs={2}>
                <h3 style={calenderTitle}>Calender</h3>
            </Grid>
            <Grid item xs={10} style={{display:"flex",paddingLeft:"15px"}}>
                <BootstrapButton onClick={handelReset} variant="outlined" style={{color:"#3C4043"}}>Today</BootstrapButton>
                <div style={{marginLeft:"10px"}}>
                    <IconButton onClick={handlePrevMonth} aria-label="previous" size="small">
                        <KeyboardArrowLeftIcon />
                    </IconButton> 
                    <IconButton onClick={handleNextMonth} aria-label="previous" size="small" style={{marginLeft:"5px"}}>
                        <KeyboardArrowRightIcon/>
                    </IconButton> 
                </div>
                <div style={{display:"flex",alignItems:"center",marginLeft:"10px"}}>
                    <span>
                        {dayjs(new Date(dayjs().year(),monthIdx)).format("MMMM YYYY")}
                    </span>
                </div>
            </Grid>
        </Grid>
    );
}

const calenderTitle = {
    display: "inline-block",
    fontSize: "22px",
    lineHeight: "24px",
    color:"#5f6368"
}
export default HeaderComponent;
