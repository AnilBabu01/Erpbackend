const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
var moment = require("moment");
const sequelizes = require("../Helper/Connect");
const { config } = require("dotenv");
const Student = require("../Models/student.model");
const AttendanceStudent = require("../Models/attendance.model");
const Batch = require("../Models/batch.model");
const respHandler = require("../Handlers");
const { monthdays } = require("../Helper/Constant");
config();
function getDayName(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = new Date(date).getDay();
  return days[dayIndex];
}
var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MarkStudentAttendance = async (req, res) => {
  try {
    const { Attendancedate, batch, classname } = req.body;
    let newdate = new Date(Attendancedate);
    const dayName = getDayName(Attendancedate);
    var monthName = monthNames[newdate?.getMonth()];
    if (dayName === "Sunday") {
      let checkattendance = await AttendanceStudent.findAll({
        where: {
          batch: batch ? batch : classname,
          attendancedate: newdate,
          ClientCode: req.user?.ClientCode,
          attendaceStatusIntext: "Holiday",
          MonthName: monthName,
          yeay: newdate?.getFullYear(),
          MonthNo: newdate?.getMonth() + 1,
        },
      });

      if (checkattendance?.length > 0) {
        return respHandler.success(res, {
          status: true,
          msg: "Today Is Sunday!!",
          data: [],
        });
      } else {
        let allstudent;
        if (classname) {
          allstudent = await Student.findAll({
            where: {
              ClientCode: req.user?.ClientCode,
              courseorclass: { [Op.regexp]: `^${classname}.*` },
            },
          });
        } else {
          allstudent = await Student.findAll({
            where: {
              ClientCode: req.user?.ClientCode,
              batch: { [Op.regexp]: `^${batch}.*` },
            },
          });
        }

        const promises = allstudent?.map(async (item) => {
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
            batch: classname ? item?.courseorclass : item?.batch,
            rollnumber: item?.rollnumber,
            fathersPhoneNo: item?.fathersPhoneNo,
            fathersName: item?.fathersName,
            MathersName: item?.MathersName,
            rollnumber: item?.rollnumber,
            attendancedate: newdate,
            attendaceStatusIntext: "Holiday",
            Comment: "Today Is Sunday",
            monthNumber: newdate?.getMonth() + 1,
            holidaytype: "manual",
            MonthName: monthName,
            yeay: newdate?.getFullYear(),
            MonthNo: newdate?.getMonth() + 1,
          });

          return result;
        });

        if (await Promise.all(promises)) {
          let checkattendance = await AttendanceStudent.findAll({
            where: {
              batch: batch ? batch : classname,
              attendancedate: newdate,
              ClientCode: req.user?.ClientCode,
              MonthName: monthName,
              attendaceStatusIntext: "Absent",
              yeay: newdate?.getFullYear(),
              MonthNo: newdate?.getMonth() + 1,
            },
          });

          return respHandler.success(res, {
            status: true,
            msg: "Today Is Sunday!!",
            data: checkattendance,
          });
        }
      }
    } else {
      let checkattendance = await AttendanceStudent.findAll({
        where: {
          batch: batch ? batch : classname,
          attendancedate: newdate,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          // attendaceStatusIntext: "Absent",
          MonthName: monthName,
          yeay: newdate?.getFullYear(),
          MonthNo: newdate?.getMonth() + 1,
        },
      });

      if (checkattendance[0]?.attendaceStatusIntext === "Holiday") {
        return respHandler.error(res, {
          status: false,
          msg: "Today Is Holiday!!",
          data: [],
        });
      }
      if (checkattendance?.length > 0) {
        return respHandler.success(res, {
          status: true,
          msg: "Fetch Attendance successfully!!",
          data: checkattendance,
        });
      } else {
        let students;
        if (classname) {
          students = await Student.findAll({
            where: {
              institutename: req.user.institutename,
              courseorclass: { [Op.regexp]: `^${classname}.*` },
              [Op.or]: [
                { Status: "Unknown" },
                { Status: "Left In Middle" },
                { Status: "On Leave" },
                { Status: "Active" },
              ],
            },
            order: [["rollnumber", "ASC"]],
          });
        } else {
          students = await Student.findAll({
            where: {
              institutename: req.user.institutename,
              batch: { [Op.regexp]: `^${batch}.*` },
              [Op.or]: [
                { Status: "Unknown" },
                { Status: "Left In Middle" },
                { Status: "On Leave" },
                { Status: "Active" },
              ],
            },
            order: [["rollnumber", "ASC"]],
          });
        }

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
            batch: classname ? item?.courseorclass : item?.batch,
            rollnumber: item?.rollnumber,
            fathersPhoneNo: item?.fathersPhoneNo,
            fathersName: item?.fathersName,
            MathersName: item?.MathersName,
            rollnumber: item?.rollnumber,
            MonthName: monthName,
            yeay: newdate?.getFullYear(),
            MonthNo: newdate?.getMonth() + 1,
            attendancedate: newdate,
            attendaceStatusIntext:
              item?.Status === "Active" ? "Absent" : item?.Status,
            monthNumber: newdate?.getMonth() + 1,
          });

          return result;
        });

        if (await Promise.all(promises)) {
          let checkattendance = await AttendanceStudent.findAll({
            where: {
              batch: batch ? batch : classname,
              attendancedate: newdate,
              ClientCode: req.user?.ClientCode,
              institutename: req.user?.institutename,
              attendaceStatusIntext: "Absent",
              MonthName: monthName,
              yeay: newdate?.getFullYear(),
              MonthNo: newdate?.getMonth() + 1,
            },
          });

          return respHandler.success(res, {
            status: true,
            msg: "All Absent Mark successfully!!",
            data: checkattendance,
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

const DoneStudentAttendance = async (req, res) => {
  try {
    const { data, classname } = req.body;

    data?.map((item) => {
      await = AttendanceStudent.update(
        {
          attendaceStatus: item?.attendaceStatus,
          attendaceStatusIntext:
            item?.attendaceStatus === true
              ? "Present"
              : item?.attendaceStatusIntext,
        },
        {
          where: {
            ClientCode: req.user?.ClientCode,
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
    const { batch, month, rollname, status, classname } = req.body;
    let days = monthdays[month];

    if (rollname) {
      let result = [];
      let st;
      if (status) {
        st = await Student.findOne({
          where: {
            rollnumber: rollname,
            Status: status,
            [Op.or]: [
              { Status: "Unknown" },
              { Status: "Left In Middle" },
              { Status: "On Leave" },
              { Status: "Active" },
            ],
          },
        });
      } else {
        st = await Student.findOne({
          where: {
            rollnumber: rollname,
            [Op.or]: [
              { Status: "Unknown" },
              { Status: "Left In Middle" },
              { Status: "On Leave" },
              { Status: "Active" },
            ],
          },
        });
      }

      let checkattendance = await sequelizes.query(
        `Select * FROM studentattendances WHERE institutename = '${req.user.institutename}' AND ClientCode= '${req.user?.ClientCode}' AND MONTH(attendancedate) ='${month}' AND rollnumber = '${rollname}';`,
        {
          nest: true,
          type: QueryTypes.SELECT,
          raw: true,
        }
      );

      if (checkattendance) {
        if (st) {
          result.push({
            student: st,
            attendance: checkattendance,
            days: days,
          });

          return respHandler.success(res, {
            status: true,
            msg: "Fetch Monthly Attendance Successfully!!",
            data: result,
          });
        }
      }
    } else {
      let Students;
      if (status) {
        Students = await Student.findAll({
          where: {
            batch: batch,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            Status: status,
            [Op.or]: [
              { Status: "Unknown" },
              { Status: "Left In Middle" },
              { Status: "On Leave" },
              { Status: "Active" },
            ],
          },
        });
      } else {
        Students = await Student.findAll({
          where: {
            batch: batch,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            [Op.or]: [
              { Status: "Unknown" },
              { Status: "Left In Middle" },
              { Status: "On Leave" },
              { Status: "Active" },
            ],
          },
        });
      }

      let result = [];
      const promises = Students?.map(async (item) => {
        let checkattendance = await sequelizes.query(
          `Select * FROM studentattendances WHERE institutename = '${req.user.institutename}' AND ClientCode= '${req.user?.ClientCode}' AND MONTH(attendancedate) ='${month}' AND rollnumber = '${item?.rollnumber}';`,
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
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const AddHoliday = async (req, res) => {
  try {
    const { holidaydate, batchname, comment, forbatch } = req.body;
    let newdate = new Date(holidaydate);
    var monthName = monthNames[newdate?.getMonth()];
    if (forbatch != "default") {
      let checkattendance;
      if (batchname) {
        checkattendance = await AttendanceStudent.findAll({
          where: {
            batch: batchname,
            attendancedate: newdate,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            MonthName: monthName,
            yeay: newdate?.getFullYear(),
            MonthNo: newdate?.getMonth() + 1,
          },
        });
      } else {
        checkattendance = await AttendanceStudent.findAll({
          where: {
            attendancedate: newdate,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            MonthName: monthName,
            yeay: newdate?.getFullYear(),
            MonthNo: newdate?.getMonth() + 1,
          },
        });
      }

      if (checkattendance?.length > 0) {
        return respHandler.error(res, {
          status: false,
          msg: "AllReady Marked Holiday!!",
          error: [""],
        });
      } else {
        let allstudent;
        if (batchname) {
          allstudent = await Student.findAll({
            where: {
              ClientCode: req.user?.ClientCode,
              batch: { [Op.regexp]: `^${batchname}.*` },
            },
          });
        } else {
          allstudent = await Student.findAll({
            where: {
              ClientCode: req.user?.ClientCode,
            },
          });
        }

        const promises = allstudent?.map(async (item) => {
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
            attendaceStatusIntext: "Holiday",
            Comment: comment,
            monthNumber: newdate?.getMonth() + 1,
            holidaytype: "manual",
            MonthName: monthName,
            yeay: newdate?.getFullYear(),
            MonthNo: newdate?.getMonth() + 1,
          });

          return result;
        });

        if (await Promise.all(promises)) {
          let checkattendance = await AttendanceStudent.findAll({
            where: {
              batch: batchname,
              attendancedate: newdate,
              ClientCode: req.user?.ClientCode,
              institutename: req.user?.institutename,
              MonthName: monthName,
              yeay: newdate?.getFullYear(),
              MonthNo: newdate?.getMonth() + 1,
            },
          });

          return respHandler.success(res, {
            status: true,
            msg: "Holiday Added successfully!!",
            data: checkattendance,
          });
        }
      }
    } else {
      let allbatch = await Batch.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      let checkattendance = await AttendanceStudent.findAll({
        where: {
          batch: `${allbatch[0]?.StartingTime} TO ${allbatch[0]?.EndingTime}`,
          attendancedate: newdate,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      if (checkattendance?.length > 0) {
        return respHandler.error(res, {
          status: false,
          msg: "AllReady Marked Holiday!!",
          error: [""],
        });
      } else {
        allbatch?.map(async (item) => {
          let allstudent = [];
          allstudent = await Student.findAll({
            where: {
              ClientCode: req.user?.ClientCode,
              institutename: req.user?.institutename,
              batch: {
                [Op.regexp]: `^${item?.StartingTime} TO ${item?.EndingTime}.*`,
              },
            },
          });

          if (allstudent) {
            allstudent?.map(async (item) => {
              await AttendanceStudent.create({
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
                attendaceStatusIntext: "Holiday",
                Comment: comment,
                monthNumber: newdate?.getMonth() + 1,
                holidaytype: "default",
                MonthName: monthName,
                yeay: newdate?.getFullYear(),
                MonthNo: newdate?.getMonth() + 1,
              });
            });
          }
        });

        return respHandler.success(res, {
          status: true,
          msg: "Holiday Added successfully!!",
          data: [],
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

const GetHolidays = async (req, res) => {
  try {
    const { month } = req.body;

    console.log("month no is ", month);

    let checkattendance = await AttendanceStudent.findAll({
      where: {
        monthNumber: month,
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
        attendaceStatusIntext: "Holiday",
      },
      group: ["attendancedate"],
    });

    if (checkattendance?.length != 0) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Holidays successfully!!",
        data: checkattendance,
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

const Updateholiday = async (req, res) => {
  try {
    const { holidaydate, batchname, comment, data, forbatch } = req.body;
    let newdate = new Date(holidaydate);
    let byupdatedate = new Date(data?.attendancedate);
    if (forbatch === "manual") {
      let allstudent = await Student.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          batch: { [Op.regexp]: `^${data?.batch}.*` },
        },
      });
      if (allstudent) {
        const promises = allstudent?.map(async (item) => {
          let result = await AttendanceStudent.update(
            {
              name: item?.name,
              email: item?.email,
              ClientCode: req.user?.ClientCode,
              institutename: req.user?.institutename,
              userId: req?.user?.id,
              address: item?.address,
              parentId: item?.parentId,
              studentid: item?.id,
              courseorclass: item?.courseorclass,
              batch: batchname,
              rollnumber: item?.rollnumber,
              fathersPhoneNo: item?.fathersPhoneNo,
              fathersName: item?.fathersName,
              MathersName: item?.MathersName,
              rollnumber: item?.rollnumber,
              attendancedate: newdate,
              attendaceStatusIntext: "Holiday",
              Comment: comment,
              monthNumber: newdate?.getMonth() + 1,
              holidaytype: "manual",
            },
            {
              attendancedate: byupdatedate,
              ClientCode: req.user?.ClientCode,
              institutename: req.user?.institutename,
              attendaceStatusIntext: "Holiday",
              batch: { [Op.regexp]: `^${data?.batch}.*` },
            }
          );

          return result;
        });

        if (await Promise.all(promises)) {
          let checkattendance = await AttendanceStudent.findAll({
            where: {
              batch: batchname,
              attendancedate: newdate,
              ClientCode: req.user?.ClientCode,
              institutename: req.user?.institutename,
            },
          });

          return respHandler.success(res, {
            status: true,
            msg: "Holiday Updated successfully!!",
            data: checkattendance,
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

const Deleteholiday = async (req, res) => {
  try {
    const { month } = req.body;

    console.log("month no is ", month);

    let checkattendance = await AttendanceStudent.findAll({
      where: {
        monthNumber: month,
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
        attendaceStatusIntext: "Holiday",
      },
      group: ["attendancedate"],
    });

    if (checkattendance?.length != 0) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Holidays successfully!!",
        data: checkattendance,
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
  AddHoliday,
  GetHolidays,
  Updateholiday,
  Deleteholiday,
};
