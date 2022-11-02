const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.role = require("./role.model.js")(sequelize, Sequelize);
db.todo = require("./todo.model.js")(sequelize,Sequelize)
db.chat = require("./chat.model.js")(sequelize,Sequelize)
db.user = require("./user.model.js")(sequelize, Sequelize);
db.employee = require("./employee.model.js")(sequelize,Sequelize)
db.employeeInfo = require("./employeeInfo.model")(sequelize,Sequelize)
db.branch = require("./branch.model")(sequelize,Sequelize)
db.department = require("./department.model")(sequelize,Sequelize)
db.designation = require("./designation.model")(sequelize,Sequelize)
db.leavePolicy = require("./leavePolicy.model")(sequelize,Sequelize)
db.attendance = require("./attendance.model")(sequelize,Sequelize)
db.salarySlipTemplate = require("./salarySlipTemplate.model")(sequelize,Sequelize)
db.salarySlipConfig = require("./salarySlipConfig.model")(sequelize,Sequelize)



db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
db.todo.belongsTo(db.user, {
  foreignKey: 'userId'
});

db.user.hasOne(db.employee)
// db.employee.belongsToMany(db.employeeInfo)


db.department.belongsTo(db.branch,{as:"branch",foreignKey:{allowNull:false,name:"branchId"}})
db.department.hasMany(db.employee,{as:"employees",foreignKey: 'departmentId'})
db.department.hasMany(db.designation,{as:"designations",foreignKey:"departmentId"})

db.employeeInfo.belongsTo(db.employee)

db.employee.belongsToMany(db.leavePolicy,{as:"leavePolicys",through:"employee_leavepolicy"})
db.employee.belongsTo(db.designation,{as:"designation",foreignKey:{name:"designationId",allowNull:true}})
db.employee.belongsTo(db.department,{as:"department",foreignKey: {allowNull:true,name:"departmentId"}})
db.employee.belongsTo(db.branch,{as: 'branch', foreignKey: {allowNull: true, name: 'branchId' }})
db.employee.hasMany(db.employeeInfo)
db.employee.belongsTo(db.salarySlipTemplate,{as:"salarySlipTemplate",foreignKey: {allowNull:true,name:"salarySlipTemplateId"}})
db.employee.belongsTo(db.user)
db.employee.belongsTo(db.employee,{as:"primaryReportsTo"})
db.employee.belongsTo(db.employee,{as:"secondryReportsTo"})
db.employee.hasMany(db.attendance,{as:"attendance",foreignKey:{allowNull:false,name:"employeeid"}})

db.attendance.belongsTo(db.employee,{as:"employee"})

db.salarySlipTemplate.hasMany(db.salarySlipConfig)

db.salarySlipConfig.belongsTo(db.salarySlipTemplate)

db.branch.hasMany(db.department)
db.branch.hasMany(db.employee)

db.designation.hasMany(db.employee,{as:"employees",foreignKey:"designationId"})
db.designation.belongsTo(db.department,{as:"department",foreignKey: {allowNull:true,name:"departmentId"}})
db.designation.hasMany(db.designation,{as:"child",foreignKey:"parentId"})

db.leavePolicy.belongsToMany(db.employee,{as:"employees",through:"employee_leavepolicy"})


db.ROLES = ["user", "admin","moderator","adminHR","hr","intern","part_time","full_time","employee","probation"];

module.exports = db;
