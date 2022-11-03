import React, {useEffect,useState} from 'react';
import {getMonth} from "../../helpers/calender.helper"

import dayjs from "dayjs"

import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAttendance } from '../../actions/general';

const getDayClass=(day)=>{
    var format="DD-MM-YY"
    var currDay = day.format(format)
    var nowDay = dayjs().format(format)
    if (nowDay==currDay){
        return "textBlack"
    }else{
        if (day.month()==dayjs().month()){
            return "textBlack"
        }
        return "textGray"
    }
}

const AttendanceEmployee = ({currentEmployee}) => {
    let dispatch = useDispatch()
    const [currentMonth,setCurrentMonth] = useState([])
    const [currentMonthCount,setCurrentMonthCount] = useState(dayjs().month())
    const employeeAttendance = useSelector(state=>state.hr.attendance)
    const [currentEmployeeAttendance,setCurrentEmployeeAttendance] = useState()


    useEffect(() => {
        setCurrentMonth(getMonth(currentMonthCount))
    }, [currentMonthCount]);

    useEffect(()=>{
        if(employeeAttendance[currentEmployee.personalDetails.empId]){
            setCurrentEmployeeAttendance(employeeAttendance[currentEmployee.personalDetails.empId])
        }else{
            setCurrentEmployeeAttendance({})
        }
    },[employeeAttendance,currentEmployee])

    useEffect(() => {
        if(!employeeAttendance[currentEmployee.personalDetails.empId]){
            dispatch(getAttendance({id:currentEmployee.personalDetails.empId}))
        }
    }, [currentEmployee]);
    

    return (
        <div>
            <>
                <div style={{display:"flex",alignItems:"center",marginTop:"20px",marginBottom:"10px"}}>
                    <p style={{display:"block",marginBottom:"0",marginRight:"10px"}}>{dayjs(new Date(dayjs().year(),currentMonthCount)).format("MMMM YYYY")}</p>
                    <IconButton onClick={()=>{
                        setCurrentMonthCount(prev=>prev-1)
                    }} aria-label="previous" size="small">
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    {/* {currentMonthCount<dayjs().month() &&( */}
                        <IconButton onClick={()=>{
                            setCurrentMonthCount(prev=>prev+1)

                        }} aria-label="previous" size="small">
                            <KeyboardArrowRightIcon/>
                        </IconButton>
                    {/* )} */}
                    <IconButton onClick={()=>{
                        setCurrentMonthCount(dayjs().month())

                    }} style={{borderRadius:"5px",fontSize:"14px",padding:"5px 7px"}} aria-label="Today" size="small">
                        Today
                    </IconButton>
                </div>
                <Grid item xs={12} style={{display:"flex",flexDirection:"row",width:"100%"}}>
                    {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((item,i)=>{
                        return(
                            <div key={i} style={{width:"100%",height:"50px",display:"flex",alignItems:"center"}}>
                                <p style={{width:"100%",textAlign:"center",marginBottom:"0",fontSize:"14px",color:"#999"}}>{item}</p>
                            </div> 
                        ) 
                    })}
                </Grid>
                <div style={{display:"flex",alignItems:"center"}}>
                    <Grid container style={{display:"flex",flexDirection:"row",border:"1px solid #999",borderRadius:"4px"}}>
                        {currentMonth?.map((week,id)=>{
                            return (
                                <>
                                    {/* {id==0 && (
                                        
                                        
                                    )} */}
                                    <Grid key={id} item xs={12} style={{display:"flex",flexDirection:"row",width:"100%"}}>
                                        {week.map((day,i)=>{
                                            var isCurrentDay = (dayjs().format("DD-MM")==day.format("DD-MM")&& currentMonthCount==dayjs().month())
                                            var isLast = week.indexOf(day)==week.length-1
                                            var isLastWeek = currentMonth.indexOf(week)==currentMonth.length-1
                                            var isPresentTodayLoggedIn = currentEmployeeAttendance?(currentEmployeeAttendance[day.format("YYYY-MM-DD")]?(currentEmployeeAttendance[day.format("YYYY-MM-DD")].intime?true:false):false):false
                                            var valueTodayLoggedIn = currentEmployeeAttendance?(currentEmployeeAttendance[day.format("YYYY-MM-DD")]?(currentEmployeeAttendance[day.format("YYYY-MM-DD")].intime?dayjs(currentEmployeeAttendance[day.format("YYYY-MM-DD")].intime).format("HH:mm"):""):""):""

                                            var isPresentTodayLoggedOut = currentEmployeeAttendance?(currentEmployeeAttendance[day.format("YYYY-MM-DD")]?(currentEmployeeAttendance[day.format("YYYY-MM-DD")].outtime?true:false):false):false
                                            var valueTodayLoggedOut = currentEmployeeAttendance?(currentEmployeeAttendance[day.format("YYYY-MM-DD")]?(currentEmployeeAttendance[day.format("YYYY-MM-DD")].outtime?dayjs(currentEmployeeAttendance[day.format("YYYY-MM-DD")].outtime).format("HH:mm"):""):""):""
                                            var isSunday = week.indexOf(day)==0

                                            return (
                                                <div className={`${getDayClass(day)}`} key={i} style={{width:"100%",minHeight:"70px",padding:"5px",borderBottom:isLastWeek?"0px":"1px solid #999",borderRight:isLast?"0px":"1px solid #999"}}>
                                                    <p style={{width:"100%",textAlign:"center",marginBottom:"0",fontSize:"14px"}}>{day.format("DD")}</p>
                                                    {isPresentTodayLoggedIn &&(
                                                        <p style={{width:"100%",textAlign:"center",margin:"auto auto 5px auto",fontSize:"12px",background:"green",color:"white",borderRadius:"4px",width:"95%"}}>IN: {valueTodayLoggedIn}</p>
                                                    )}
                                                    {isPresentTodayLoggedOut && (
                                                        <p style={{width:"100%",textAlign:"center",margin:"auto auto 0px auto",fontSize:"12px",background:"red",color:"white",borderRadius:"4px",width:"95%"}}>OUT: {valueTodayLoggedOut}</p>
                                                    )}
                                                </div>
                                                
                                            )
                                        })}
                                    </Grid>
                                </>

                            )
                        })}
                    </Grid>
                </div>
            </>
        </div>
    );
}

export default AttendanceEmployee;
