
module.exports = (sequelize, Sequelize) => {
    const Attendance = sequelize.define("attendance", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employeeid:{
            type:Sequelize.INTEGER
        },
        date:{
            type:Sequelize.STRING
        },
        intime:{
            type:Sequelize.DATE
        },
        outtime:{
            type:Sequelize.DATE
        }
    });
    return Attendance;
  };
  