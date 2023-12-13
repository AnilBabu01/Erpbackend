const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const FooterDetails = sequelize.define("footerdetails", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  facilitycontent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  facebookurl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  instagramurl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  twiterurl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  linkldlurl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ChairmanContactNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PrincipalContactNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Mapurl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = FooterDetails;
