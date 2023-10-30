const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const parent = require("./parent.model");
const Employee = sequelize.define("employee", {
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
  userType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "employee",
  },
  employeeof: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employeetype: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organizationtype: {
    type: DataTypes.STRING,
    allowNull: true,
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
  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  BasicSalary: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  TotalSalary: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Allowance: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Deduction: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  AccountHolder: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  AccountNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  BankName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Branch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  IfscCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
   OfferLater: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  JoningLater: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Offerlater: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fronrofice: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  fronroficeRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  fronroficeWrite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  fronroficeEdit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  fronroficeDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  student: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  studentRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  studentWrite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  studentEdit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  studentDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  attendance: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  attendanceRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  attendanceWrite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  attendanceEdit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  attendanceDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  accounts: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  accountsRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  accountsWrite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  accountsEdit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  accountsDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  transport: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  transportRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  transportWrite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  transportEdit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  transportDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  library: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  libraryRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  libraryWrite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  libraryEdit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  libraryDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  hostel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  hostelRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  hostelWrite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  hostelEdit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  hostelDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  HumanResource: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  HumanResourceRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  HumanResourceWrite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  HumanResourceEdit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  HumanResourceDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  master: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  masterRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  masterWrite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  masterEdit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  masterDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  report: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Active",
    allowNull: true,
  },
});

// Employee.hasMany(parent, { foreignKey: "userId" });
// parent.belongsTo(Employee, { foreignKey: "userId" });

module.exports = Employee;
