const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Question = require("../Models/question.model");
const Test = sequelize.define("test", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  institutename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  testTitle: {
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
  testFileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
Test.hasMany(Question, { primaryKey: "id" });
Question.belongsTo(Test, { foreignKey: "testId" });
module.exports = Test;
