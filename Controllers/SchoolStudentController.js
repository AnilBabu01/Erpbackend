const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
const sequelizes = require("../Helper/Connect");
const { config } = require("dotenv");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
const SchoolFeeStatus = require("../Models/schoolfeestatus.model");
const SchoolHostelFeeStatus = require("../Models/schoolhostelfee.model");
const SchoolTransportFeeStatus = require("../Models/schooltransportfee.model");
config();

const getSchoolFee = async (req, res) => {
  try {
    const { id } = req.body;

    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
    }

    if (id) {
      whereClause.studentId = id;
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
    if (schollfee && hostelfee && transportfee) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch School Fee successfully!!",
        data: {
          schollfee: schollfee,
          hostelfee: hostelfee,
          transportfee: transportfee,
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

module.exports = {
  getSchoolFee,
};
