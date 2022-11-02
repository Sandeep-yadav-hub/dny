module.exports = (sequelize, Sequelize) => {
    const EmployeesInfo = sequelize.define("employeesinfo", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: Sequelize.STRING
        },
        key: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.STRING
        },
        date:{
            type:Sequelize.DATE
        }
        
    });
    return EmployeesInfo;
  };
  