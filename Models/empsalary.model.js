const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const EmployeeSalary = sequelize.define("employeesalary", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  EmpId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  OrEmpId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  MonthName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  MonthNo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Year: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Allowance: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  BasicSlary: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Deduction: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  TotalSalary: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = EmployeeSalary;
