
const initalState = {
    employees:[],
    roles:[],
    branch:[],
    department:[],
    designation:[],
    leavePolicy:[],
    attendance:{}
}

export default function (state={...initalState},action){
    const {type,payload} = action
    switch(type){
        case "ADDEMPLOYEE":
            var newState = [...state.employees]
            newState.push(payload.data)
            return {...state,employees:newState}
        case "SETEMPLOYEES":
            return {...state,employees:payload.employees}
        case "DELETEEMPLOYEE":
            var newState = state.employees.filter(item=>item.id!=payload.id)
            return {...state,employees:newState}
        case "UPDATEEMPLOYEE":
            var employeesNewState = [...state.employees]
            var departmentNewState = [...state.department]
            var branchNewState = [...state.branch]
            var designationNewState = [...state.designation]

            for (var i=0;i<state.employees.length;i++){
                if (state.employees[i].id==payload.id){
                    if(employeesNewState[i].department){
                        if(employeesNewState[i].department?.id!==payload.data.department?.id){
                            for(var j=0;j<departmentNewState.length;j++){
                                var prevDone = false
                                var newDone = false
                                if(departmentNewState[j].id == employeesNewState[i].department.id){
                                    departmentNewState[j] = {...departmentNewState[j],employees:departmentNewState[j].employees.filter(item=>item.id!=payload.id)}
                                    prevDone = true
                                }
                                if(departmentNewState[j].id==payload.data.department.id){
                                    departmentNewState[j].employees.push({id:payload.id})
                                    newDone = true
                                }
                                if(prevDone && newDone){
                                    break
                                }
                            }
                        }
                    }else{
                        if(payload.data.department){
                            for(var j=0;j<departmentNewState.length;j++){
                                var newDone = false
                                if(departmentNewState[j].id==payload.data.department.id){
                                    departmentNewState[j].employees.push({id:payload.id})
                                    newDone = true
                                }
                                if(newDone){
                                    break
                                }
                            }
                        }
                    }
                    if(employeesNewState[i].branch){
                        if(employeesNewState[i].branch?.id!==payload.data.branch?.id){
                            for(var j=0;j<branchNewState.length;j++){
                                var prevDone = false
                                var newDone = false
                                if(branchNewState[j].id == employeesNewState[i].branch.id){
                                    branchNewState[j] = {...branchNewState[j],employees:branchNewState[j].employees.filter(item=>item.id!=payload.id)}
                                    prevDone = true
                                }
                                if(branchNewState[j].id==payload.data.branch.id){
                                    branchNewState[j].employees.push({id:payload.id})
                                    newDone = true
                                }
                                if(prevDone && newDone){
                                    break
                                }
                            }
                        }
                    }else{
                        if(payload.data.branch){
                            for(var j=0;j<branchNewState.length;j++){
                                // var prevDone = false
                                var newDone = false
                                // if(branchNewState[j].id == employeesNewState[i].branch.id){
                                //     branchNewState[j] = {...branchNewState[j],employees:branchNewState[j].employees.filter(item=>item.id!=payload.id)}
                                //     prevDone = true
                                // }
                                if(branchNewState[j].id==payload.data.branch.id){
                                    branchNewState[j].employees.push({id:payload.id})
                                    newDone = true
                                }
                                if(newDone){
                                    break
                                }
                            }
                        }
                    }
                    if(employeesNewState[i].designation){
                        if(employeesNewState[i].designation?.id!==payload.data.designation?.id){
                            for(var j=0;j<designationNewState.length;j++){
                                var prevDone = false
                                var newDone = false
                                if(designationNewState[j].id == employeesNewState[i].designation.id){
                                    designationNewState[j] = {...designationNewState[j],employees:designationNewState[j].employees.filter(item=>item.id!=payload.id)}
                                    prevDone = true
                                }
                                console.log(designationNewState[j],)
                                if(designationNewState[j].id==payload.data.designation.id){
                                    designationNewState[j].employees.push({id:payload.id,firstName:payload.firstName,lastName:payload.lastName,user:{id:payload.data.user.id,username:payload.data.user.username}})
                                    newDone = true
                                }
                                if(prevDone && newDone){
                                    break
                                }
                            }
                        }
                    }else{
                        if(payload.data.designation){
                            for(var j=0;j<designationNewState.length;j++){
                                // var prevDone = false
                                var newDone = false
                                // if(designationNewState[j].id == employeesNewState[i].designation.id){
                                //     designationNewState[j] = {...designationNewState[j],employees:designationNewState[j].employees.filter(item=>item.id!=payload.id)}
                                //     prevDone = true
                                // }
                                console.log(designationNewState[j],)
                                if(designationNewState[j].id==payload.data.designation.id){
                                    designationNewState[j].employees.push({id:payload.id,firstName:payload.firstName,lastName:payload.lastName,user:{id:payload.data.user.id,username:payload.data.user.username}})
                                    newDone = true
                                }
                                if(newDone){
                                    break
                                }
                            }
                        }
                    }
                    employeesNewState[i] = payload.data
                    break
                }
            }

            return {...state,employees:employeesNewState,department:departmentNewState,branch:branchNewState,designation:designationNewState}
        case "DELETEMPLOYEEINFO":
            var newState = [...state.employees]
            for(var i=0;i<newState.length;i++){
                if(newState[i].id==payload.data.employeeId){
                    newState[i]["employeesinfos"] = newState[i].employeesinfos.filter(item=>item.id!=payload.data.id)
                }
            }
            return {...state,employees:newState}
        case "UPDATEEMPLOYEEINFO":
            var newState = [...state.employees]
            for (var i=0;i<newState.length;i++){
                if (newState[i].id==payload.id){
                    if (newState[i].employeesinfos.length>0){
                        let employeesInf = newState[i].employeesinfos
                        let found=true
                        for (var j = 0;j<employeesInf.length;j++){
                            if(employeesInf[j].id==payload.data.id){
                                found=true
                                employeesInf[j] = payload.data
                                break
                            }else{
                                found=false
                            }
                        }
                        if(!found){
                            newState[i].employeesinfos.push(payload.data)
                        }
                    }else{
                        newState[i].employeesinfos.push(payload.data)
                    }
                    break
                }
            }
            return {...state,employees:newState}
        case "SETROLES":
            return {...state,roles:payload.roles}
        case "ADDROLE":
            var newState = [...state.roles]
            newState.push(payload.data)
            return {...state,roles:newState}
        case "DELETEROLE":
            var ids = payload.ids
            var newState =  []
            state.roles.map((item,idx)=>{
                if(!ids.includes(item.id)){
                    newState.push(item)
                }
            })
            
            console.log(newState)
            return {...state,roles:newState}
        case "SETBRANCH":
            return {...state,branch:payload.branch}
        case "ADDBRANCH":
            var newState = [...state.branch]
            newState.push(payload.data)
            return {...state,branch:newState}
        case "DELETEBRANCH":
            var ids = payload.id
            var newState =  state.branch.filter(item=>item.id!=ids)
            return {...state,branch:newState}
        case "SETDEPARTMENT":
            return {...state,department:payload.department}
        case "ADDDEPARTMENT":
            var newState = [...state.department]

            newState.push({...payload.data,employees:[],branch:state.branch.filter(item=>item.id==payload.data.branchId)[0]})
            return {...state,department:newState}
        case "SETDESIGNATION":
            return {...state,designation:payload.data.designation}
        case "ADDDESIGNATION":
            var newState = [...state.designation]
            newState.push(payload.data)
            newState.map((item,idx)=>{
                if(payload.data.parentId){
                    if(item.id == payload.data.parentId){
                        item.child.push({id:payload.data.id,name:payload.data.name})
                    }
                }
            })
            return {...state,designation:newState}
        case "SETLEAVEPOLICY":
            return {...state,leavePolicy:payload.data}
        case "ADDLEAVEPOLICY":
            var newLeavePolicyState = [...state.leavePolicy]
            newLeavePolicyState.push(payload.data)
            return {...state,leavePolicy:newLeavePolicyState}

        case "ADDEMPLOYEEATTENDANCE":
            var newEmployeeAttendance = {...state.attendance}
            newEmployeeAttendance[payload.id] = payload.data
            return {...state,attendance:newEmployeeAttendance}
        default:
            return state
    }
} 







