const { authJwt } = require("../middleware");
const controller = require("../controllers/chat.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    app.get("/api/chat/users",[authJwt.verifyToken],controller.UsersList)
    app.post("/api/chat/chatList",[authJwt.verifyToken],controller.chatList)
    app.post("/api/chat/chatBetween",[authJwt.verifyToken],controller.chatBetween)
  
  };