const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Notes = sequelize.define("note", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
   Notestext: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
});

module.exports = Notes;
