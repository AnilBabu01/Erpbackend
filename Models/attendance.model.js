const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const AttendanceStudent = sequelize.define("studentattendance", {
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
  institutename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attendaceStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  attendancedate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = AttendanceStudent;
