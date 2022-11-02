const { authJwt } = require("../middleware");
const controller = require("../controllers/meeting.controller");


module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    app.post("/api/save-call-id", controller.saveCallId);
    app.get("/api/get-call-id/:id", controller.getCallId);
  };