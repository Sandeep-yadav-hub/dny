const db = require("../models")

var bcrypt = require("bcryptjs");

const fs = require("fs")
const path = require("path")


const User = db.user
const Employee = db.employee
const EmployeeInfo = db.employeeInfo
const Roles = db.role
const Branch = db.branch
const Department = db.department
const Designation = db.designation
const LeavePolicy = db.leavePolicy
const Attendance = db.attendance



// EMPLOYEE controller
exports.getUsers = async(req, res) => {
    var limit = Number(req.query.limit)
    var offset = Number(req.query.offset)
    var toSend;
    if(limit && offset){
        toSend = await Employee.findAll({
            limit: limit,
            offset: offset,
            include:[
                {model:User,include:[{model:Roles}]},
                {model:EmployeeInfo},
                {model:Branch,as:"branch"},
                {model:LeavePolicy,as:"leavePolicys"},
                {model:Department,as:"department",include:[{model:Branch,as:"branch",attributes:["id","name"]}],attributes:["id","name","createdAt","updatedAt"]},
                {model:Employee,as:"primaryReportsTo",include:[{model:User}]},
                {model:Employee,as:"secondryReportsTo",include:[{model:User}]},
                {model:Designation,as:"designation"}

            ],
            // include:{all:true,nested:true},
            where:{
                deleted:false
            }
        });
    }else{
        toSend = await Employee.findAll({
            include:[
                {model:User,include:[{model:Roles}]},
                {model:EmployeeInfo},
                {model:Branch,as:"branch"},
                {model:LeavePolicy,as:"leavePolicys"},
                {model:Department,as:"department",include:[{model:Branch,as:"branch",attributes:["id","name"]}],attributes:["id","name","createdAt","updatedAt"]},
                {model:Employee,as:"primaryReportsTo",include:[{model:User}]},
                {model:Employee,as:"secondryReportsTo",include:[{model:User}]},
                {model:Designation,as:"designation"}

            ],
            // include:{all:true,nested:true},
            where:{
                deleted:false
            }
        });
    }
    const proxyHost = req.headers["x-forwarded-host"];
    const host = proxyHost ? proxyHost : req.headers.host;
    var data = {
        count : toSend.length,
        next:`${req.protocol}//${host}/api/hr/getUsers?limit=${limit}&offset=${offset+10}`,
        prev:  `${req.protocol}//${host}/api/hr/getUsers?limit=${limit}&offset=${offset-10>0?offset-10:0}`,
        employees: toSend,
    }
    res.status(200).json(data);
    return
};

exports.createEmployee = async(req,res)=>{
    var username = req.body.username
    console.log(username)
    if(!username){
        res.status(400).json({err:"Username not provided"})
        return
    }
    try {
        var userExits = await User.findOne({
            where:{
                username
            }
        })
        if (userExits){
            res.status(400).json({err:"username already exists"})
        }else{
            var user = await User.create({
                username,
                email:`${username}@xyz.com`,
                password:bcrypt.hashSync(`${username}@1234`)
            })
            await user.setRoles([7])
            var employee = await Employee.create({userId:user.id})
            var toSend = await Employee.findOne({where:{id:employee.id},include:{all:true,nested:true}})
            res.status(200).json({msg:`${username} is created succesfully`,employee:toSend})
        }
    } catch (err) {
        res.status(400).json({err})
        
    }
}

exports.getEmployee = async(req,res)=>{
    var id = req.query.id
    if(!id){
        res.status(400).json({err:"id not provided"})
    }
    try {
        var employee = await Employee.findOne({
            where:{
                userId:id
            }
        })
        if (!employee){
            res.status(400).json({err:"Employee not found"})
            return
        }
        res.status(200).json({employee})
        return
    } catch (err) {
        res.status(400).json({err})
        return
    }
}

exports.updateEmployee = async(req,res)=>{
    var id = req.body.id
    data = {}
    var employee = await Employee.findOne({
        where:{
            id:id
        },
        include:{all:true,nested:true}
    })
    if (!employee){
        res.status(400).json({err:"Employee not found"})
    }
    for (const [key, value] of Object.entries(req.body)) {
        if(key!=="id"){
            data[key] = value
        }
    }
    try {
        var updatedRecord = await employee.update(data)
        res.status(200).json({updatedRecord})
        return
    } catch (err) {
        res.status(400).json({err})
        return
        
    }
}
exports.deleteEmployee = async(req,res)=>{
    var id = req.body.id
    if (!id){
        res.status(400).json({err:"Id not provided"})
    }
    var employee = await Employee.findOne({where:{userId:id}})
    if (!employee){
        res.status(400).json({err:"Employee not found"})
    }
    try {
        var updatedEmployee = await employee.update({deleted:true})
        res.status(200).json({updatedEmployee})
        return
    } catch (err) {
        res.status(400).json({err})
        return
    }
}


// EMPLOYEEINFO controller
exports.getEmployeeInfo = async(req,res)=>{
    var id =req.query.id
    if (!id){
        res.status(400).json({err:"Id not provided"})
    }
    try {
        var employeeInfos = await EmployeeInfo.findAll({where:{employeeId:id}})
        res.status(200).json({info:employeeInfos})
        return
    } catch (err) {
        res.status(400).json({err})
        return
    }
}

exports.createEmployeeInfo = async(req,res)=>{
    var id = req.body.id
    if (!id){
        res.status(400).json({err:"Id not provided"})
    }
    var employee = await Employee.findOne({where:{id}})
    if (!employee){
        res.status(400).json({err:"Employee not found"})
        return
    }
    try {
        var data = {}
        for (const [key, value] of Object.entries(req.body)) {
            if(key!=="id"){
                data[key] = value
            }
        }
        var employeeInfo = await EmployeeInfo.create({...data,employeeId:id})
        console.log({employeeInfo})
        res.status(200).json(employeeInfo)
        return
    } catch (err) {
        res.status(400).json({err})
        return
    }
}
exports.updateEmployeeInfo = async(req,res)=>{
    var id = req.body.id
    if (!id){
        res.status(400).json({err:"Id not provided"})
    }
    var data = {}
    for (const [key, value] of Object.entries(req.body)) {
        if(key!=="id"){
            data[key] = value
        }
    }
    try {
        var employeeInfo  = await EmployeeInfo.findOne({where:{id}})
        var updatedEmployeeInfo = await employeeInfo.update(data)
        res.status(200).json(updatedEmployeeInfo)
        return
    } catch (err) {
        res.status(400).json({err})
        return
    }

}
exports.deleteEmployeeInfo = async(req,res)=>{
    var id = req.query.id
    if (!id){
        res.status(400).json({err:"Id not provided"})
    }
    try {
        var employeeInfo = await EmployeeInfo.findOne({where:{id}})
        if (!employeeInfo){
            res.status(400).json({err:"Employee Info not found"})
        }
        employeeInfo.destroy()
        res.status(200).json({employeeInfo})
        return

    } catch (err) {
        res.status(400).json({err})
        return
        
    }
}


// ROLES controller

exports.setRolesToEmployee = async(req,res)=>{
    var roleId = req.body.rId
    var userId = req.body.uId
    if (!roleId || !userId){
        res.status(400).json({err:"Invalid Request!"})
        return
    }
    try {
        var user = await User.findOne({where:{id:userId}})
        if (user){
            user.setRoles(roleId).then(()=>{
                res.status(200).json({msg:"Permission/Employemnet Type Updated"})
                return
            })
        }else{
            res.status(400).json({err:"Invalid Request!"})
            return
    
        }
    } catch (error) {
        res.status(400).json({err:error})
        return
        
    }
}


exports.getRoles = async(req,res)=>{
    // var limit = Number(req.query.limit)
    // var offset = Number(req.query.offset)
    const toSend = await Roles.findAll({
        // limit: limit,
        // offset: offset,
        include:{all:true,nested:false},
        
    });
    const proxyHost = req.headers["x-forwarded-host"];
    const host = proxyHost ? proxyHost : req.headers.host;
    var data = {
        count : toSend.length,
        // next:`${req.protocol}//${host}/api/hr/getRoles?limit=${limit}&offset=${offset+10}`,
        // prev:  `${req.protocol}//${host}/api/hr/getRoles?limit=${limit}&offset=${offset-10>0?offset-10:0}`,
        roles: toSend,
    }
    res.status(200).json(data);
    return
}

exports.createRole = async(req,res)=>{
    var name = req.body.name
    if (!name){
        res.status(400).json({err:"Name not provided"})
        return
    }
    try {
        var roleExits = await Roles.findOne({
            where:{
                name
            }
        })
        if (roleExits){
            res.status(400).json({err:"Role name already exists"})
            return
        }else{
            var role = await Roles.create({
                name,
            })
            res.status(200).json({role})
            return
        }
    } catch (err) {
        res.status(400).json({err})
        return
    }
}

exports.deleteRole = async(req,res)=>{
    var ids = JSON.parse(req.query.ids)
    if (ids.length==0){
        res.status(400).json({err:"Ids not provided"})
    }
    try {
        var deletedRole = []
        ids.map(async(item,idx)=>{
            console.log(item)
            var role = await Roles.destroy({
                where:{
                    id:item
                }
            })
            deletedRole.push(role)
        })
        res.status(200).json({deletedRole})
    } catch (err) {
        res.status(400).json({err})
        
    }
}

// Branch controller
exports.getBranchList = async(req,res)=>{
    const toSend = await Branch.findAll({
        include:[{model:Employee,attributes:["id"]}],
    });
    const proxyHost = req.headers["x-forwarded-host"];
    const host = proxyHost ? proxyHost : req.headers.host;
    var data = {
        branch: toSend,
    }
    res.status(200).json(data);
    return
}
exports.createBranch = async(req,res)=>{
    var {name} = req.body
    if (!name){
        res.status(400).json({err:"Invalid request"})
        return
    }else{
        try {
            const branch = await Branch.create({name})
            res.status(200).json({branch:branch.dataValues})
            return
        } catch (error) {
            res.status(500).json({err:error})
            return
        }
    }
}


// Employee Branch controller
exports.setBranchToEmployee = async(req,res)=>{
    var {id,branchId} = req.body
    if (!id || !branchId){
        res.status(400).json({err:"Invalid Request, Provide empId and branchId"})
        return
    }else{
        try{
            var employee = await Employee.findOne({where:{id:id}})
            if (employee){
                employee.update({branchId})
                res.status(200).json({msg:"Branch Update for Employee: "+employee.id})
                return
            }else{
                res.status(400).json({err:"Invalid Request"})
                return
            }
        }catch(err){
            res.status(500).json({err:"Server Error. Please Try Again"})
            return
        }
    }
}

// Employee Department controller
exports.setDepartmentToEmployee = async(req,res)=>{
    var {id,departmentId} = req.body
    if (!id || !departmentId){
        res.status(400).json({err:"Invalid Request, Provide empId and departmentId"})
    }else{
        try {
            console.log(id)
            var employee = await Employee.findOne({where:{id:id}})
            console.log({employee})
            if (employee){
                employee.update({departmentId})
                res.status(200).json({msg:"Department Update for Employee: "+employee.id})
            }else{
                res.status(400).json({err:"Invalid Request"})
            }
        } catch (err) {
            res.status(500).json({err:"Server Error. Please Try Again"})
            
        }
    }

}

// Employee Leave Policy Controller
exports.setLeavePolicyToEmployee = async(req,res)=>{
    var {id,leavePolicyId} = req.body
    console.log(id,leavePolicyId)
    if (!id || !leavePolicyId){
        res.status(400).json({err:"Invalid Request, Provide empId and leavePolicyId"})
    }else{
        try {
            var employee = await Employee.findOne({where:{id:id}})
            if (employee){
                employee.setLeavePolicys(leavePolicyId)
                res.status(200).json({msg:"Leave Policy Update for Employee: "+employee.id})
            }else{
                res.status(400).json({err:"Invalid Request"})
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({err})
            
        }
    }

}

// Employee Reports To Controller
exports.setEmployeeReportsTo = async(req,res)=>{
    const {empId,reportsToId,typeOfReport} = req.body
    try {
        const emp = await Employee.findOne({where:{id:empId}})
        if(emp){
            const reportTo = await Employee.findOne({where:{id:reportsToId}})
            if(reportTo){
                if(typeOfReport=="PrimaryReportsTo"){
                    await emp.setPrimaryReportsTo(reportTo)
                }else if(typeOfReport == "SecondryReportsTo"){
                    await emp.setSecondryReportsTo(reportTo)
                }
                res.status(200).json({empId,reportsToId,typeOfReport})
            }else{
                res.status(400).json({err:"Invalid Request."})
            }
        }else{
            res.status(400).json({err:"Invalid Request."})
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// Employee Designation Controller
exports.setDesignationToEmployee = async(req,res)=>{
    var {id,designationId} = req.body
    if (!id || !designationId){
        res.status(400).json({err:"Invalid Request, Provide empId and departmentId"})
    }else{
        try {
            var employee = await Employee.findOne({where:{id:id}})
            if (employee){
                employee.update({designationId})
                res.status(200).json({msg:"Designation Update for Employee: "+employee.id})
            }else{
                res.status(404).json({err:"Invalid Request"})
            }
        } catch (err) {
            res.status(500).json({err:"Server Error. Please Try Again"})
        }
    }
}

// Designation Controller
exports.getDesignationList = async(req,res)=>{
    var {limit,offset,isParent,parentId,departmentId} = req.query
    var toSend;
    if(!limit&&!offset&&!isParent){
        toSend = await Designation.findAll({
            include:[{model:Designation,as:"child",include:[{model:Designation,include:[{model:Designation,as:"child",attributes:["id","name"]}],as:"child",attributes:["id","name"]}],attributes:["id","name"]},{model:Employee,as:"employees",include:[{model:User,attributes:["id","username"]}],attributes:["id","firstName","lastName"]},{model:Department,as:"department",attributes:["id","name"]}]
            // include:{all:true,nested:true},
        })
    }
    const proxyHost = req.headers["x-forwarded-host"];
    const host = proxyHost ? proxyHost : req.headers.host;
    var data = {
        designation: toSend,
    }
    res.status(200).json(data);
}

exports.createDesignation = async(req,res)=>{
    var {name,isParent,parentId,departmentId} = req.body
    if (!name || !departmentId){
        res.status(400).json({err:"Invalid request"})
    }
    try {
        var deparment = await Department.findOne({where:{id:departmentId}})
        if(deparment){
            var designation = await Designation.create(
                {name,isParent:isParent?Boolean(isParent):false,parentId},
            )
            await designation.setDepartment(deparment)
            var extend = {
                "child": await designation.getChild(),
                "employees": await designation.getEmployees(),
                "department": await designation.getDepartment()
            }
            var designation = {...designation.dataValues,...extend}
            res.status(200).json({designation})
        }else{
            res.status(400).json({err:"Invalid request"})
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({err})
    }
}


// Department controller
exports.getDepartmentList = async(req,res)=>{
    var {limit,offset,branchId} = req.query
    var toSend;
    if(!limit&&!offset&&!branchId){
        toSend = await Department.findAll({
            // attributes:{
            // },
            
            include:[{model:Branch,as:"branch"},{model:Designation,as:"designations"},{model:Employee,as:"employees",attributes:["id"]}]
            // include:{all:true,nested:true},
        })
    }else{
        if(!branchId){
            if(limit && offset && ! branchId){
                toSend = await Department.findAll({
                    limit,
                    offset,
                    include:[{model:Branch,as:"branch"},{model:Employee,as:"employees",attributes:["id"]}]

            
                })
            }
        }else{
            if(branchId && limit && offset){
                toSend = await Department.findAll({
                    limit,
                    offset,
                    where:{
                        branchId
                    },
                    include:[{model:Branch,as:"branch"},{model:Employee,as:"employees",attributes:["id"]}]

                })
            }
            if (branchId && !limit && !offset){
                toSend = await Department.findAll({
                    where:{
                        branchId
                    },
                    include:[{model:Branch,as:"branch"},{model:Employee,as:"employees",attributes:["id"]}]

                })
            }
        }
    }
    // const toSend = await Department.findAll({
    //     include:{all:true,nested:false},

    // });
    const proxyHost = req.headers["x-forwarded-host"];
    const host = proxyHost ? proxyHost : req.headers.host;
    var data = {
        department: toSend,
    }
    res.status(200).json(data);
}

exports.createDepartment = async(req,res)=>{
    var {name,branchId}= req.body
    if (!name || !branchId){
        res.status(400).json({err:"Invalid request"})
    }else{
        try {
            var department = await Department.create({
                name,branchId
            })
            res.status(200).json({department})
        } catch (err) {
            res.status(400).json({err})
        }   
    }

}

exports.deleteDepartment = async(req,res)=>{
    var {id} = req.query
    if(!id){
        res.status(400).json({err:"Invalid request"})
    }else{
        try {
            var deletedDepartment = await Department.destroy({where:{
                id
            }})
            res.status(200).json({msg:"Department Deleted",departmentId:id})
        } catch (err) {
            res.status(400).json({err})
        }
    }
}


// LEAVE CONTROLLER
const readFile = async (filePath,res) => {
    try {
      const data = await fs.promises.readFile(filePath)
      return data
    }
    catch(err) {
        res.status(200).json(err)
    }
}

exports.getGovHoliday = async(req,res)=>{
    try {
        var data = await readFile(path.join(__dirname,"..","data","holiday.json"),res)

        res.status(200).json(JSON.parse(data))
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.getLeavePolicyList=async(req,res)=>{
    try {
        var toSend = await LeavePolicy.findAll({
            include:[
                {model:Employee,as:"employees",attributes:["id","firstName","lastName"]}
            ]
        })
        res.status(200).json(toSend)
    } catch (err) {
        res.status(400).json(err)
        
    }
}

exports.createLeavePolicy=async(req,res)=>{
    try {
        // const {newPolicyName,newPolicyDays} = req.body
        console.log(req.body)
        var newPolcicy = await LeavePolicy.create({policyName:req.body.newPolicyName,days:req.body.newPolicyDays})
        res.status(200).json(newPolcicy)
    } catch (err) {
        res.status(400).json(err)
        
    }
}


// Attendance Controller
exports.attendance = async(req,res)=>{
    console.log(req.query.id)
    try {
        var employee = await Employee.findOne({
            where:{id:req.query.id},
            include:[
                {model:Attendance,as:"attendance"},
            ],
            attributes:['id']
        })
        res.status(200).json(employee)
    } catch (error) {
        res.status(400).json(error)
    }
}


