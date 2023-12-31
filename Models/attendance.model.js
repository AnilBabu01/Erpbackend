const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");

const AttendanceStudent = sequelize.define("studentattendance", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // userId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  studentid: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fathersName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  MathersName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fathersPhoneNo: {
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
  courseorclass: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  batch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rollnumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  monthNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // institutename: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
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
    type: DataTypes.DATEONLY,
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
  yeay: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Section: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:"NONE"
  },
});

module.exports = AttendanceStudent;
