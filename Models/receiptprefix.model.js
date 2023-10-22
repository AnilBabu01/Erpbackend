const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const ReceiptPrefix = sequelize.define("receiptprefix", {
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
  receiptPrefix: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ReceiptPrefix;
