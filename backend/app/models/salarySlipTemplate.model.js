module.exports = (sequelize, Sequelize) => {
    const SalarySlipTemplate = sequelize.define("salarysliptemplate", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING
      },
    });
    return SalarySlipTemplate;
  };
  