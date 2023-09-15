const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Guest = sequelize.define("guest", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "college",
  }, 
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  guest:{
    type:DataTypes.STRING,
    allowNull:false,
    defaultValue:'guest'
  }
});

module.exports = Guest;
