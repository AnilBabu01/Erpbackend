const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const studentclass = require("./studentclass.model");
const fee = require("./fee.model");
const studentcategory = require("./studentcategory.model");
const section = require("./section.model");
const employeetype = require("./employeetype.model");
const typeoforganization = require("./typeorganization.model");
const College = sequelize.define("client", {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Sendemail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  SendemailPassword: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  institutename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ClientCode: {
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
  certificatelogo: {
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
  Studentpassword: {
    type: DataTypes.TEXT,
    defaultValue: "Student",
  },
  Parentpassword: {
    type: DataTypes.TEXT,
    defaultValue: "Parent",
  },
  Employeepassword: {
    type: DataTypes.TEXT,
    defaultValue: "Employee",
  },
  newclient: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

// College.hasMany(parent, { foreignKey: "userId" });
// parent.belongsTo(College, { foreignKey: "userId" });

// College.hasMany(student, { foreignKey: "userId" });
// student.belongsTo(College, { foreignKey: "userId" });

// College.hasMany(studentclass, { foreignKey: "userId" });
// studentclass.belongsTo(College, { foreignKey: "userId" });

// College.hasMany(studentcategory, { foreignKey: "userId" });
// studentcategory.belongsTo(College, { foreignKey: "userId" });

// College.hasMany(fee, { foreignKey: "userId" });
// fee.belongsTo(College, { foreignKey: "userId" });

// College.hasMany(section, { foreignKey: "userId" });
// section.belongsTo(College, { foreignKey: "userId" });

// College.hasMany(employeetype, { foreignKey: "userId" });
// employeetype.belongsTo(College, { foreignKey: "userId" });

// College.hasMany(typeoforganization, { foreignKey: "userId" });
// typeoforganization.belongsTo(College, { foreignKey: "userId" });
module.exports = College;
