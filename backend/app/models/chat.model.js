module.exports = (sequelize, Sequelize) => {
    const Chat = sequelize.define("chat", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        msg: {
            type: Sequelize.STRING
        },
        sentTo: {
            type: Sequelize.INTEGER
        },
        sentBy: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE
        },
        attached: {
            type: Sequelize.BOOLEAN
        },
        attachmentType:{
            type:Sequelize.STRING
        },
        attachment:{
            type:Sequelize.STRING
        },
        parent:{
            type:Sequelize.INTEGER
        }
    });
    return Chat;
  };
  