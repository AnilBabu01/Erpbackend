const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const TransferAmount = sequelize.define("transferamount", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  Date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Transfer_Amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Transfer_Mode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Session: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  MonthNO: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = TransferAmount;
