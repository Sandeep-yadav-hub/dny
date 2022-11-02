const db = require("../models");
const todo = db.todo
const Op = db.Sequelize.Op;

exports.getAll = async(req,res)=>{
    var todos = await todo.findAll()
    res.send(todos)
}

exports.getUserTodo = async(req,res)=>{
    var todos = await todo.findAll({
        where:{
            userId:req.userId
        }
    })
    res.send(todos)
}

exports.create = async(req,res)=>{
    if (req.userId == undefined){
        res.status(403).send({
            message: "No token provided"
          });
    }
    try{
        var dueDate = new Date(req.body.dueDate) 
        var date = dueDate.getFullYear()+'-'+(dueDate.getMonth()+1)+'-'+dueDate.getDate();
        var todos = await todo.create({
            task:req.body.task,
            status:req.body.status,
            duedate:date,
            userId:req.userId
        })
        res.send(todos)
    }catch(err){
        console.log(err)
        res.status(400).send({details:err.original.detail,constraint:err.original.constraint,sql:err.sql,params:err.parameters,table:err.table})
    }
}

exports.updateStatus = async(req,res)=>{
    if (req.userId == undefined){
        res.status(403).send({
            message: "No token provided"
          });
    } 
    try{
        var uStatus = req.body.status
        var uStatusId = req.body.id
        var dueDate = new Date(req.body.dueDate) 
        var date = dueDate.getFullYear()+'-'+(dueDate.getMonth()+1)+'-'+dueDate.getDate();
        console.log(date,uStatus)
        var uTodo = await todo.update(
                {
                    status:uStatus,
                    duedate:date
                },
                {
                    where:{
                        userId:req.userId,
                        id:uStatusId
                    }
                }
            )
        res.send(uTodo)
    }catch(err){
        console.log(err)
        res.status(400).send({details:err.original.detail,constraint:err.original.constraint,sql:err.sql,params:err.parameters,table:err.table})
    }
}