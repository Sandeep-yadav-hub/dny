import HRService from "../services/hr.service";

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

export const getEmployeesList = ({limit,offset,url})=>(dispatch)=>{
    return HRService.getUsers({limit,offset,url}).then(
        (response)=>{
            if (response.status==200){

                dispatch({type:"SETEMPLOYEES",payload:{employees:response.data.employees}})
            }else{
                onError({err:"Unable to Get Employees List Please, try Again!"})
            }
        },
        (error)=>{
            onError(error)
        }
    )
}

export const createEmployeeInfo = ({id,data})=>(dispatch)=>{
    return HRService.createEmployeeInfo({empId:id,data}).then(
        (response)=>{
            if(response.status==200){
                Store.addNotification({
                    title: "Employee Info",
                    message: `Employee: #${response.data.employeeId} ${response.data.type} updated`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({type:"UPDATEEMPLOYEEINFO",payload:{data:response.data,id:id}})
            }
            else{
                onError(response.data)
            }
        },
        (error)=>{
            onError(error)
        }
    )
}

export const updateEmployeeInfo = ({idx,data})=>(dispatch)=>{
    console.log({data})
    return HRService.updateEmployeeInfo({id:data.id,data}).then(
        (response)=>{
            console.log(response)
            if(response.status==200){
                Store.addNotification({
                    title: "Employee Info",
                    message: `Employee: #${response.data.employeeId} ${response.data.type} updated`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({type:"UPDATEEMPLOYEEINFO",payload:{data:response.data,id:data.employeeId,idx}})
            }
        },(error)=>{
            onError(error)
        }
    )
}
export const deleteEmployeeInfo = ({data})=>(dispatch)=>{
    console.log(data,"to Delete")
    return HRService.deleteEmployeeInfo({id:data.id}).then(
        (response)=>{
            if (response.status==200){
                Store.addNotification({
                    title: "Employee Info",
                    message: `EmployeeInfo: #${data.employeeId} ${data.type} updated`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({type:"DELETEMPLOYEEINFO",payload:{data:data}})

            }
        },
        (error)=>{
            onError(error)
        }
    )
}

export const createEmployee = ({username})=>(dispatch)=>{
    return HRService.createEmployee({username}).then(
        (response)=>{
            if (response.status == 200){
                Store.addNotification({
                    title: "Employee",
                    message: `Employee: ${response.data.employee.user.username} created`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({
                    type:"ADDEMPLOYEE",
                    payload:{data:response.data.employee}
                })
            }else{
                onError(response.data)
            }
        },
        (error,)=>{
            onError(error)
        }
    )
}

export const updateEmployee = ({id,data})=>(dispatch)=>{
    // console.log({id,data})
    return HRService.updateEmployee({empId:id,data}).then(
        (response)=>{
            if (response.status == 200){
                Store.addNotification({
                    title: "Employee",
                    message: `Employee: ${response.data.updatedRecord.user.username} updated`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({type:"UPDATEEMPLOYEE",payload:{data:response.data.updatedRecord,id:id}})
            }else{
                onError(response.data)
            }
        },
        (error)=>{
            onError(error)
        }
    )
}


export const getRolesList = ()=>(dispatch)=>{
    return HRService.getAllRoles().then(
        (response)=>{
            if(response.status==200){
                dispatch({type:"SETROLES",payload:response.data})
            }else{
                onError(response.data)
            }
        },
        (error)=>{
            onError(error)
        }
    )
}

export const createRole = ({name}) => (dispatch) => {
    return HRService.createRole({name}).then(
        (response)=>{
            if(response.status==200){
                dispatch({type:"ADDROLE",payload:{data:response.data.role}})
            }else{
                onError(response.data)
            }
        },
        (error)=>{
            onError(error)
        }
    )
}

export const deleteRole = ({ids,idxs})=>(dispatch)=>{
    return HRService.deleteRole({ids}).then(
        (response)=>{
            if (response.status==200){

                dispatch({
                    type:"DELETEROLE",
                    payload:{ids}
                })
            }else{
                onError(response.data)
            }
        },
        (error)=>{
            onError(error)
        }
    )
} 

export const setRoleToEmployee = ({newPermission,empId,newStateOfCurrentEmployee,uId,rId})=>(dispatch)=>{
    return HRService.setRoleToEmployee({uId,rId}).then(
        (response)=>{
            if (response.status==200){
                Store.addNotification({
                    title: "Employee",
                    message: `${response.data.msg}`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({type:"UPDATEEMPLOYEE",payload:{
                    id:empId,
                    data:{...newStateOfCurrentEmployee,user:{...newStateOfCurrentEmployee.user,roles:newPermission}}
                }})
                dispatch(getRolesList())
                
            }else{
                onError(response.data)
            }
        },
        (error)=>{
            onError(error)
        }
    )
}

export const getBranchList = ()=>(dispatch)=>{
    return HRService.getBranchList().then(
        (response)=>{
            if(response.status==200){
                dispatch({
                    type:"SETBRANCH",
                    payload:response.data
                })
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}

export const createBranch = ({name})=>(dispatch)=>{
    return HRService.createBranch({name}).then(
        (response)=>{
            if(response.status==200){
                Store.addNotification({
                    title: "Employee",
                    message: `${name} Branch Created`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({
                    type:"ADDBRANCH",
                    payload:{data:{...response.data.branch,employees:[]}}
                })
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}


export const setBranchToEmployee = ({empId,newStateOfCurrentEmployee,branch,id,branchId})=>(dispatch)=>{
    return HRService.setBranchToEmployee({id,branchId}).then(
        (response)=>{
            if(response.status==200){
                Store.addNotification({
                    title: "Employee",
                    message: `${response.data.msg}`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({type:"UPDATEEMPLOYEE",payload:{
                    id:empId,
                    data:{...newStateOfCurrentEmployee,branch}
                }})
                dispatch(getBranchList())
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}

export const setDesignationToEmployee = ({empId,newStateOfCurrentEmployee,designation,id,designationId})=>(dispatch)=>{
    return HRService.setDesignationToEmployee({id,designationId}).then(
        (response)=>{
            if(response.status==200){
                Store.addNotification({
                    title: "Employee",
                    message: `${response.data.msg}`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({type:"UPDATEEMPLOYEE",payload:{
                    id:empId,
                    data:{...newStateOfCurrentEmployee,designation}
                }})
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}

export const setDepartmentToEmployee = ({empId,newStateOfCurrentEmployee,department,id,departmentId})=>(dispatch)=>{
    return HRService.setDepartmentToEmployee({id,departmentId}).then(
        (response)=>{
            if(response.status==200){
                Store.addNotification({
                    title: "Employee",
                    message: `${response.data.msg}`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({type:"UPDATEEMPLOYEE",payload:{
                    id:empId,
                    data:{...newStateOfCurrentEmployee,department}
                }})
                dispatch(getBranchList())
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}

export const getDepartmentList = (data)=>(dispatch)=>{
    return HRService.getDepartmentList(data).then(
        (response)=>{
            if(response.status==200){
                console.log(response.data)

                dispatch({
                    type:"SETDEPARTMENT",
                    payload:response.data
                })
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}


export const createDepartment = ({name,branchId})=>(dispatch)=>{
    return HRService.createDepartment({name,branchId}).then(
        (response)=>{
            if (response.status==200){
                Store.addNotification({
                    title: "Department",
                    message: `${response.data.department.name} : Department Created`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({
                    type:"ADDDEPARTMENT",
                    payload:{data:response.data.department}
                })
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}

export const getDesignationList = (data)=>(dispatch)=>{
    return HRService.getDesignationList(data).then(
        (response)=>{
            if(response.status==200){
                dispatch({
                    type:"SETDESIGNATION",
                    payload:{data:response.data}
                })
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}

export const createDesignation=(data)=>(dispatch)=>{
    // console.log(data)
    // return
    return HRService.createDesignation(data).then(
        (response)=>{
            if(response.status==200){
                Store.addNotification({
                    title: "Designation",
                    message: `${response.data.designation.name} : Designation Created`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({
                    type:"ADDDESIGNATION",
                    payload:{data:response.data.designation}
                })
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}

export const getLeavePolicyList = ()=>(dispatch)=>{
    return HRService.getLeavePolicyList().then(
        (response)=>{
            if(response.status==200){
                dispatch({
                    type:"SETLEAVEPOLICY",
                    payload:{data:response.data}
                })
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}

export const createLeavePolicy = ({newPolicyName,newPolicyDays})=>(dispatch)=>{
    return HRService.createNewPolicy({newPolicyName,newPolicyDays}).then(
        (response)=>{
            if(response.status==200){
                Store.addNotification({
                    title: "Leave Policy",
                    message: `${response.data.policyName} : Leave Policy Created`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({
                    type:"ADDLEAVEPOLICY",
                    payload:{data:response.data}
                })
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}

export const getGovHolidayList = (data)=>{
    return HRService.getGovHolidayList().then(
        (response)=>{
            if(response.status==200){
                var toSend={}
                const data = response.data
                for (const year in response.data){
                    for(const month in data[year]){
                        for(const day in data[year][month]){
                            if(data[year][month][day].restricted!="" ||data[year][month][day].mandatory!=""){
                                toSend[`${year}-${month.length==1?"0"+month:month}-${day.length==1?"0"+day:day}`] = data[year][month][day]
                            }
                        }
                    }

                }
                return toSend
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}

export const setLeavePolciyToEmployee = ({newLeavePolicys,empId,newStateOfCurrentEmployee,uId,lId})=>(dispatch)=>{
    return HRService.setLeavePolicyToEmployee({id:uId,leavePolicyId:lId}).then(
        (response)=>{
            if(response.status==200){
                Store.addNotification({
                    title: "Leave Policy",
                    message: `${response.data.msg}`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                dispatch({type:"UPDATEEMPLOYEE",payload:{
                    id:empId,
                    // data:{...newStateOfCurrentEmployee,leavePolicy},
                    data:{...newStateOfCurrentEmployee,leavePolicys:newLeavePolicys}

                }})
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}

export const setEmployeeReportsTo = ({empId,newStateOfCurrentEmployee,reportTo,reportsToId,typeOfReport})=>(dispatch)=>{
    return HRService.setEmployeeReportsTo({empId,reportsToId,typeOfReport}).then(
        (response)=>{
            if(response.status==200){
                Store.addNotification({
                    title: "Employee",
                    message: `${response.data.msg}`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2500,
                      onScreen: true
                    }
                });
                if(typeOfReport=="PrimaryReportsTo"){
                    dispatch({type:"UPDATEEMPLOYEE",payload:{
                        id:empId,
                        data:{...newStateOfCurrentEmployee,primaryReportsTo:reportTo}
                    }})
                }else if(typeOfReport=="SecondryReportsTo"){
                    dispatch({type:"UPDATEEMPLOYEE",payload:{
                        id:empId,
                        data:{...newStateOfCurrentEmployee,secondryReportsTo:reportTo}
                    }})
                }
            }else{
                onError(response.data)
            }
        },
        (err)=>{
            onError(err)
        }
    )
}