const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var serialize = require('serialize-javascript');
const dayjs = require("dayjs");





// var socketIo = undefined

// io.on("connection", (socket) => {
//   socketIo=socket
// })

exports.logout = (req,res)=>{
  var emitter = req.app.get("socketIo")
  var job = {
      empId:req.body.id,
      jobId:1,
      onProcess:async function(database,jobData,job){
          console.log(`processing job ${jobData.jobId} and ${job.id}`);  
          // var Employee = database.employee
          var Attendance = database.attendance
          try{
              var data = await Attendance.findOne({
                where:{
                  employeeid:this.empId,
                  date: dayjs().format("YYYY-MM-DD"),
                },
                order: [ [ 'createdAt', 'DESC' ]],
              })
              if(data){
                  data.update({outtime:dayjs().valueOf()})
                  return ({success:data})
              }
              // data = await Attendance.findOne({
              //   where:{
              //     employeeid:this.empId,
              //     date: dayjs().add(-1,"day").format("YYYY-MM-DD"),
              //     outtime:null||undefined
              //   },
              //   order: [ [ 'createdAt', 'DESC' ]],
              // })
              // if(data){
              //     data.update({outtime:dayjs().valueOf()})
              //     return ({success:data})
              // }
              return ({error:data})
          }catch(error){
              return ({error:error})
          }
          
      },
      jobType: 'oneTimeJob'
  };
  emitter.emit("addToEmployeeQueue",serialize(job))

  res.status(200).send({
    id: req.body.id,
  });
}

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].id);
        }
        var emitter = req.app.get("socketIo")
        var job = {
            empId:user.id,
            jobId:1,
            onProcess:async function(database,jobData,job){
                console.log(`processing job ${jobData.jobId} and ${job.id}`);  
                // var Employee = database.employee
                var Attendance = database.attendance
                console.log(Attendance)
                try{
                    var todaySignedIn = await Attendance.findOne({
                      where:{
                        employeeid:this.empId,
                        date:dayjs().format("YYYY-MM-DD")
                      }
                    })
                    console.log({todaySignedIn})
                    if(todaySignedIn){
                      return ({success:"Already logged in today"})
                    }
                    var data = await Attendance.create({employeeid:this.empId,date:dayjs().format("YYYY-MM-DD"),intime:dayjs().valueOf()})
                    if(data){
                        return ({success:data})
                    }
                    return ({error:data})
                }catch(error){
                  console.log(error)
                    return ({error:error})
                }
                
            },
            jobType: 'oneTimeJob'
        };
        emitter.emit("addToEmployeeQueue",serialize(job))
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
