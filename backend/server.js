const socket = require("socket.io");
const { app, HTTPServer } = require("./app.js");
var serialize = require('serialize-javascript');

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(HTTPServer, {
  debug: true,
});

const db = require("./app/models");

const Chat = db.chat;
var bcrypt = require("bcryptjs");


const {
  userJoin,
  userLeaveBySokcetId,
  showAllUser,
  userLeaveById,
  getUser,
} = require("./chat.users.online.js");

async function initial() {
  const Role = db.role;
  const User = db.user
  const Employee = db.employee
  const Branch = db.branch
  const Department = db.department
  const Designation = db.designation

  const admin = await Role.create({
    // id: 1,
    name: "admin",
  });

  await Role.create({
    // id: 2,
    name: "moderator",
  });
  const AdminHR = await Role.create({
    // id: 3,
    name: "AdminHR",
  });
  const HRRole = await Role.create({
    // id: 4,
    name: "HR",
  });
  await Role.create({
    // id: 5,
    name: "Part-Time",
  });
  await Role.create({
    // id: 6,
    name: "Full-Time",
  });
  const emp = await Role.create({
    // id: 7,
    name: "Employee",
  });
  const branch = await Branch.create({
    name:"Bangalore"
  })
  const branch2 = await Branch.create({
    name:"Mysore"
  })
  const user = await User.create({
    username:"sandeep",
    password:bcrypt.hashSync("sandeep@1234", 8),
    email:"sandeep@xyz.com"
  })
  const employee = await Employee.create({
    firstName:"Sandeep",
    lastName:"Yadav",
    userId:user.id,
    // branchId:branch.id
  })
  await user.setRoles([admin.id,AdminHR.id,HRRole.id,emp.id])
  const user2 = await User.create({
    username:"meenal",
    password:bcrypt.hashSync("meenal@1234", 8),
    email:"meenal@xyz.com"
  })
  const employee2 = await Employee.create({
    firstName:"Meenal",
    lastName:"Kaushik",
    userId:user2.id,
    // branchId:branch.id
  })
  const user3 = await User.create({
    username:"deepika",
    password:bcrypt.hashSync("deepika@1234", 8),
    email:"deepika@xyz.com"
  })
  const employee3 = await Employee.create({
    firstName:"Deepika",
    lastName:"Rai",
    userId:user3.id,
    // branchId:branch.id
  })
  

  const department = await Department.create({name:"HR",branchId:branch2.id})
  const designation3 = await Designation.create({name:"HR Manger",departmentId:department.id,isParent:true})
  const designation = await Designation.create({name:"Assit. HR",departmentId:department.id,isParent:true})
  const designation2 = await Designation.create({name:"Assit. Jr. HR",departmentId:department.id,isParent:false})

  await employee.update({branchId:branch.id})
  await employee2.update({branchId:branch2.id})
  await employee2.update({departmentId:department.id})
  await employee2.setDesignation(designation)
  await employee.setDesignation(designation3)
  await employee.setPrimaryReportsTo(employee2)
  await employee.setSecondryReportsTo(employee2)
  // await employee2.setPrimaryReportsTo(employee3)
  // await employee2.setSecondryReportsTo(employee3)
  // await employee.update({primaryReportsToId:employee2.id})
  // await employee.update({secondryReportsToId:employee2.id})



  await designation3.setChild([designation])
  await designation.setChild([designation2])
  await user2.setRoles([emp.id])

  console.log(employee.dataValues,employee2.dataValues)
  console.log("Inital Setup Done");
}


db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully ########.");
    const force = false;
    if(force){
      db.sequelize.sync({ force: false, alter: true }).then(async() => {
        if (force) {
          console.log("Droped Db, Inital Setup");
          await initial();
        }
        console.log("Resync Db");
      });
    }
    
    
  })
  .catch((err) => {
    console.error("Unable to connect to the database: Try Again");
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/todo.routes")(app);
require("./app/routes/chat.routes")(app);
require("./app/routes/meeting.routes")(app);
require("./app/routes/hr.routes")(app);
require("./app/routes/salarySlipTemplates.routes")(app);


// app.use("/peerjs", peerServer);

const io = socket(HTTPServer, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.102:3000"],
  },
});

const lobby = {};
const roomAdmin = [];
const rooms = [];
const users = [];
var socketIo = {};
app.set('socketIo', io);

//everything related to io will go here
io.on("connection", (socket) => {
  console.log(`sokcet id: ${socket.id} connected`);
  socketIo=socket
  
  // Meeting

  socket.on("create meeting", ({ roomID, username }) => {
    if (rooms[roomID]) {
      // console.log(`meeting with id:${roomID} already exist and you are not admin:${username}, do nothing`)
      io.to(socket.id).emit("meeting created", { isAdmin: false });
    } else {
      rooms[roomID] = { id: socket.id, username: username, isAdmin: true };
      // console.log(`created meeting with id ${roomID} and admin is ${username} with socketID:${socket.id}`)
      io.to(socket.id).emit("meeting created", rooms[roomID]);
    }
  });

  socket.on("join lobby", ({ roomID, username }) => {
    // console.log(`socket id:${socket.id} is trying to get into lobby of room :${roomID} with username :${username}`)
    if (lobby[roomID]) {
      // console.log(`socket id:${socket.id} is in lobby of room :${roomID}`)
      lobby[roomID][socket.id] = {
        socketID: socket.id,
        username: username,
        joinRoom: false,
      };
      var isAdmin = socket.id == rooms[roomID].id;
      if (isAdmin) {
        rooms[roomID] = { id: socket.id, username: username, isAdmin: true };
        lobby[roomID][socket.id] = {
          socketID: socket.id,
          username: username,
          joinRoom: true,
        };

        // console.log(`The user is admin change the previous username:${rooms[roomID].username} with provided username :${username}`)
        io.to(socket.id).emit("joined lobby as admin/user", {
          admin: true,
          redirect: "call_page",
        });
      } else {
        io.to(socket.id).emit("joined lobby as admin/user", { admin: false });
      }
      io.to(rooms[roomID].id).emit("lobby users", lobby[roomID]);
    } else {
      lobby[roomID] = {};
      lobby[roomID][socket.id] = {
        socketID: socket.id,
        username: username,
        joinRoom: false,
      };
      // console.log(`No lobby room with room id :${roomID} found creating and adding socket id:${socket.id} in the room lobby with username:${username}`)
      var isAdmin = socket.id == rooms[roomID].id;
      if (isAdmin) {
        rooms[roomID] = { id: socket.id, username: username, isAdmin: true };
        lobby[roomID][socket.id] = {
          socketID: socket.id,
          username: username,
          joinRoom: true,
        };
        // console.log(`The user is admin change the previous username:${rooms[roomID].username} with provided username :${username}`)
        io.to(socket.id).emit("joined lobby as admin/user", {
          admin: true,
          redirect: "call_page",
        });
      } else {
        io.to(socket.id).emit("joined lobby as admin/user", { admin: false });
      }
      io.to(rooms[roomID].id).emit("lobby users", lobby[roomID]);
    }
  });

  socket.on("join meeting room", ({ roomID, username }) => {
    // console.log(`users with socketID:${socket.id} is trying to join the room cheking if in lobby and accepted by admin`)
    if (lobby[roomID] && lobby[roomID][socket.id]) {
      // console.log(`user with socketID:${socket.id} is present in the lobby, cheking isAllowed to join room`)
      if (lobby[roomID][socket.id].joinRoom) {
        // console.log(`user with socketID:${socket.id} isAllowed:${lobby[roomID][socket.id].joinRoom}`)
        socket.join(roomID);
        if (users[roomID]) {
          if (users[roomID].length <= 4) {
            users[roomID].push({
              socketID: socket.id,
              username: username,
              isAdmin: rooms[roomID].id == socket.id ? true : false,
            });
            delete lobby[roomID][socket.id];
            io.to(roomID).emit("user joined/leave in meeting", users[roomID]);
            io.to(roomID).emit("room users", users[roomID]);
            io.to(roomID).emit("lobby users", lobby[roomID]);
          } else {
            console.log(`Room :${roomID} is full`);
          }
        } else {
          users[roomID] = [
            {
              socketID: socket.id,
              username: username,
              isAdmin: rooms[roomID].id == socket.id ? true : false,
            },
          ];
          delete lobby[roomID][socket.id];
          io.to(roomID).emit("user joined/leave in meeting", users[roomID]);
          io.to(roomID).emit("room users", users[roomID]);
          io.to(roomID).emit("lobby users", lobby[roomID]);
        }
      }
    } else {
      console.log(
        `user with socketID:${socket.id} is not present in the lobby,redirect to lobby page`
      );
    }
  });

  socket.on("add users from lobby to meeting", ({ roomID, userSocketID }) => {
    if (rooms[roomID] && lobby[roomID][userSocketID]) {
      lobby[roomID][userSocketID].joinRoom = true;
      io.to(userSocketID).emit("request accepted by admin", {
        admin: false,
        redirect: "call_page",
      });
    }
  });

  socket.on("kickout", ({ userSocketID, roomID }) => {
    if (socket.id === rooms[roomID].id) {
      io.to(userSocketID).emit("kickout", userSocketID);
      io.sockets.sockets.get(userSocketID).leave(roomID);
      var userList = users[roomID].filter(
        (item) => item.socketID != userSocketID
      );
      users[roomID] = userList;
      io.to(roomID).emit("user joined/leave in meeting", users[roomID]);
      io.to(roomID).emit("room users", users[roomID]);
    } else {
      console.log("not an admin");
    }
  });

  socket.on("leave room", (roomID) => {
    if (roomID) {
      console.log(`socketID:${socket.id} is leaving room :${roomID}`);
      socket.leave(roomID);
      socket.emit("left room", roomID);
      var userList = [
        ...users[roomID].filter((item) => item.socketID != socket.id),
      ];
      users[roomID] = userList;
      if (rooms[roomID] && rooms[roomID].id == socket.id) {
        io.to(roomID).emit("all leave room", "allLeaveRoom");
        delete rooms[roomID];
      }
      io.to(roomID).emit("user joined/leave in meeting", users[roomID]);
      io.to(roomID).emit("room users", users[roomID]);
    }
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
      username: payload.username,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
      username: payload.username,
    });
  });

  socket.on("send message in room", (data) => {
    console.log(data, socket.id);
    io.to(data.roomID).emit("messages in room", { ...data, from: socket.id });
  });

  socket.on("upload", (file, callback) => {
    console.log(file); // <Buffer 25 50 44 ...>

    // save the content to the disk, for example
    writeFile("/tmp/upload", file, (err) => {
      callback({ message: err ? "failure" : "success" });
    });
  });

  // Chat

  socket.on("join", ({ username, id, socketId }) => {
    var userObj = userJoin(id, username, socketId);
    console.log(userObj);
  });

  socket.on("showAll", () => {
    console.log({ show: showAllUser() });
  });

  socket.on("leave", ({ id }) => {
    console.log("leaving");
    userLeaveById(id);
  });

  socket.on("textMessage", async ({ data }) => {
    console.log({ data });
    var sentToSocketId = getUser(data.sentTo);
    var sentBySocketId = getUser(data.sentBy);
    console.log(sentBySocketId, socket.id);

    if (sentBySocketId && sentBySocketId.socketId == socket.id) {
      if (sentToSocketId) {
        console.log("go Ahead");
        try {
          socket.to(sentToSocketId.socketId).emit("private message", data);
        } catch (err) {
          console.log(err);
        }
        await Chat.create({ ...data });
      } else {
        console.log("User Not Online");
      }
      await Chat.create({ ...data });
    } else {
      console.log("errrrrrrrrr");
    }
  });

  // Disconnect , when user leave room
  socket.on("disconnect", () => {
    console.log(`socket closed ${socket.id}`);
    userLeaveBySokcetId(socket.id);
  });
});
