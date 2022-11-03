import axios from 'axios';
import authHeader from './auth-header';
const API_URL = 'http://localhost:8080/api/hr/';
class HRService {
  getUsers({limit,offset,url=undefined}) {
    if (url){
        return axios.get(url,{headers:authHeader()})
    }
    return axios.get(API_URL +`getUsers?limit=${limit}&offset=${offset}`, { headers: authHeader() });

  }
  createEmployee({username}){
    if(!username){
        return ({err:"username not provided"})
    }
    return axios.post(API_URL+"employee",{username},{headers:authHeader()})
  }
  createEmployeeInfo({empId,data}){
    if(!empId){
        return ({err:"empId is not provided"})
    }
    if(!data){
        return ({err:"data is not prvided"})
    }

    return axios.post(API_URL+"employeesInfo",{...data,id:empId},{headers:authHeader()}) 
  }
  updateEmployeeInfo({id,data}){
    if(!id){
        return ({err:"empId is not provided"})
    }
    if(!data){
        return ({err:"data is not prvided"})
    }

    return axios.put(API_URL+"employeesInfo",{...data,id:id},{headers:authHeader()}) 
  }
  deleteEmployeeInfo({id}){
    if(!id){
        return ({err:"empId is not provided"})
    }

    return axios.delete(API_URL+`employeesInfo?id=${id}`,{headers:authHeader()}) 
  }
  updateEmployee({empId,data}){
    if(!empId){
        return ({err:"empId is not provided"})
    }
    if(!data){
        return ({err:"data is not prvided"})
    }
    return axios.put(API_URL+"employee",{...data,id:empId},{headers:authHeader()}) 

  }

  getAllRoles(){
    return axios.get(API_URL+"getRoles",{},{headers:authHeader()})
  }

  createRole({name}){
    console.log(name)
    return axios.post(API_URL+"roles",{name},{headers:authHeader()})
  }

  deleteRole({ids}){
    console.log(ids)
    return axios.delete(API_URL+`roles?ids=${JSON.stringify(ids)}`,{headers:authHeader()})
  }

  setRoleToEmployee({uId,rId}){
    console.log(uId,rId)
    return axios.post(API_URL+`employee/roles`,{uId,rId},{headers:authHeader()})

  }

  getBranchList(){
    return axios.get(API_URL+"getBranch",{},{headers:authHeader()})
  }

  setBranchToEmployee({id,branchId}){
    return axios.post(API_URL+"setBranchToEmployee",{id,branchId},{headers:authHeader()})
  }

  setDepartmentToEmployee({id,departmentId}){
    return axios.post(API_URL+"setDepartmentToEmployee",{id,departmentId},{headers:authHeader()})
  }

  createBranch({name}){
    return axios.post(API_URL+"branch",{name},{headers:authHeader()})
  }

  createDepartment({name,branchId}){
    return axios.post(API_URL+"department",{name,branchId},{headers:authHeader()})
  }

  deleteDepartment({id}){
    return axios.post(API_URL+"department?id="+id,{},{headers:authHeader()})
  }

  getDepartmentList(data){
    var queryString = "?"
    for(const d in data){
        queryString = `${queryString}${d}=${data[d]}&`
    }
    return axios.get(API_URL+"departmentList"+queryString,{},{headers:authHeader()})

  }

  getDesignationList(data){
    var queryString = "?"
    for(const d in data){
        queryString = `${queryString}${d}=${data[d]}&`
    }
    return axios.get(API_URL+"designationList"+queryString,{},{headers:authHeader()})

  }
  createDesignation(data){
    var {name,isParent,parentId,departmentId} = data
    return axios.post(API_URL+"designation",data,{headers:authHeader()})
  }

  setDesignationToEmployee({id,designationId}){
    return axios.post(API_URL+"setDesignationToEmployee",{id,designationId},{headers:authHeader()})
  }

  getGovHolidayList(){
    return axios.get(API_URL+"getGovHolidayList",{headers:authHeader()})
  }

  getLeavePolicyList(){
    return axios.get(API_URL+"leavePolicyList",{headers:authHeader()})
  }

  createNewPolicy({newPolicyName,newPolicyDays}){
    return axios.post(API_URL+"leavePolicy",{newPolicyName,newPolicyDays},{headers:authHeader()})
  }

  setLeavePolicyToEmployee({id,leavePolicyId}){
    return axios.post(API_URL+"setLeavePolciyToEmployee",{id,leavePolicyId},{headers:authHeader()})
  }

  setEmployeeReportsTo({empId,reportsToId,typeOfReport}){
    return axios.post(API_URL+"setReportsToEmployee",{empId,reportsToId,typeOfReport},{headers:authHeader()})
  }

}
export default new HRService();