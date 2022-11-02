const { authJwt } = require("../middleware");
const controller = require("../controllers/hr.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // EMPLOYEE
  app.get("/api/hr/getUsers",[],controller.getUsers)
  app.get("/api/hr/employee",[],controller.getEmployee)
  app.post("/api/hr/employee",[],controller.createEmployee)
  app.put("/api/hr/employee",[],controller.updateEmployee)
  app.delete("/api/hr/employee",[],controller.deleteEmployee)

  // EMPLOYEE ROLE/PERMISSION
  app.post("/api/hr/employee/roles",[],controller.setRolesToEmployee)

  // EMPLOYEE INFO
  app.get("/api/hr/employeesInfo",[],controller.getEmployeeInfo)
  app.post("/api/hr/employeesInfo",[],controller.createEmployeeInfo)
  app.put("/api/hr/employeesInfo",[],controller.updateEmployeeInfo)
  app.delete("/api/hr/employeesInfo",[],controller.deleteEmployeeInfo)

  // ROLES/PERMISSION
  app.get("/api/hr/getRoles",[],controller.getRoles)
  app.post("/api/hr/roles",[],controller.createRole)
  app.delete("/api/hr/roles",[],controller.deleteRole)

  // BRANCH
  app.get("/api/hr/getBranch",[],controller.getBranchList)
  app.post("/api/hr/branch",[],controller.createBranch)

  // EMPLOYEE BRANCH
  app.post("/api/hr/setBranchToEmployee",[],controller.setBranchToEmployee)

  // EMPLOYEE DEPARTMENT
  app.post("/api/hr/setDepartmentToEmployee",[],controller.setDepartmentToEmployee)

  // EMPLOYEE DESIGNATION
  app.post("/api/hr/setDesignationToEmployee",[],controller.setDesignationToEmployee)

  // EMPMLOYEE LEAVE POLICY
  app.post("/api/hr/setLeavePolciyToEmployee",[],controller.setLeavePolicyToEmployee)

  // EMPLOYEE REPORTS TO
  app.post("/api/hr/setReportsToEmployee",[],controller.setEmployeeReportsTo) 

  // DEPARTMENT
  app.get("/api/hr/departmentList",[],controller.getDepartmentList)
  app.post("/api/hr/department",[],controller.createDepartment)
  app.delete("/api/hr/department",[],controller.deleteDepartment)

  // DESIGNATION
  app.get("/api/hr/designationList",[],controller.getDesignationList)
  app.post("/api/hr/designation",[],controller.createDesignation)

  // GOV HOLIDAY
  app.get("/api/hr/getGovHolidayList",[],controller.getGovHoliday)

  // LEAVE
  app.get("/api/hr/leavePolicyList",[],controller.getLeavePolicyList)
  app.post("/api/hr/leavePolicy",[],controller.createLeavePolicy)

  // ATTENDANCE
  app.get("/api/hr/attendance",[],controller.attendance)
  // app.post("/api/hr/logoutattendance",[],controller.logOutAttendance)
};