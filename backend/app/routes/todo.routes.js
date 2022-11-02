const { authJwt } = require("../middleware");
const controller = require("../controllers/todo.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/todo/all", controller.getAll);
  app.get("/api/todo/",[authJwt.verifyToken],controller.getUserTodo)

  app.post("/api/todo/create",[authJwt.verifyToken], controller.create);
  app.post("/api/todo/update",[authJwt.verifyToken], controller.updateStatus);
  
};
