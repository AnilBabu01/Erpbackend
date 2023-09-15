const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const TypeofOrganization = sequelize.define("typeoforganization", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  TypeofOrganization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = TypeofOrganization;
