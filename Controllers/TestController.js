const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
var moment = require("moment");
const sequelizes = require("../Helper/Connect");
const { config } = require("dotenv");
const Student = require("../Models/student.model");
const AttendanceStudent = require("../Models/attendance.model");
const Test = require("../Models/test.model");
const Question = require("../Models/question.model");
const respHandler = require("../Handlers");
const { monthdays } = require("../Helper/Constant");
config();

const AddTest = async (req, res) => {
  try {
    const {
      batch,
      course,
      date,
      testtype,
      starttime,
      endtime,
      testtitle,
      questions,
    } = req.body;
    let newdate = new Date(date);

    console.log("body query data is ", JSON.parse(questions));

    let test = await Test.create({
      ClientCode: req.user?.ClientCode,
      institutename: req.user?.institutename,
      testdate: newdate,
      teststarTime: starttime,
      testendTime: endtime,
      testname: testtitle,
      testTitle: testtitle,
      batch: batch,
      course: course,
      testtype: testtype,
    });

    if (test) {
      const promises = JSON.parse(questions)?.map(async (item) => {
        let result = await Question.create({
          testId: test?.id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          question: item?.question,
          option1: item?.option1,
          option2: item?.option2,
          option3: item?.option3,
          option4: item?.option4,
          correctoption: item?.correctoption,
        });

        return result;
      });

      if (await Promise.all(promises)) {
        let curtest = await Test.findOne({
          where: {
            batch: batch,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            id: test?.id,
          },
          include: [
            {
              model: Question,
            },
          ],
        });

        return respHandler.success(res, {
          status: true,
          msg: "Test Created successfully!!",
          data: curtest,
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

const GetAllTest = async (req, res) => {
  try {
    const { page, limit, course, batch, testdate } = req.query;

    let alltest;
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
      whereClause.institutename = req.user.institutename;
    }

    if (course) {
      whereClause.course = { [Op.regexp]: `^${course}.*` };
    }

    if (batch) {
      whereClause.batch = { [Op.regexp]: `^${batch}.*` };
    }

    if (testdate) {
      whereClause.testdate = new Date(testdate);
    }

    if (limit && page) {
      const Limit = Number(limit);
      const Page = Number(page);
      const skip = (Page - 1) * Limit;
      alltest = await Test.findAll({
        limit: Limit,
        offset: skip,
        where: whereClause,
        include: [
          {
            model: Question,
          },
        ],
      });
        if (alltest) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Test successfully!!",
        data: alltest,
      });
    }
    } else {
      alltest = await Test.findAll({
        where: whereClause,
        include: [
          {
            model: Question,
          },
        ],
      });
    }

    if (alltest) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Test successfully!!",
        data: alltest,
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
  AddTest,
  GetAllTest,
};
