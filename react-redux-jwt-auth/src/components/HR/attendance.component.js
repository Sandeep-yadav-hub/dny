import React,{useEffect,useState} from 'react';
import { getMonth } from '../../helpers/calender.helper';
import dayjs from "dayjs"
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeesList } from '../../actions/hr';
import {getAttendance} from "../../actions/general"
// import {Button} from "@mui/material"
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import styled from "styled-components"


function isOdd(num) { return num % 2;}

const Timmings = styled.div`
   
> .timeIn{
    > .timeInValue{
        display:none;
        border-radius:5px;
        padding:5px 7px
    }
    &:hover{
        > .timeInValue{
            display:initial;
            top:-35px;
            left:0px;
            background:#f4f4f4;
            z-index:11
        }
    }
}
> .timeOut{
    > .timeOutValue{
        display:none;
        border-radius:5px;
        padding:5px 7px
    }
    &:hover{
        > .timeOutValue{
            display:initial;
            top:-35px;
            left:0px;
            background:#f4f4f4;
            z-index:11
        }
    }
}
`


const Attendance = () => {
    let dispatch = useDispatch()
    const [currentMonth,setCurrentMonth] = useState([])
    const [currentMonthCount,setCurrentMonthCount] = useState(dayjs().month())
    const employeeList = useSelector(state=>state.hr.employees)
    const employeeAttendance = useSelector(state=>state.hr.attendance)


    useEffect(() => {
        setCurrentMonth(getMonth(currentMonthCount))
    }, [currentMonthCount]);

    useEffect(()=>{
        if(employeeList.length==0){
            dispatch(getEmployeesList({limit:0,offset:0}))
        }else{
            employeeList.map((item,idx)=>{
                if(!employeeAttendance[item.id]){
                    dispatch(getAttendance({id:item.id}))
                }
            })
        }
    },[employeeList])

    return (

        <div>
            
            <div >
                <div style={{marginTop:"20px",overflow:"auto"}}>
                    {employeeList?.map((item,idx)=>{
                        var currentUserId = item.id
                        return(
                            <>
                                {idx==0&&(
                                    <>
                                        <div style={{display:"flex",alignItems:"center"}}>
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
                                        <hr/>
                                         <div key={`${idx}_idx0`} style={{display:"flex",alignItems:"center"}}>
                                            <div style={{minWidth:"150px"}}></div>
                                            {currentMonth?.map((week,id)=>{
                                                return week.map((day,i)=>{
                                                    var isCurrentDay = (dayjs().format("DD-MM")==day.format("DD-MM")&& currentMonthCount==dayjs().month())
                                                    var isLast = week.indexOf(day)==week.length-1 && id==currentMonth.length-1
                                                    return (
                                                        <div key={`${id}_${i}`}>
                                                            <p style={{background:isCurrentDay?"blue":"",color:isCurrentDay?"white":"gray",marginBottom:"2px",fontSize:"12px",padding:"9px 11px",textAlign:"center"}}>{day.format('ddd').toUpperCase()[0]} </p>
                                                            <p style={{border:"1px solid #999",borderRight:isOdd?(isLast?"1px solid #999":"0px"):"1px solid #999",width:"33px",height:"33px",justifyContent:"center",display:"flex",alignItems:"center",fontSize:"12px"}}>{day.format("DD")}</p>
                                                        </div>
                                                    )
                                                })
                                            })}
                                        </div>
                                    </>
                                )}
                                <div key={idx} style={{display:"flex",alignItems:"center",marginBottom:"5px"}}>
                                    <p style={{marginBottom:"5px",fontSize:"14px",minWidth:"150px"}}>{item.user.username.toUpperCase()}</p>
                                    {currentMonth?.map((week,idx)=>{
                                        return (
                                            <>
                                                {week.map((day,i)=>{
                                                    var isLast = week.indexOf(day)==week.length-1 && idx==currentMonth.length-1
                                                    var isPresentTodayLoggedIn = employeeAttendance[currentUserId]?(employeeAttendance[currentUserId][day.format("YYYY-MM-DD")]?(employeeAttendance[currentUserId][day.format("YYYY-MM-DD")].intime?true:false):false):false
                                                    var valueTodayLoggedIn = employeeAttendance[currentUserId]?(employeeAttendance[currentUserId][day.format("YYYY-MM-DD")]?(employeeAttendance[currentUserId][day.format("YYYY-MM-DD")].intime?dayjs(employeeAttendance[currentUserId][day.format("YYYY-MM-DD")].intime).format("HH:mm:ss"):""):""):""

                                                    var isPresentTodayLoggedOut = employeeAttendance[currentUserId]?(employeeAttendance[currentUserId][day.format("YYYY-MM-DD")]?(employeeAttendance[currentUserId][day.format("YYYY-MM-DD")].outtime?true:false):false):false
                                                    var valueTodayLoggedOut = employeeAttendance[currentUserId]?(employeeAttendance[currentUserId][day.format("YYYY-MM-DD")]?(employeeAttendance[currentUserId][day.format("YYYY-MM-DD")].outtime?dayjs(employeeAttendance[currentUserId][day.format("YYYY-MM-DD")].outtime).format("HH:mm:ss"):""):""):""
                                                    var isSunday = week.indexOf(day)==0
                                                    
                                                    return (
                                                        <Timmings key={`${idx}_${i}`} style={{background:isSunday?"red":"",display:"flex",justifyContent:"space-between",position:"relative",alignItems:"center",width:"33px",height:"33px",border:"1px solid #999",borderRight:isOdd?(isLast?"1px solid #999":"0px"):"1px solid #999"}}>
                                                            <p className='timeIn' style={{background:isPresentTodayLoggedIn?"green":"",width:"50%",height:"100%",marginBottom:"0"}}> 
                                                                {isPresentTodayLoggedIn && (
                                                                    <span className='timeInValue' style={{position:"absolute"}}>{valueTodayLoggedIn}</span> 
                                                                )}
                                                            </p>

                                                            <p className='timeOut' style={{background:isPresentTodayLoggedOut?"green":"",width:"50%",height:"100%",marginBottom:"0"}}>
                                                                {isPresentTodayLoggedOut && (
                                                                    <span className='timeOutValue' style={{position:"absolute"}}>{valueTodayLoggedOut}</span>
                                                                )}
                                                            </p>
                                                        </Timmings>
                                                    )
                                                })}
                                            </>
                                        )
                                    })}
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
        </div>
        
    );
}

export default Attendance;
