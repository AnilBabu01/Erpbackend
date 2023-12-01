const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Session = sequelize.define("session", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Session: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Session;
