module.exports = (sequelize, Sequelize) => {
    const SalarySlipConfig = sequelize.define("salaryslipconfig", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING
      },
      labletype: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.STRING
      },
    });
    return SalarySlipConfig;
  };
  