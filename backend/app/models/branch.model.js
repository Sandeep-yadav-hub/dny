
module.exports = (sequelize, Sequelize) => {
    const Branch = sequelize.define("branch", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name:{
            type:Sequelize.STRING,
            allowNull: false,
        },
        deleted:{
            type:Sequelize.BOOLEAN,
            defaultValue:false
        }
    });
    return Branch;
  };
  