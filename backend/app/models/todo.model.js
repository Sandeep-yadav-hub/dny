module.exports = (sequelize, Sequelize) => {
    const Todo = sequelize.define("todo", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      task: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      duedate: {
        type: Sequelize.DATE
      },
    });
    return Todo;
  };
  