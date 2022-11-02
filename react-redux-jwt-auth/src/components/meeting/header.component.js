import React ,{useContext,useEffect, useState} from 'react';
import MeetingContext from '../../context/meeting.context';
import dayjs from "dayjs"

const WEEK = [
    "Sun","Mon","Tue","Wed","Thu","Fri","Sat"
]

const Header = () => {
    const {test,setTest} = useContext(MeetingContext);
    const [time,setTime] = useState(dayjs().format("hh:mm a"))
    const [date,setDate] = useState(dayjs().format(" MMM DD"))
    const [day,setDay] = useState(WEEK[dayjs().day()])

    
    const timer = ()=>{
        setTime(prev=>{
            let now = dayjs().format("hh:mm a")
            if (prev == now){
                return prev
            } else{
                return now
            }
        })
        setDate(prev=>{
            let now = dayjs().format(" MMM DD")
            if (prev== now){
                return prev
            }else{
                return now
            }
        })
        setDay(prev=>{
            let now = WEEK[dayjs().day()]
            if (prev == now){
                return prev
            }else{
                return now
            }
        })

    }
    
    useEffect(() => {
        const timeInterval = setInterval(timer, 1000);

        return()=> {
            clearInterval(timeInterval)
        }
    },[]);
    return (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <h3 style={{fontWeight:"300",color:"#555"}}>Meeting</h3>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <h4 style={{fontWeight:"300",color:"#555",fontSize:"18px"}}>{time.toUpperCase()}</h4>
                <h4 style={{fontWeight:"300",color:"#555",fontSize:"18px",marginLeft:"10px"}}>{day},{date.toUpperCase()}</h4>
            </div>
        </div>
    );
}

export default Header;
