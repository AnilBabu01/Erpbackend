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
  Allowance1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  AllowanceAmount1: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Allowance2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  AllowanceAmount2: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Allowance3: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  AllowanceAmount3: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Deduction1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  DeductionAmount1: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Deduction2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  DeductionAmount2: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  AllowLeave: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  basicsalary: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  TotalSalary: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  PaidAmount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  employeeof: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  SalaryPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 0,
  },
  PaidDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: new Date(),
  },
  Session: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = EmployeeSalary;
