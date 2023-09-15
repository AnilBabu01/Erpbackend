const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Department = sequelize.define("department", {
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
  DepartmentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Department;
