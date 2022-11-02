const users = [];

// Join user to chat
function userJoin(id, username,socketId) {
  const user = { id, username,socketId };

  users.push(user);
  console.log(users, "users");

  return user;
}
console.log("user out", users);

// Get current user
function getUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
function userLeaveBySokcetId(id) {
  const index = users.findIndex((user) => user.socketId === id);
    console.log(index)
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// User leaves chat
function userLeaveById(id) {
    const index = users.findIndex((user) => user.id === id);
  
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }
  
  
function showAllUser(){
    return users
}

module.exports = {
  userJoin,
  getUser,
  userLeaveBySokcetId,
  showAllUser,
  userLeaveById
};