const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
const sequelizes = require("../Helper/Connect");
const { config } = require("dotenv");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
const SchoolFeeStatus = require("../Models/schoolfeestatus.model");
const SchoolHostelFeeStatus = require("../Models/schoolhostelfee.model");
const SchoolTransportFeeStatus = require("../Models/schooltransportfee.model");
const OtherFee = require("../Models/otherfee.model");
const Receiptdata = require("../Models/receiptdata.model");
config();

const getSchoolFee = async (req, res) => {
  try {
    const { id, SrNumber } = req.body;

    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
    }

    if (id) {
      whereClause.studentId = id;
    }
    // if (SrNumber) {
    //   whereClause.SrNumber = { [Op.regexp]: `^${SrNumber}.*` };
    // }
    let schollfee = await SchoolFeeStatus.findAll({
      where: whereClause,
    });
    let hostelfee = await SchoolHostelFeeStatus.findAll({
      where: whereClause,
    });
    let transportfee = await SchoolTransportFeeStatus.findAll({
      where: whereClause,
    });
    let otherfee = await OtherFee.findAll({
      where: whereClause,
    });
    if (schollfee && hostelfee && transportfee && otherfee) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch School Fee successfully!!",
        data: {
          schollfee: schollfee,
          hostelfee: hostelfee,
          transportfee: transportfee,
          otherfee: otherfee,
        },
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

const getStudentFee = async (req, res) => {
  try {
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
      whereClause.studentId = req.user?.id;
      whereClause.SrNumber = req.user?.SrNumber;
    }

    let schollfee = await SchoolFeeStatus.findAll({
      where: whereClause,
    });
    let hostelfee = await SchoolHostelFeeStatus.findAll({
      where: whereClause,
    });
    let transportfee = await SchoolTransportFeeStatus.findAll({
      where: whereClause,
    });
    let otherfee = await OtherFee.findAll({
      where: whereClause,
    });
    if (schollfee && hostelfee && transportfee && otherfee) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Fee Successfully!!",
        data: {
          schollfee: schollfee,
          hostelfee: hostelfee,
          transportfee: transportfee,
          otherfee: otherfee,
        },
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

const GetStudentFeeLedger = async (req, res) => {
  try {
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
      whereClause.studentid = req.user?.id;
      whereClause.SNO = req.user?.SrNumber;
      whereClause.Session = req.user?.Session;
    }

    let receiptdata = await Receiptdata.findAll({
      where: whereClause,
    });
    if (receiptdata) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Fee Receipt Successfully!!",
        data: receiptdata,
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
  getSchoolFee,
  getStudentFee,
  GetStudentFeeLedger,
};
