const { authJwt } = require("../middleware");
const controller = require("../controllers/salarySlip.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // EMPLOYEE
  app.get("/api/salarySlipTemplatesList",[],controller.getSalarySlipTemplatesList)
  app.get("/api/salarySlipTemplates",[],controller.getSalarySlipTemplates)
  app.post("/api/salarySlipTemplates",[],controller.createSalarySlipTemplate)
  app.delete("/api/salarySlipTemplates",[],controller.deleteSalarySlipTemplates)
  app.put("/api/salarySlipTemplates",[],controller.addTemplateConfig)

  app.put("/api/setSalarySlipTemplateToEmployee",[],controller.setSalaryslipTemplateToEmployee)

  app.delete("/api/salarySlipConfig",[],controller.deleteSalarySlipConfig)
  app.get("/api/salarySlipConfig",[],controller.getSalarySlipConfig)
  app.get("/api/salarySlipConfigList",[],controller.getSalarySlipConfigList)

  app.get("/api/generateSalarySlip",[],controller.generateSalarySlip)
};