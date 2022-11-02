const db = require("../models");
// const { Op } = require("sequelize");
const User = db.user;
const Chat = db.chat;
const Employee = db.employee

const Op = db.Sequelize.Op;

exports.UsersList = async(req,res)=>{
    var usersList = await User.findAll({
        attributes:{
            exclude:["password","createdAt","updatedAt"]
        },
        include:[
            {
                model:Employee,
                where:{
                    id:{
                        [Op.not]: null
                    }
                },
                // include:{all:true,nested:true},
                attributes:{
                    exclude:[User]
                }
            }
        ],
        order: [
            ['id', 'ASC'],
        ],
    })
    res.send(usersList) 
}

exports.chatList = async(req,res)=>{
    var chatList = await Chat.findAll({
        where:{
            parent:req.body.parent
        },
        order: [
            ['createdAt', 'ASC'],
        ],
    })
    var chatList2 = await Chat.findAll({
        where:{
            sentTo:req.body.parent
        },
        order: [
            ['createdAt', 'ASC'],
        ],
    })
    var toSend = [...chatList,...chatList2]
    res.send(toSend) 
}

exports.chatBetween = async(req,res)=>{
    var chatList = await Chat.findAll({
        where:{
            parent:req.body.parent,
            sentTo : req.body.sentTo
        }
    })
    
    res.send(chatList) 
}