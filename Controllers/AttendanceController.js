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
    const { Attendancedate, batch, classname, sectionname } = req.body;
    let newdate = new Date(Attendancedate);
    var monthName = monthNames[newdate?.getMonth()];
    let fullyear = newdate.getFullYear();
    let lastyear = newdate.getFullYear() - 1;
    let session = `${lastyear}-${fullyear}`;
    let days = monthdays[newdate?.getMonth() + 1];

    let students;

    if (classname) {
      students = await Student.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
          courseorclass: classname,
          Section: sectionname,
          Session: session,
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
          ClientCode: req.user?.ClientCode,
          batch: batch,
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
    if (students) {
      const dayName = getDayName(Attendancedate);
      if (dayName === "Sunday") {
        // return respHandler.success(res, {
        //   status: true,
        //   msg: "Today Is Sunday Updated!!",
        //   data: [],
        // });
        let isattendance;
        if (classname) {
          isattendance = await AttendanceStudent.findAll({
            where: {
              courseorclass: classname,
              attendancedate: newdate,
              ClientCode: req.user?.ClientCode,
              MonthName: monthName,
              Section: sectionname,
              yeay: newdate?.getFullYear(),
              MonthNo: newdate?.getMonth() + 1,
            },
          });
        }
        console.log("Today Is Sunday", isattendance);
        if (batch) {
          isattendance = await AttendanceStudent.findAll({
            where: {
              batch: batch,
              attendancedate: newdate,
              ClientCode: req.user?.ClientCode,
              MonthName: monthName,
              yeay: newdate?.getFullYear(),
              MonthNo: newdate?.getMonth() + 1,
            },
          });
        }

        if (isattendance[0]?.attendaceStatusIntext === "Holiday") {
          return respHandler.success(res, {
            status: true,
            msg: "Today Is Sunday!!",
            data: [],
          });
        } else {
          let isupdatd = await AttendanceStudent.update(
            {
              // attendaceStatus: item?.attendaceStatus,
              Section: sectionname,
              attendaceStatusIntext: "Holiday",
              Comment: "Today Is Sunday",
            },
            {
              where: {
                courseorclass: classname,
                attendancedate: newdate,
                ClientCode: req.user?.ClientCode,
                MonthName: monthName,
                yeay: newdate?.getFullYear(),
                MonthNo: newdate?.getMonth() + 1,
              },
            }
          );

          if (isupdatd) {
            return respHandler.success(res, {
              status: true,
              msg: "Today Is Sunday Updated!!",
              data: [],
            });
          }
        }
      } else {
        let isattendance;
        if (classname) {
          isattendance = await AttendanceStudent.findAll({
            where: {
              courseorclass: classname,
              attendancedate: newdate,
              ClientCode: req.user?.ClientCode,
              MonthName: monthName,
              yeay: newdate?.getFullYear(),
              MonthNo: newdate?.getMonth() + 1,
            },
          });
        }

        if (batch) {
          isattendance = await AttendanceStudent.findAll({
            where: {
              batch: batch,
              attendancedate: newdate,
              ClientCode: req.user?.ClientCode,
              MonthName: monthName,
              yeay: newdate?.getFullYear(),
              MonthNo: newdate?.getMonth() + 1,
            },
          });
        }

        if (isattendance?.length > 0) {
          return respHandler.success(res, {
            status: true,
            msg: "All Absent Mark successfully!!",
            data: isattendance,
          });
        } else {
          const promises = days?.map(async (date, indexdate) => {
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
                Section: sectionname,
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
                attendancedate: `${newdate?.getFullYear()}-${
                  newdate?.getMonth() + 1
                }-${date}`,
                attendaceStatusIntext:
                  item?.Status === "Active" ? "Absent" : item?.Status,
                monthNumber: newdate?.getMonth() + 1,
              });

              return result;
            });

            return await Promise.all(promises);
          });

          if (await Promise.all(promises)) {
            let checkattendance = await AttendanceStudent.findAll({
              where: {
                courseorclass: classname,
                attendancedate: newdate,
                ClientCode: req.user?.ClientCode,
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
      if (batch) {
        st = await Student.findOne({
          where: {
            batch: batch,
            rollnumber: rollname,
            ClientCode: req.user?.ClientCode,
            [Op.or]: [
              { Status: "Unknown" },
              { Status: "Left In Middle" },
              { Status: "On Leave" },
              { Status: "Active" },
            ],
          },
        });
      }
      if (classname) {
        st = await Student.findOne({
          where: {
            courseorclass: classname,
            rollnumber: rollname,
            ClientCode: req.user?.ClientCode,
            [Op.or]: [
              { Status: "Unknown" },
              { Status: "Left In Middle" },
              { Status: "On Leave" },
              { Status: "Active" },
            ],
          },
        });
      }

      let checkattendance;
      if (batch) {
        checkattendance = await sequelizes.query(
          `Select * FROM studentattendances WHERE ClientCode= '${req.user?.ClientCode}' AND MONTH(attendancedate) ='${month}' AND rollnumber = '${rollname}' AND batch = '${batch}';`,
          {
            nest: true,
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
      }
      if (classname) {
        checkattendance = await sequelizes.query(
          `Select * FROM studentattendances WHERE ClientCode= '${req.user?.ClientCode}' AND MONTH(attendancedate) ='${month}' AND rollnumber = '${rollname}' AND courseorclass = '${classname}';`,
          {
            nest: true,
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
      }

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
        if (classname) {
          Students = await Student.findAll({
            where: {
              courseorclass: classname,
              ClientCode: req.user?.ClientCode,
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
              Status: status,
              [Op.or]: [
                { Status: "Unknown" },
                { Status: "Left In Middle" },
                { Status: "On Leave" },
                { Status: "Active" },
              ],
            },
          });
        }
      } else {
        if (classname) {
          Students = await Student.findAll({
            where: {
              courseorclass: classname,
              ClientCode: req.user?.ClientCode,
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
              [Op.or]: [
                { Status: "Unknown" },
                { Status: "Left In Middle" },
                { Status: "On Leave" },
                { Status: "Active" },
              ],
            },
          });
        }
      }

      let result = [];
      const promises = Students?.map(async (item) => {
        let checkattendance;
        if (batch) {
          checkattendance = await sequelizes.query(
            `Select * FROM studentattendances WHERE ClientCode= '${req.user?.ClientCode}' AND MONTH(attendancedate) ='${month}' AND rollnumber = '${item?.rollnumber}' AND batch = '${item?.batch}';`,
            {
              nest: true,
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
        }
        if (classname) {
          checkattendance = await sequelizes.query(
            `Select * FROM studentattendances WHERE ClientCode= '${req.user?.ClientCode}' AND MONTH(attendancedate) ='${month}' AND rollnumber = '${item?.rollnumber}'  AND courseorclass = '${item?.courseorclass}';`,
            {
              nest: true,
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
        }

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

// const AddHoliday = async (req, res) => {
//   try {
//     const { holidaydate, batchname, comment, forbatch } = req.body;
//     let newdate = new Date(holidaydate);
//     var monthName = monthNames[newdate?.getMonth()];
//     if (forbatch != "default") {
//       let checkattendance;
//       if (batchname) {
//         checkattendance = await AttendanceStudent.findAll({
//           where: {
//             batch: batchname,
//             attendancedate: newdate,
//             ClientCode: req.user?.ClientCode,
//             institutename: req.user?.institutename,
//             MonthName: monthName,
//             yeay: newdate?.getFullYear(),
//             MonthNo: newdate?.getMonth() + 1,
//           },
//         });
//       } else {
//         checkattendance = await AttendanceStudent.findAll({
//           where: {
//             attendancedate: newdate,
//             ClientCode: req.user?.ClientCode,
//             institutename: req.user?.institutename,
//             MonthName: monthName,
//             yeay: newdate?.getFullYear(),
//             MonthNo: newdate?.getMonth() + 1,
//           },
//         });
//       }

//       if (checkattendance?.length > 0) {
//         return respHandler.error(res, {
//           status: false,
//           msg: "AllReady Marked Holiday!!",
//           error: [""],
//         });
//       } else {
//         let allstudent;
//         if (batchname) {
//           allstudent = await Student.findAll({
//             where: {
//               ClientCode: req.user?.ClientCode,
//               batch: { [Op.regexp]: `^${batchname}.*` },
//             },
//           });
//         } else {
//           allstudent = await Student.findAll({
//             where: {
//               ClientCode: req.user?.ClientCode,
//             },
//           });
//         }

//         const promises = allstudent?.map(async (item) => {
//           let result = await AttendanceStudent.create({
//             name: item?.name,
//             email: item?.email,
//             ClientCode: req.user?.ClientCode,
//             institutename: req.user?.institutename,
//             userId: req?.user?.id,
//             address: item?.address,
//             parentId: item?.parentId,
//             studentid: item?.id,
//             courseorclass: item?.courseorclass,
//             batch: item?.batch,
//             rollnumber: item?.rollnumber,
//             fathersPhoneNo: item?.fathersPhoneNo,
//             fathersName: item?.fathersName,
//             MathersName: item?.MathersName,
//             rollnumber: item?.rollnumber,
//             attendancedate: newdate,
//             attendaceStatusIntext: "Holiday",
//             Comment: comment,
//             monthNumber: newdate?.getMonth() + 1,
//             holidaytype: "manual",
//             MonthName: monthName,
//             yeay: newdate?.getFullYear(),
//             MonthNo: newdate?.getMonth() + 1,
//           });

//           return result;
//         });

//         if (await Promise.all(promises)) {
//           let checkattendance = await AttendanceStudent.findAll({
//             where: {
//               batch: batchname,
//               attendancedate: newdate,
//               ClientCode: req.user?.ClientCode,
//               institutename: req.user?.institutename,
//               MonthName: monthName,
//               yeay: newdate?.getFullYear(),
//               MonthNo: newdate?.getMonth() + 1,
//             },
//           });

//           return respHandler.success(res, {
//             status: true,
//             msg: "Holiday Added successfully!!",
//             data: checkattendance,
//           });
//         }
//       }
//     } else {
//       let allbatch = await Batch.findAll({
//         where: {
//           ClientCode: req.user?.ClientCode,
//           institutename: req.user?.institutename,
//         },
//       });
//       let checkattendance = await AttendanceStudent.findAll({
//         where: {
//           batch: `${allbatch[0]?.StartingTime} TO ${allbatch[0]?.EndingTime}`,
//           attendancedate: newdate,
//           ClientCode: req.user?.ClientCode,
//           institutename: req.user?.institutename,
//         },
//       });
//       if (checkattendance?.length > 0) {
//         return respHandler.error(res, {
//           status: false,
//           msg: "AllReady Marked Holiday!!",
//           error: [""],
//         });
//       } else {
//         allbatch?.map(async (item) => {
//           let allstudent = [];
//           allstudent = await Student.findAll({
//             where: {
//               ClientCode: req.user?.ClientCode,
//               institutename: req.user?.institutename,
//               batch: {
//                 [Op.regexp]: `^${item?.StartingTime} TO ${item?.EndingTime}.*`,
//               },
//             },
//           });

//           if (allstudent) {
//             allstudent?.map(async (item) => {
//               await AttendanceStudent.create({
//                 name: item?.name,
//                 email: item?.email,
//                 ClientCode: req.user?.ClientCode,
//                 institutename: req.user?.institutename,
//                 userId: req?.user?.id,
//                 address: item?.address,
//                 parentId: item?.parentId,
//                 studentid: item?.id,
//                 courseorclass: item?.courseorclass,
//                 batch: item?.batch,
//                 rollnumber: item?.rollnumber,
//                 fathersPhoneNo: item?.fathersPhoneNo,
//                 fathersName: item?.fathersName,
//                 MathersName: item?.MathersName,
//                 rollnumber: item?.rollnumber,
//                 attendancedate: newdate,
//                 attendaceStatusIntext: "Holiday",
//                 Comment: comment,
//                 monthNumber: newdate?.getMonth() + 1,
//                 holidaytype: "default",
//                 MonthName: monthName,
//                 yeay: newdate?.getFullYear(),
//                 MonthNo: newdate?.getMonth() + 1,
//               });
//             });
//           }
//         });

//         return respHandler.success(res, {
//           status: true,
//           msg: "Holiday Added successfully!!",
//           data: [],
//         });
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

const AddHoliday = async (req, res) => {
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

    if (checkattendance) {
      const promises = checkattendance?.map(async (date, indexdate) => {
        let isupdatd = await AttendanceStudent.update(
          {
            // attendaceStatus: item?.attendaceStatus,
            attendaceStatusIntext: "Holiday",
            Comment: comment,
          },
          {
            where: {
              attendancedate: newdate,
              ClientCode: req.user?.ClientCode,
              MonthName: monthName,
              yeay: newdate?.getFullYear(),
              MonthNo: newdate?.getMonth() + 1,
            },
          }
        );

        return isupdatd;
      });

      if (await Promise.all(promises)) {
        return respHandler.success(res, {
          status: true,
          msg: "Holiday Marked Successfully!!",
          data: checkattendance,
        });
      }
    }
  }
};

const GetHolidays = async (req, res) => {
  try {
    const { month } = req.body;

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
    const { holidaydate, batchname, comment, status } = req.body;
    let newdate = new Date(holidaydate);

    const dayName = getDayName(holidaydate);
    if (dayName === "Sunday") {
    }

    var monthName = monthNames[newdate?.getMonth()];
    if (batchname) {
      let checkattendance = await AttendanceStudent.findAll({
        where: {
          attendancedate: newdate,
          ClientCode: req.user?.ClientCode,
          MonthName: monthName,
          yeay: newdate?.getFullYear(),
          MonthNo: newdate?.getMonth() + 1,
        },
      });

      if (checkattendance) {
        if (status === "Disable") {
          const promises = checkattendance?.map(async (date, indexdate) => {
            let isupdatd = await AttendanceStudent.update(
              {
                // attendaceStatus: item?.attendaceStatus,
                attendaceStatusIntext: "Absent",
                attendaceStatus: 0,
                Comment: comment,
              },
              {
                where: {
                  attendancedate: newdate,
                  ClientCode: req.user?.ClientCode,
                  MonthName: monthName,
                  yeay: newdate?.getFullYear(),
                  MonthNo: newdate?.getMonth() + 1,
                },
              }
            );

            return isupdatd;
          });

          if (await Promise.all(promises)) {
            return respHandler.success(res, {
              status: true,
              msg: "Holiday Marked Successfully!!",
              data: checkattendance,
            });
          }
        } else {
          const promises = checkattendance?.map(async (date, indexdate) => {
            let isupdatd = await AttendanceStudent.update(
              {
                // attendaceStatus: item?.attendaceStatus,
                attendaceStatusIntext: "Holiday",
                attendaceStatus: 1,
                Comment: comment,
              },
              {
                where: {
                  attendancedate: newdate,
                  ClientCode: req.user?.ClientCode,
                  MonthName: monthName,
                  yeay: newdate?.getFullYear(),
                  MonthNo: newdate?.getMonth() + 1,
                },
              }
            );

            return isupdatd;
          });

          if (await Promise.all(promises)) {
            return respHandler.success(res, {
              status: true,
              msg: "Holiday Marked Successfully!!",
              data: checkattendance,
            });
          }
        }
      }
    } else {
      let checkattendance = await AttendanceStudent.findAll({
        where: {
          attendancedate: newdate,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          MonthName: monthName,
          yeay: newdate?.getFullYear(),
          MonthNo: newdate?.getMonth() + 1,
        },
      });

      if (checkattendance) {
        if (status === "Disable") {
          const promises = checkattendance?.map(async (date, indexdate) => {
            let isupdatd = await AttendanceStudent.update(
              {
                // attendaceStatus: item?.attendaceStatus,
                attendaceStatusIntext: "Absent",
                attendaceStatus: 0,
                Comment: comment,
              },
              {
                where: {
                  attendancedate: newdate,
                  ClientCode: req.user?.ClientCode,
                  MonthName: monthName,
                  yeay: newdate?.getFullYear(),
                  MonthNo: newdate?.getMonth() + 1,
                },
              }
            );

            return isupdatd;
          });

          if (await Promise.all(promises)) {
            return respHandler.success(res, {
              status: true,
              msg: "Holiday Marked Successfully!!",
              data: checkattendance,
            });
          }
        } else {
          const promises = checkattendance?.map(async (date, indexdate) => {
            let isupdatd = await AttendanceStudent.update(
              {
                // attendaceStatus: item?.attendaceStatus,
                attendaceStatusIntext: "Holiday",
                attendaceStatus: 1,
                Comment: comment,
              },
              {
                where: {
                  attendancedate: newdate,
                  ClientCode: req.user?.ClientCode,
                  MonthName: monthName,
                  yeay: newdate?.getFullYear(),
                  MonthNo: newdate?.getMonth() + 1,
                },
              }
            );

            return isupdatd;
          });

          if (await Promise.all(promises)) {
            return respHandler.success(res, {
              status: true,
              msg: "Holiday Marked Successfully!!",
              data: checkattendance,
            });
          }
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

const GetStudentTodayAttendance = async (req, res) => {
  try {
    const { studentid } = req.body;
    let newdate = new Date();
    let fullyear = newdate.getFullYear();
    let whereClause = {};
    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
      whereClause.studentid = studentid ? studentid : req.user.id;
      whereClause.yeay = fullyear?.toString();
      whereClause.attendancedate = newdate;
    }

    let checkattendance = await AttendanceStudent.findOne({
      where: whereClause,
    });

    if (checkattendance) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Today Attendance Successfully!!",
        data: checkattendance,
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Something Went Wrong!!",
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

const GetStudentAllMonthAttendance = async (req, res) => {
  try {
    const { studentid } = req.body;
    let newdate = new Date();
    let fullyear = newdate.getFullYear();
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
      whereClause.yeay = fullyear?.toString();
      whereClause.studentid = studentid ? studentid : req.user.id;
    }

    let checkattendance = await AttendanceStudent.findAll({
      where: whereClause,
      order: [["MonthNo", "ASC"]],
    });

    if (checkattendance) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Month Attendance Successfully!!",
        data: checkattendance,
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Not Found!!",
        error: [err.message],
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

const GetStudentByDateAttendance = async (req, res) => {
  try {
    const { fromdate, todate, studentid } = req.body;
    let newdate = new Date();
    let fullyear = newdate.getFullYear();
    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
      whereClause.yeay = fullyear?.toString();
      whereClause.studentid = studentid ? studentid : req.user.id;
    }

    if (fromdate && todate) {
      whereClause.attendancedate = { [Op.between]: [from, to] };
    }

    let checkattendance = await AttendanceStudent.findAll({
      where: whereClause,
      order: [
        ["MonthNo", "ASC"],
        ["attendancedate", "ASC"],
      ],
    });

    if (checkattendance) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Attendance Successfully!!",
        data: checkattendance,
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Not Found!!",
        error: [err.message],
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
  GetStudentTodayAttendance,
  GetStudentAllMonthAttendance,
  GetStudentByDateAttendance,
};
