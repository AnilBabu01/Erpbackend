const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const StudentCourse = sequelize.define("course", {
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
  institutename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  typeoforganization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  coursename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseduration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = StudentCourse;
