const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const Student = require("../Models/student.model");
const Parent = require("../Models/parent.model");
const Coachingfeestatus = require("../Models/coachingfeestatus.model");
const ReceiptData = require("../Models/receiptdata.model");
const { Coachingfeemon } = require("../Helper/Constant");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");

const getReceipt = async (req, res) => {
  try {
    const { fromdate, name, studentname, rollnumber } = req.query;
    let Dates = new Date(fromdate);
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
      whereClause.institutename = req.user.institutename;
    }
    if (fromdate) {
      whereClause.PaidDate = { [Op.regexp]: `^${Dates}.*` };
    }

    if (name) {
      whereClause.Course = { [Op.regexp]: `^${name}.*` };
    }

    if (rollnumber) {
      whereClause.RollNo = { [Op.regexp]: `^${rollnumber}.*` };
    }
    if (studentname) {
      whereClause.studentName = { [Op.regexp]: `^${studentname}.*` };
    }

    let receipts = await ReceiptData.findAll({
      where: whereClause,
      // order: [["id", "DESC"]],
    });
    if (receipts) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Receipt successfully!!",
        data: receipts,
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Not Found!!",
        error: [""],
      });
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

module.exports = {
  getReceipt,
};
