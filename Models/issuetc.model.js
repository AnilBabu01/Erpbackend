const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");

const IssueTc = sequelize.define("issuetc", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "student",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fathersName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  MathersName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fathersPhoneNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentclass: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseorclass: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Stream: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  batch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registrationNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rollnumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  institutename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneno1: {
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
  adharcard: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  markSheet: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  markSheetname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  othersdoc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  othersdocName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  BirthDocument: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  StudentStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  whatsappNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.TEXT,
  },
  regisgrationDate: {
    type: DataTypes.DATE,
  },
  regisgrationfee: {
    type: DataTypes.INTEGER,
  },
  admissionDate: {
    type: DataTypes.DATE,
  },
  admissionfee: {
    type: DataTypes.INTEGER,
  },
  studentTotalFee: {
    type: DataTypes.INTEGER,
  },
  courseduration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  adharno: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pancardnno: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  permonthfee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  paidfee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  pendingfee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  StudentStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "registration",
  },
  Registrationfeestatus: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  typeoforganization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "IN Institute",
  },
  Transport: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  Library: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  hostal: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  StudentCategory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  BusNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  HostelPerMonthFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },

  TotalHostelFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  HostelPendingFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  HostelPaidFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  TransportPerMonthFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  TransportTotalHostelFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  TransportPendingFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  TransportPaidFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  AnnualFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  AnnualFeeStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 0,
  },
  hostelname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Facility: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Session: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Section: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  SrNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  FromRoute: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ToRoute: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  DateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
});

module.exports = IssueTc;
