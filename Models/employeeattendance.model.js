const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");

const AttendanceEmployee = sequelize.define("employeeattendance", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  empId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  EmployeeId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  monthNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  institutename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attendaceStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  attendaceStatusIntext: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "NONE",
  },
  holidaytype: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "default",
  },
  Comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attendancedate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = AttendanceEmployee;
