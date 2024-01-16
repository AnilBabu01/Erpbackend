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
const Student = require("../Models/student.model");
const Coachingfeestatus = require('../Models/coachingfeestatus.model');
config();
const GetSession = () => {
  const currentDate = new Date();
  const sessionStartMonth = 3;
  let sessionStartYear = currentDate.getFullYear();
  if (currentDate.getMonth() < sessionStartMonth) {
    sessionStartYear -= 1;
  }
  const sessionEndMonth = 2;
  const sessionEndYear = sessionStartYear + 1;
  const sessionStartDate = new Date(
    sessionStartYear,
    sessionStartMonth,
    1
  ).getFullYear();
  const sessionEndDate = new Date(
    sessionEndYear,
    sessionEndMonth,
    0
  ).getFullYear();

  return `${sessionStartDate}-${sessionEndDate}`;
};
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
    const { studentid } = req.body;
    let whereClause = {};
    let isStudent = await Student.findOne({
      where: {
        ClientCode: req.user?.ClientCode,
        id: Number(studentid),
      },
    });
    if (isStudent) {
      let schollfee = await SchoolFeeStatus.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
          studentId: isStudent?.id,
          SrNumber: isStudent?.SrNumber,
        },
      });
      let hostelfee = await SchoolHostelFeeStatus.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
          studentId: isStudent?.id,
          SrNumber: isStudent?.SrNumber,
        },
      });
      let transportfee = await SchoolTransportFeeStatus.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
          studentId: isStudent?.id,
          SrNumber: isStudent?.SrNumber,
        },
      });
      let otherfee = await OtherFee.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
          studentId: isStudent?.id,
          SrNumber: isStudent?.SrNumber,
        },
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
    } else {
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
    const { studentid } = req.body;
    let whereClause = {};
    let isStudent = await Student.findOne({
      where: {
        id: Number(studentid),
      },
    });

    if (isStudent) {
      let receiptdata = await Receiptdata.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
          studentid: isStudent?.id,
          SNO: isStudent?.SrNumber,
          Session: isStudent?.Session,
        },
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
    } else {
      if (req.user) {
        whereClause.ClientCode = req.user?.ClientCode;
        whereClause.studentid = studentid ? Number(studentid) : req.user?.id;
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
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const Searchfee = async (req, res) => {
  try {
    const {
      scoursename,
      sbatch,
      stream,
      rollnumber,
      status,
      categoryname,
      sessionname,
      sectionname,
      seno,
    } = req.body;

    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
    }

    if (seno) {
      whereClause.SrNumber = { [Op.regexp]: `^${seno}.*` };
    }

    if (scoursename) {
      whereClause.courseorclass = scoursename;
    }
    if (sbatch) {
      whereClause.batch = { [Op.regexp]: `^${sbatch}.*` };
    }

    if (rollnumber) {
      whereClause.rollnumber = { [Op.regexp]: `^${Number(rollnumber)}.*` };
    }

    if (status) {
      whereClause.Status = { [Op.regexp]: `^${status}.*` };
    }
    if (categoryname) {
      whereClause.StudentCategory = { [Op.regexp]: `^${categoryname}.*` };
    }

    if (sessionname) {
      whereClause.Session = { [Op.regexp]: `^${sessionname}.*` };
    } else {
      let currentsession = GetSession();
      whereClause.Session = { [Op.regexp]: `^${currentsession}.*` };
    }

    // if (sectionname) {
    //   whereClause.Section = { [Op.regexp]: `^${sectionname}.*` };
    // }

    if (stream) {
      whereClause.Stream = { [Op.regexp]: `^${stream}.*` };
    }

    let students = await Student.findAll({
      where: whereClause,
      include: [
        {
          model: Coachingfeestatus,
        },
      ],
      order: [["id", "DESC"]],
    });

    if (students) {
      let result = [];
      const promises = students?.map(async (item) => {
        let schollfee = await SchoolFeeStatus.findAll({
          where: {
            studentId:item?.id,
            ClientCode :req.user?.ClientCode
          },
        });
        let hostelfee = await SchoolHostelFeeStatus.findAll({
          where: {
            studentId:item?.id,
            ClientCode :req.user?.ClientCode
          },
        });
        let transportfee = await SchoolTransportFeeStatus.findAll({
          where: {
            studentId:item?.id,
            ClientCode :req.user?.ClientCode
          },
        });
        let otherfee = await OtherFee.findAll({
          where: {
            studentId:item?.id,
            ClientCode :req.user?.ClientCode
          },
        });

        if (schollfee && hostelfee && transportfee && otherfee) {
          result.push({
            student: item,
            schollfee: schollfee,
            hostelfee: hostelfee,
            transportfee: transportfee,
            otherfee: otherfee,
          });
        }
      });

      if (await Promise.all(promises)) {
        return respHandler.success(res, {
          status: true,
          msg: "Fee Fetch Successfully!!",
          data: result,
        });
      }
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const SearchfeeByMonth = async (req, res) => {
  try {
    const {
      scoursename,
      sbatch,
      stream,
      rollnumber,
      status,
      categoryname,
      sessionname,
      sectionname,
      seno,
      monthname
    } = req.body;

    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
    }

    if (seno) {
      whereClause.SrNumber = { [Op.regexp]: `^${seno}.*` };
    }

    if (scoursename) {
      whereClause.courseorclass = scoursename;
    }
    if (sbatch) {
      whereClause.batch = { [Op.regexp]: `^${sbatch}.*` };
    }

    if (rollnumber) {
      whereClause.rollnumber = { [Op.regexp]: `^${Number(rollnumber)}.*` };
    }

    if (status) {
      whereClause.Status = { [Op.regexp]: `^${status}.*` };
    }
    if (categoryname) {
      whereClause.StudentCategory = { [Op.regexp]: `^${categoryname}.*` };
    }

    if (sessionname) {
      whereClause.Session = { [Op.regexp]: `^${sessionname}.*` };
    } else {
      let currentsession = GetSession();
      whereClause.Session = { [Op.regexp]: `^${currentsession}.*` };
    }

    // if (sectionname) {
    //   whereClause.Section = { [Op.regexp]: `^${sectionname}.*` };
    // }

    if (stream) {
      whereClause.Stream = { [Op.regexp]: `^${stream}.*` };
    }

    let students = await Student.findAll({
      where: whereClause,
      include: [
        {
          model: Coachingfeestatus,
        },
      ],
      order: [["id", "DESC"]],
    });

    if (students) {
      let result = [];
      const promises = students?.map(async (item) => {
        let schollfee = await SchoolFeeStatus.findAll({
          where: {
            studentId:item?.id,
            ClientCode :req.user?.ClientCode,
            MonthName:monthname
          },
        });
        let hostelfee = await SchoolHostelFeeStatus.findAll({
          where: {
            studentId:item?.id,
            ClientCode :req.user?.ClientCode,
            MonthName:monthname
          },
        });
        let transportfee = await SchoolTransportFeeStatus.findAll({
          where: {
            studentId:item?.id,
            ClientCode :req.user?.ClientCode,
            MonthName:monthname
          },
        });
        let otherfee = await OtherFee.findAll({
          where: {
            studentId:item?.id,
            ClientCode :req.user?.ClientCode
          },
        });

        if (schollfee && hostelfee && transportfee && otherfee) {
          result.push({
            student: item,
            schollfee: schollfee,
            hostelfee: hostelfee,
            transportfee: transportfee,
            otherfee: otherfee,
          });
        }
      });

      if (await Promise.all(promises)) {
        return respHandler.success(res, {
          status: true,
          msg: "Fee Fetch Successfully!!",
          data: result,
        });
      }
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
  Searchfee,
  SearchfeeByMonth
};
