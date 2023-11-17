const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const AnsQuestion = require("../Models/ansquetion.model");
const Result = sequelize.define("result", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  testId: {
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
  testdate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  teststarTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  testendTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  testname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  batch: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  course: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  testtype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Totalmarks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  TotalWrongAnswer: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  marksperquestion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  passmark: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  obtainmarks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  testFileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Result.hasMany(AnsQuestion, { primaryKey: "id" });
AnsQuestion.belongsTo(Result, { foreignKey: "resultId" });
module.exports = Result;
