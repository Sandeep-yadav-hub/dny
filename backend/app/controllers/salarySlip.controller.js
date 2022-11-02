const db = require("../models")

const User = db.user
const Employee = db.employee
const SalaryslipTemplates = db.salarySlipTemplate
const SalaryslipConfig = db.salarySlipConfig


exports.getSalarySlipTemplatesList = async(req,res)=>{
    var limit = Number(req.query.limit)
    var offset = Number(req.query.offset)
    var toSend;
    if(limit && offset){
        toSend = await SalaryslipTemplates.findAll({
            limit: limit,
            offset: offset,
            include:[
                {model:SalaryslipConfig},
            ],
            order: [
                [{ model: SalaryslipConfig },  'id', 'asc']
            ],
        });
    }else{
        toSend = await SalaryslipTemplates.findAll({
            include:[
                {model:SalaryslipConfig},
            ],
            order: [
                [{ model: SalaryslipConfig, },  'id', 'asc']
            ],
        });
    }
    const proxyHost = req.headers["x-forwarded-host"];
    const host = proxyHost ? proxyHost : req.headers.host;
    
    var data = {
        count : toSend.length,
        salarySlipTemplates: toSend,
    }
    if(limit && offset){
        data= {
            ...data,
            next:`${req.protocol}//${host}/api/salarySlipTemplates?limit=${limit}&offset=${offset+10}`,
            prev:`${req.protocol}//${host}/api/salarySlipTemplates?limit=${limit}&offset=${offset-10>0?offset-10:0}`,
        }
    }
    res.status(200).json(data);
    return

}

exports.createSalarySlipTemplate = async(req,res)=>{
    var name = req.body.name
    if(!name){
        res.status(400).json({err:"Name not provided"})
        return
    }
    try {
        var salarySlipTemplate = await SalaryslipTemplates.create({
            name
        })
        res.status(200).json({salarySlipTemplate})
        return
    } catch (error) {
        res.status(400).json({err})
        return
    }
}

exports.getSalarySlipTemplates = async(req,res)=>{
    var id = req.query.id
    if(!id){
        res.status(400).json({err:"id not provided"})
    }
    try {
        var salaryslipTemplate = await SalaryslipTemplates.findOne({
            where:{
                id:id
            },
            include:[
                {model:SalaryslipConfig},
            ],
        })
        if (!salaryslipTemplate){
            res.status(400).json({err:"Salaryslip Templates not found"})
            return
        }
        res.status(200).json({salaryslipTemplate})
        return
    } catch (err) {
        res.status(400).json({err})
        return
    }
}

exports.deleteSalarySlipTemplates = async(req,res)=>{
    var id = req.body.id
    if (!id){
        res.status(400).json({err:"Id not provided"})
        return
    }
    var deleteSalaryslipTemplate = await SalaryslipTemplates.findOne({where:{id:id}})
    if (!deleteSalaryslipTemplate){
        res.status(400).json({err:"Salaryslip Template not found"})
        return
    }
    try {
        deleteSalaryslipTemplate.destroy()
        res.status(200).json({deleteSalaryslipTemplate})
        return
    } catch (err) {
        res.status(400).json({err})
        return
    }
}

exports.addTemplateConfig = async(req,res)=>{
    var {templateId,data} = req.body
    // data = JSON.parse(data)
    if(data.length==0){
        res.status(400).json({err:"Config not provided"})
        return
    }
    try {
        data = [
            {name:"LTA",labletype:"credit",type:"fixed",value:"4500",salarysliptemplateId:templateId},
            {name:"Special Allowance",labletype:"credit",type:"fixed",value:"3000",salarysliptemplateId:templateId},
            {name:"PF Employee contribution",labletype:"debit",type:"%",value:"12",salarysliptemplateId:templateId},
            {name:"PF Employer contribution",labletype:"debit",type:"%",value:"12",salarysliptemplateId:templateId}
        ]
        var configCreation = await SalaryslipConfig.bulkCreate(data)
        res.status(200).json({configCreation})
        return
    } catch (error) {
        res.status(200).json({err:error})
        return
    }
}


exports.getSalarySlipConfigList = async(req,res)=>{
    var limit = Number(req.query.limit)
    var offset = Number(req.query.offset)
    var toSend;
    if(limit && offset){
        toSend = await SalaryslipConfig.findAll({
            limit: limit,
            offset: offset,
            include:[
                {model:SalaryslipTemplates},
            ],
            order: [
                [{ model: SalaryslipTemplates },  'id', 'asc']
            ],
        });
    }else{
        toSend = await SalaryslipConfig.findAll({
            include:[
                {model:SalaryslipTemplates},
            ],
            order: [
                [{ model: SalaryslipTemplates },  'id', 'asc']
            ],
        });
    }
    const proxyHost = req.headers["x-forwarded-host"];
    const host = proxyHost ? proxyHost : req.headers.host;
    
    var data = {
        count : toSend.length,
        salarySlipConfig: toSend,
    }
    if(limit && offset){
        data= {
            ...data,
            next:`${req.protocol}//${host}/api/salarySlipConfig?limit=${limit}&offset=${offset+10}`,
            prev:`${req.protocol}//${host}/api/salarySlipConfig?limit=${limit}&offset=${offset-10>0?offset-10:0}`,
        }
    }
    res.status(200).json(data);
    return

}

exports.getSalarySlipConfig = async(req,res)=>{
    var id = req.query.id
    if (!id){
        res.status(400).json({err:"Id not provided"})
        return
    }
    var salaryslipConfig = await SalaryslipConfig.findOne({where:{id:id}})
    if (!salaryslipConfig){
        res.status(400).json({err:"Salaryslip Config not found"})
        return
    }
    try {
        res.status(200).json({salaryslipConfig})
        return
    } catch (err) {
        res.status(400).json({err})
        return
    }
}

exports.deleteSalarySlipConfig = async(req,res)=>{
    var id = req.body.id
    if (!id){
        res.status(400).json({err:"Id not provided"})
        return
    }
    var deleteSalaryslipConfig = await SalaryslipConfig.findOne({where:{id:id}})
    if (!deleteSalaryslipConfig){
        res.status(400).json({err:"SalaryslipConfig Template not found"})
        return
    }
    try {
        await deleteSalaryslipConfig.destroy()
        res.status(200).json({deleteSalaryslipConfig})
        return
    } catch (err) {
        res.status(400).json({err})
        return
    }
}

exports.setSalaryslipTemplateToEmployee = async(req,res)=>{
    var {empId,templateId} = req.body
    console.log(empId,templateId)
    if(!empId || !templateId){
        res.status(400).json({err:"EmployeeId or TemplateId not provided"})
        return
    }
    try{
        var updatedEmployee = await Employee.findOne({where:{id:empId}})
        updatedEmployee.setSalarySlipTemplate(templateId)
        res.status(200).json({updatedEmployee})
    }catch(err){
        res.status(400).json({err})
    }
}

function percentage(num, per)
{
  return (num/100)*per;
}

exports.generateSalarySlip = async(req,res)=>{
    var {empId} = req.query
    var employee = await Employee.findOne({
        where:{id:empId},
        include:[
            {model:SalaryslipTemplates,as:"salarySlipTemplate",include:[{model:SalaryslipConfig}]}
        ],
        attributes:['id',"firstName","lastName"]
    })
    var process = []
    var table = []

    var base = 15000
    var inHand = 0+base
    var grossSalary = 0+base
    var totalDeduction = 0
    // console.log(employee.dataValues.salarySlipTemplate.salaryslipconfigs.length)
    var data = [
        {name:"HRA",labletype:"credit",type:"%",value:"50"},
        {name:"LTA",labletype:"credit",type:"fixed",value:"4500"},
        {name:"Special Allowance",labletype:"credit",type:"fixed",value:"3000"},
        {name:"PF Employee contribution",labletype:"debit",type:"%",value:"12"},
        {name:"PF Employer contribution",labletype:"debit",type:"%",value:"12"}
    ]
    // employee.salarySlipTemplate.salaryslipconfigs.map((item,idx)=>{
    data.map((item,idx)=>{
        if(item.labletype == "credit"){
            if(item.type == "fixed"){
                process.push(item)
                inHand = inHand + Number(item.value)
                table.push({Particulars:item.name,type:item.labletype,amount:item.value})
                grossSalary = grossSalary + Number(item.value)
            }
            if(item.type == "%"){
                inHand = inHand + percentage (base,Number(item.value))
                process.push({...item,amount: percentage (base,Number(item.value))})
                table.push({Particulars:item.name,type:item.labletype,amount:percentage (base,Number(item.value))})
                grossSalary = grossSalary + percentage (base,Number(item.value))
            }
        }
        if(item.labletype == "debit"){
            if(item.type == "fixed"){
                process.push(item)
                inHand = inHand - Number(item.value)
                table.push({Particulars:item.name,type:item.labletype,amount:item.value})
                totalDeduction = totalDeduction + Number(item.value)
            }
            if(item.type == "%"){
                inHand = inHand - percentage (base,Number(item.value))
                process.push({...item,amount: percentage (base,Number(item.value))})
                table.push({Particulars:item.name,type:item.labletype,amount:percentage (base,Number(item.value))})
                totalDeduction = totalDeduction + percentage (base,Number(item.value))

            }
        }
        console.log({inHand})
    })
    res.status(200).json({CTC:(grossSalary*12),netSalary:inHand,grossSalary,totalDeduction,table})
    return
}