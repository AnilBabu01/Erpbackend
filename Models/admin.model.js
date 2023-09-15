const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const student = require("./student.model");
const parent = require("./parent.model");
const studentclass = require("./studentclass.model");
const fee = require("./fee.model");
const studentcategory = require("./studentcategory.model");
const section = require("./section.model");
const employeetype = require("./employeetype.model");
const typeoforganization = require("./typeorganization.model");
const Admin = sequelize.define("admin", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "admin",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institutename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneno1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneno2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  typeoforganization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  logourl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profileurl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.TEXT,
  },
  joiningdate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resigndate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  empsubject: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Admin.hasMany(parent, { foreignKey: "userId" });
// parent.belongsTo(Admin, { foreignKey: "userId" });

// Admin.hasMany(student, { foreignKey: "userId" });
// student.belongsTo(Admin, { foreignKey: "userId" });

// Admin.hasMany(studentclass, { foreignKey: "userId" });
// studentclass.belongsTo(Admin, { foreignKey: "userId" });

// Admin.hasMany(studentcategory, { foreignKey: "userId" });
// studentcategory.belongsTo(Admin, { foreignKey: "userId" });

// Admin.hasMany(fee, { foreignKey: "userId" });
// fee.belongsTo(Admin, { foreignKey: "userId" });

// Admin.hasMany(section, { foreignKey: "userId" });
// section.belongsTo(Admin, { foreignKey: "userId" });

// Admin.hasMany(employeetype, { foreignKey: "userId" });
// employeetype.belongsTo(Admin, { foreignKey: "userId" });

// Admin.hasMany(typeoforganization, { foreignKey: "userId" });
// typeoforganization.belongsTo(Admin, { foreignKey: "userId" });
module.exports = Admin;
