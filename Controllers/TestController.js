const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
var moment = require("moment");
const sequelizes = require("../Helper/Connect");
const { config } = require("dotenv");
const Test = require("../Models/test.model");
const Question = require("../Models/question.model");
const Result = require("../Models/result.model");
const Ansquestion = require("../Models/ansquetion.model");
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

const DeleteTest = async (req, res) => {
  try {
    const { id } = req.body;
    let test = await Test.findOne({ where: { id: id } });
    if (test) {
      await Test.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });

      await Question.destroy(
        {
          where: {
            testId: test?.id,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
          },
        },
        { truncate: false }
      );

      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Test Deleted Successfully!!",
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Something Went Wrong!!",
        error: ["not found"],
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
const UpdateTest = async (req, res) => {
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
      id,
    } = req.body;
    let newdate = new Date(date);
    let test = await Test.update(
      {
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
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      }
    );

    if (test) {
      const promises = JSON.parse(questions)?.map(async (item) => {
        let result = await Question.update(
          {
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            question: item?.question,
            option1: item?.option1,
            option2: item?.option2,
            option3: item?.option3,
            option4: item?.option4,
            correctoption: item?.correctoption,
          },
          {
            where: {
              testId: item?.testId,
              id: item?.id,
              ClientCode: req?.user?.ClientCode,
              institutename: req?.user?.institutename,
            },
          }
        );

        return result;
      });

      if (await Promise.all(promises)) {
        let updatedtest = await Test.findOne({
          where: {
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            id: id,
          },
          include: [
            {
              model: Question,
            },
          ],
        });

        return respHandler.success(res, {
          status: true,
          msg: "Test Updated successfully!!",
          data: [updatedtest],
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

const GetStudentTest = async (req, res) => {
  try {
    let whereClause = {};

    if (req.user) {
      whereClause.course = req.user?.courseorclass;
      whereClause.batch = req.user.batch;
      whereClause.ClientCode = req?.user?.ClientCode;
      whereClause.institutename = req?.user?.institutename;
    }

    let alltest = await Test.findAll({
      where: whereClause,
      include: [
        {
          model: Question,
        },
      ],
      order: [["id", "DESC"]],
    });

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

const AddTestResult = async (req, res) => {
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
    let whereClause = {};
    let totalcount = 0;
    let totalwrongcount = 0;
    questions?.reduce((total, item) => {
      if (item.correctoption === item?.answeroption) {
        totalcount = totalcount + 1;
      } else {
        totalwrongcount = totalwrongcount + 1;
      }
    }, 0);

    let test = await Result.create({
      studentId: req.user?.id,
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
      Totalmarks: totalcount,
      TotalWrongAnswer: totalwrongcount,
    });
    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
      whereClause.institutename = req.user.institutename;
    }
    if (test) {
      const promises = questions?.map(async (item) => {
        let result = await Ansquestion.create({
          resultId: test?.id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          question: item?.question,
          option1: item?.option1,
          option2: item?.option2,
          option3: item?.option3,
          option4: item?.option4,
          correctoption: item?.correctoption,
          answeroption: item?.answeroption,
          currectanswer: item?.correctoption === item?.answeroption ? "1" : "0",
        });

        return result;
      });

      if (await Promise.all(promises)) {
        let curtest = await Result.findOne({
          where: {
            batch: test?.batch,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            id: test?.id,
          },
          include: [
            {
              model: Ansquestion,
            },
          ],
        });
        if (curtest) {
          return respHandler.success(res, {
            status: true,
            msg: "Test Submitted successfully!!",
            data: { Result: curtest },
          });
        }
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
  AddTest,
  GetAllTest,
  DeleteTest,
  UpdateTest,
  GetStudentTest,
  AddTestResult,
};
