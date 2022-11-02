
module.exports = (sequelize, Sequelize) => {
    const Employees = sequelize.define("employees", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequelize.STRING,
            defaultValue:""
        },
        lastName: {
            type: Sequelize.STRING,
            defaultValue:""
        },
        dob: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('now')
        },
        
        fatherName: {
            type: Sequelize.STRING,
            defaultValue:""
        },
        fatherOccupation: {
            type: Sequelize.STRING,
            defaultValue:""
        },
        motherName:{
            type:Sequelize.STRING,
            defaultValue:""
        },
        motherOccupation:{
            type:Sequelize.STRING,
            defaultValue:""
        },
        bloodGroup:{
            type:Sequelize.STRING,
            defaultValue:""
        },
        deleted:{
            type:Sequelize.BOOLEAN,
            defaultValue:false
        },
        // primaryReportsToId:{
        //     type:Sequelize.INTEGER,
        //     allowNull:true
        // },
        // secondryReportsToId:{
        //     type:Sequelize.INTEGER,
        //     allowNull:true
        // }
    });
    return Employees;
  };
  