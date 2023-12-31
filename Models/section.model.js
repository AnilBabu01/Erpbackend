const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Section = sequelize.define("section", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  section: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Section;
