const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const MailSms = sequelize.define("mailsms", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Session: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Section: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseorclass: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Sms: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = MailSms;
