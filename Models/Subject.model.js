const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Subject = sequelize.define("subject", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dayname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  starttime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endtime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  empID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Subject;
