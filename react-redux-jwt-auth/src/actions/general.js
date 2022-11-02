import GeneralService from "../services/general.server";


import { Store } from 'react-notifications-component';
import dayjs from "dayjs";


const onError=(error)=>{
    const message = (
        error.response &&
        error.response.data &&
        error.response.data.err
    )|| error.message || error.err || error.toString()
    console.log({message})
    Store.addNotification({
        title: "Error",
        message: `${message}`,
        type: "warning",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 2500,
          onScreen: true
        }
    });
}


export const getAttendance = ({id})=>(dispatch)=>{
    return GeneralService.getAttendace({id}).then(
        (response)=>{
            if(response.status==200){
                console.log((response.data))
                if(response.data.attendance.length>0){
                    // var attendance = response.data.attendance.reduce((item,idx,arr)=>{
                    //     console.log({item,idx,arr})
                    // })
                    var idMapping = response.data.attendance.reduce((acc, el, i) => {
                        acc[el.date] = el
                        return acc;
                    }, {});
                    dispatch({
                        type:"ADDEMPLOYEEATTENDANCE",
                        payload:{
                            id:response.data.id,
                            data:idMapping
                        }
                    })
                }
            }
        },(error)=>{
            onError(error)

        }
    )
}





