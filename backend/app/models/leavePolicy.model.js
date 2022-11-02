module.exports = (sequelize, Sequelize) => {
    const LeavePolicy = sequelize.define("leavepolicy", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        policyName: {
            type: Sequelize.STRING
        },
        days:{
            type: Sequelize.INTEGER
        }
    });
    return LeavePolicy;
  };
  