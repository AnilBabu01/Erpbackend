const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Ansquestion = sequelize.define("answerquestion", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  resultId: {
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
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option3: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option4: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correctoption: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answeroption: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // testfile: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  answeroption: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currectanswer: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Ansquestion;
