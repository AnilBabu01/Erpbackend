const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
var moment = require("moment");
const sequelizes = require("../Helper/Connect");
const { config } = require("dotenv");
const Student = require("../Models/student.model");
const AttendanceStudent = require("../Models/attendance.model");
const respHandler = require("../Handlers");
const { monthdays } = require("../Helper/Constant");
config();

const MarkStudentAttendance = async (req, res) => {
  try {
    const { Attendancedate, batch } = req.body;
    let newdate = new Date(Attendancedate);

    let checkattendance = await AttendanceStudent.findAll({
      where: {
        batch: batch,
        attendancedate: newdate,
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });

    if (checkattendance.length != 0) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Attendance successfully!!",
        data: checkattendance,
      });
    } else {
      let students;
      let whereClause = {};

      if (req.user) {
        whereClause.institutename = req.user.institutename;
      }

      if (batch) {
        whereClause.batch = { [Op.regexp]: `^${batch}.*` };
      }

      students = await Student.findAll({
        where: whereClause,
        order: [["rollnumber", "ASC"]],
      });

      const promises = students?.map(async (item) => {
        let result = await AttendanceStudent.create({
          name: item?.name,
          email: item?.email,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          userId: req?.user?.id,
          address: item?.address,
          parentId: item?.parentId,
          studentid: item?.id,
          courseorclass: item?.courseorclass,
          batch: item?.batch,
          rollnumber: item?.rollnumber,
          fathersPhoneNo: item?.fathersPhoneNo,
          fathersName: item?.fathersName,
          MathersName: item?.MathersName,
          rollnumber: item?.rollnumber,
          attendancedate: newdate,
        });

        return result;
      });

      if (await Promise.all(promises)) {
        let checkattendance = await AttendanceStudent.findAll({
          where: {
            batch: batch,
            attendancedate: newdate,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
          },
        });

        return respHandler.success(res, {
          status: true,
          msg: "All Absent Mark successfully!!",
          data: checkattendance,
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

const DoneStudentAttendance = async (req, res) => {
  try {
    const { data } = req.body;

    data?.map((item) => {
      await = AttendanceStudent.update(
        {
          attendaceStatus: item?.attendaceStatus,
        },
        {
          where: {
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            courseorclass: item?.courseorclass,
            batch: item?.batch,
            rollnumber: item?.rollnumber,
            attendancedate: item?.attendancedate,
          },
        }
      );
    });
    let allatttendance = await AttendanceStudent.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
        batch: data[0]?.batch,
        attendancedate: new Date(data[0]?.Attendancedate),
      },
      order: [["rollnumber", "ASC"]],
    });

    if (allatttendance) {
      return respHandler.success(res, {
        status: true,
        msg: "Attendance Save successfully!!",
        data: allatttendance,
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

const AttendanceAnalasis = async (req, res) => {
  try {
    const { batch, month } = req.body;
    let days = monthdays[month];

    let Students = await Student.findAll({
      where: {
        batch: batch,
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });

    let result = [];
    const promises = Students?.map(async (item) => {
      let checkattendance = await sequelizes.query(
        `Select * FROM studentattendances WHERE institutename = '${req.user.institutename}' AND ClientCode= '${req.user?.institutename}' AND MONTH(attendancedate) ='${month}' AND rollnumber = '${item?.rollnumber}';`,
        {
          nest: true,
          type: QueryTypes.SELECT,
          raw: true,
        }
      );

      if (checkattendance) {
        result.push({
          student: item,
          attendance: checkattendance,
          days: days,
        });
      }
    });

    if (await Promise.all(promises)) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Monthly Attendance Successfully!!",
        data: result,
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
  DoneStudentAttendance,
  MarkStudentAttendance,
  AttendanceAnalasis,
};
