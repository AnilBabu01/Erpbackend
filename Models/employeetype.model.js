const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Employeetype = sequelize.define("employeetype", {
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
  employeetype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Employeetype;
