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

// const MarkStudentAttendance = async (req, res) => {
//   try {
//     const { Attendancedate, batch } = req.body;
//     let newdate = new Date(Attendancedate);
//     let students;
//     let whereClause = {};

//     // if (req.user) {
//     //   whereClause.institutename = req.user.institutename;
//     // }

//     // if (batch) {
//     //   whereClause.batch = { [Op.regexp]: `^${batch}.*` };
//     // }

//     let todayAttendance = await AttendanceStudent.findAll({
//       batch: batch,
//       attendancedate: newdate,
//       ClientCode: req.user?.ClientCode,
//       institutename: req.user?.institutename,
//     });
//     if (todayAttendance?.length === 0) {
//       let month = newdate?.getMonth();
//       let year = newdate?.getFullYear();
//       let days = monthdays[month + 1];
//       if (days?.length > 0) {
//         const promises = days?.map(async (item) => {
//           let result = await AttendanceStudent.create({
//             name: "anil",
//             email: "anilb@gmail.com",
//             ClientCode: req.user?.ClientCode,
//             institutename: req.user?.institutename,
//             userId: req?.user?.id,
//             address: "pilibhit",
//             parentId: 1,
//             studentid: 2,
//             courseorclass: "BCA",
//             batch: batch,
//             rollnumber: 1,
//             fathersPhoneNo: "7505786956",
//             fathersName: "Anil Babu",
//             MathersName: "mam",
//             rollnumber: 4,
//             attendancedate: `${newdate?.getFullYear()}-${
//               newdate?.getMonth() + 1
//             }-${index + 1}T00:00:00.000Z`,
//           });

//           return result;
//         });

//         if (await Promise.all(promises)) {
//           let checkattendance = await AttendanceStudent.findAll({
//             where: {
//               batch: batch,
//               // attendancedate: newdate,
//               ClientCode: req.user?.ClientCode,
//               institutename: req.user?.institutename,
//             },
//           });

//           return respHandler.success(res, {
//             status: true,
//             msg: "All Absent Mark successfully!!",
//             data: checkattendance,
//           });
//         }
//       }
//     }
//   } catch (err) {
//     return respHandler.error(res, {
//       status: false,
//       msg: "Something Went Wrong!!",
//       error: [err.message],
//     });
//   }
// };

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

    if (checkattendance[0]?.attendaceStatusIntext === "Holiday") {
      return respHandler.error(res, {
        status: false,
        msg: "Today Is Holiday!!",
        data: [],
      });
    }
    if (checkattendance?.length != 0) {
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
          attendaceStatusIntext: "Absent",
          monthNumber: newdate?.getMonth() + 1,
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
          attendaceStatusIntext:
            item?.attendaceStatus === true ? "Present" : "Absent",
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
    const { batch, month, rollname, studentname } = req.body;
    let days = monthdays[month];

    if (rollname) {
      let result = [];
      let st = await Student.findOne({
        where: {
          rollnumber: rollname,
        },
      });
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
    if (forbatch != "default") {
      let checkattendance = await AttendanceStudent.findAll({
        where: {
          batch: batchname,
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
        let allstudent = await Student.findAll({
          where: {
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            batch: { [Op.regexp]: `^${batchname}.*` },
          },
        });

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
