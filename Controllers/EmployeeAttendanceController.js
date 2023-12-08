const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
var moment = require("moment");
const sequelizes = require("../Helper/Connect");
const { config } = require("dotenv");
const Student = require("../Models/employee.model");
const AttendanceStudent = require("../Models/employeeattendance.model");
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

// const MarkEmployeeAttendance = async (req, res) => {
//   try {
//     const { Attendancedate, emp } = req.body;
//     let newdate = new Date(Attendancedate);
//     const dayName = getDayName(Attendancedate);
//     var monthName = monthNames[newdate?.getMonth()];
//     if (dayName === "Sunday") {
//       let checkattendance = await AttendanceStudent.findAll({
//         where: {
//           attendancedate: newdate,
//           ClientCode: req.user?.ClientCode,
//           MonthName: monthName,
//           attendaceStatusIntext: "Holiday",
//           yeay: newdate?.getFullYear(),
//           MonthNo: newdate?.getMonth() + 1,
//         },
//       });

//       if (checkattendance[0]?.attendaceStatusIntext === "Holiday") {
//         return respHandler.success(res, {
//           status: true,
//           msg: "Today Is Sunday!!",
//           data: [],
//         });
//       }
//       if (checkattendance?.length > 0) {
//         return respHandler.success(res, {
//           status: true,
//           msg: "Today Is Sunday!!",
//           data: "",
//         });
//       } else {
//         let allstudent = await Student.findAll({
//           where: {
//             ClientCode: req.user?.ClientCode,
//           },
//           [Op.or]: [{ Status: "On Leave" }, { Status: "Active" }],
//         });

//         const promises = allstudent?.map(async (item) => {
//           await AttendanceStudent.create({
//             name: item?.name,
//             email: item?.email,
//             ClientCode: req.user?.ClientCode,
//             institutename: req.user?.institutename,
//             userId: req?.user?.id,
//             attendancedate: newdate,
//             MonthName: monthName,
//             yeay: newdate?.getFullYear(),
//             MonthNo: newdate?.getMonth() + 1,
//             Designation: item?.employeetype,
//             attendaceStatusIntext: "Holiday",
//             Comment: "Today Is Sunday",
//             empId: item?.id,
//             monthNumber: newdate?.getMonth() + 1,
//             holidaytype: "default",
//           });
//         });
//         if (await Promise.all(promises)) {
//           return respHandler.success(res, {
//             status: true,
//             msg: "Today Is Sunday!!",
//             data: [],
//           });
//         }
//       }
//     } else {
//       let checkattendance = await AttendanceStudent.findAll({
//         where: {
//           attendancedate: newdate,
//           yeay: newdate?.getFullYear(),
//           MonthNo: newdate?.getMonth() + 1,
//           ClientCode: req.user?.ClientCode,
//         },
//       });

//       if (checkattendance[0]?.attendaceStatusIntext === "Holiday") {
//         return respHandler.error(res, {
//           status: false,
//           msg: "Today Is Holiday!!",
//           data: [],
//         });
//       }
//       if (checkattendance?.length > 0) {
//         return respHandler.success(res, {
//           status: true,
//           msg: "Fetch Attendance successfully!!",
//           data: checkattendance,
//         });
//       } else {
//         let students;
//         if (emp) {
//           students = await Student.findAll({
//             where: {
//               ClientCode: req.user?.ClientCode,
//               id: emp,
//               [Op.or]: [{ status: "On Leave" }, { status: "Active" }],
//             },
//             order: [["id", "ASC"]],
//           });
//         } else {
//           students = await Student.findAll({
//             where: {
//               ClientCode: req.user?.ClientCode,
//               [Op.or]: [{ status: "On Leave" }, { status: "Active" }],
//             },
//             order: [["id", "ASC"]],
//           });
//         }

//         const promises = students?.map(async (item) => {
//           let result = await AttendanceStudent.create({
//             name: item?.name,
//             empId: item?.id,
//             EmployeeId: item?.empId,
//             email: item?.email,
//             ClientCode: req.user?.ClientCode,
//             institutename: req.user?.institutename,
//             userId: req?.user?.id,
//             address: item?.address,
//             attendancedate: newdate,
//             MonthName: monthName,
//             yeay: newdate?.getFullYear(),
//             MonthNo: newdate?.getMonth() + 1,
//             attendaceStatusIntext:
//               item?.status === "Active" ? "Absent" : item?.status,
//             monthNumber: newdate?.getMonth() + 1,
//           });

//           return result;
//         });

//         if (await Promise.all(promises)) {
//           let checkattendance = await AttendanceStudent.findAll({
//             where: {
//               attendancedate: newdate,
//               ClientCode: req.user?.ClientCode,
//               attendaceStatusIntext: "Absent",
//               MonthName: monthName,
//               yeay: newdate?.getFullYear(),
//               MonthNo: newdate?.getMonth() + 1,
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

const MarkEmployeeAttendance = async (req, res) => {
  try {
    const { Attendancedate } = req.body;
    let newdate = new Date(Attendancedate);
    var monthName = monthNames[newdate?.getMonth()];
    let days = monthdays[newdate?.getMonth() + 1];

    let students = await Student.findAll({
      where: {
        ClientCode: req.user?.ClientCode,

        [Op.or]: [{ Status: "Active" }],
      },
      order: [["id", "ASC"]],
    });

    if (students) {
      const dayName = getDayName(Attendancedate);
      if (dayName === "Sunday") {
        let isattendance = await AttendanceStudent.findAll({
          where: {
            attendancedate: newdate,
            ClientCode: req.user?.ClientCode,
            MonthName: monthName,
            yeay: newdate?.getFullYear(),
            MonthNo: newdate?.getMonth() + 1,
          },
        });

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
              attendaceStatusIntext: "Holiday",
              Comment: "Today Is Sunday",
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

          if (isupdatd) {
            return respHandler.success(res, {
              status: true,
              msg: "Today Is Sunday Updated!!",
              data: [],
            });
          }
        }
      } else {
        let isattendance = await AttendanceStudent.findAll({
          where: {
            attendancedate: newdate,
            ClientCode: req.user?.ClientCode,
            MonthName: monthName,
            yeay: newdate?.getFullYear(),
            MonthNo: newdate?.getMonth() + 1,
          },
        });

        if (isattendance?.length > 0) {
          return respHandler.success(res, {
            status: true,
            msg: "All Absent Mark successfully!!",
            data: isattendance,
          });
        } else {
          const promises = days?.map(async (date) => {
            const promises = students?.map(async (item) => {
              let result = await AttendanceStudent.create({
                name: item?.name,
                empId: item?.id,
                EmployeeId: item?.empId,
                email: item?.email,
                ClientCode: req.user?.ClientCode,
                institutename: req.user?.institutename,
                userId: req?.user?.id,
                address: item?.address,
                attendancedate: `${newdate?.getFullYear()}-${
                  newdate?.getMonth() + 1
                }-${date}`,
                MonthName: monthName,
                yeay: newdate?.getFullYear(),
                MonthNo: newdate?.getMonth() + 1,
                attendaceStatusIntext:
                  item?.status === "Active" ? "Absent" : item?.status,
                monthNumber: newdate?.getMonth() + 1,
              });

              return result;
            });

            return await Promise.all(promises);
          });

          if (await Promise.all(promises)) {
            let checkattendance = await AttendanceStudent.findAll({
              where: {
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

const DoneEmployeeAttendance = async (req, res) => {
  try {
    const { data } = req.body;

    data?.map((item) => {
      await = AttendanceStudent.update(
        {
          attendaceStatus: item?.attendaceStatus,
          attendanceType: item?.attendanceType,
          attendaceStatusIntext:
            item?.attendaceStatus === true
              ? item?.attendanceType === "Half"
                ? "Present Half"
                : "Present"
              : item?.attendaceStatusIntext,
        },
        {
          where: {
            ClientCode: req.user?.ClientCode,
            attendancedate: item?.attendancedate,
            empId: item?.empId,
          },
        }
      );
    });
    let allatttendance = await AttendanceStudent.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
        // batch: data[0]?.batch,
        attendancedate: new Date(data[0]?.Attendancedate),
      },
      order: [["id", "ASC"]],
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
    const { month, emp } = req.body;
    let days = monthdays[month];
    let Students;
    let result = [];
    if (emp) {
      Students = await Student.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
          id: Number(emp),
          [Op.or]: [{ Status: "On Leave" }, { Status: "Active" }],
        },
      });
    } else {
      Students = await Student.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
          [Op.or]: [{ Status: "On Leave" }, { Status: "Active" }],
        },
      });
    }
    if (Students) {
      const promises = Students?.map(async (item) => {
        let checkattendance = await sequelizes.query(
          `Select * FROM employeeattendances WHERE ClientCode= '${req.user?.ClientCode}' AND MONTH(attendancedate) ='${month}' AND empId = '${item?.id}'
        ;`,
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
  const { holidaydate, batchname, comment, forbatch } = req.body;
  let newdate = new Date(holidaydate);
  var monthName = monthNames[newdate?.getMonth()];

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
    const promises = checkattendance?.map(async (item, indexdate) => {
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
};

const GetHolidays = async (req, res) => {
  try {
    const { month } = req.body;

    console.log("month no is ", month);

    let checkattendance = await AttendanceStudent.findAll({
      where: {
        monthNumber: month,
        ClientCode: req.user?.ClientCode,
        // institutename: req.user?.institutename,
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

// const Updateholiday = async (req, res) => {
//   try {
//     const { holidaydate, comment, data } = req.body;
//     let newdate = new Date(holidaydate);
//     let byupdatedate = new Date(data?.attendancedate);

//     let allstudent = await AttendanceStudent.findAll({
//       where: {
//         ClientCode: req.user?.ClientCode,
//         attendancedate: data?.attendancedate,
//       },
//     });
//     if (allstudent) {
//       allstudent?.map((item) => {
//         await = AttendanceStudent.update(
//           {
//             name: item?.name,
//             email: item?.email,
//             ClientCode: req.user?.ClientCode,
//             institutename: req.user?.institutename,
//             userId: req?.user?.id,
//             attendancedate: newdate,
//             attendaceStatusIntext: "Holiday",
//             Comment: comment,
//             monthNumber: newdate?.getMonth() + 1,
//             holidaytype: "manual",
//           },
//           {
//             where: {
//               ClientCode: req.user?.ClientCode,
//               attendancedate: item?.attendancedate,
//               empId: item?.empId,
//             },
//           }
//         );
//       });
//       let allatttendance = await AttendanceStudent.findAll({
//         where: {
//           ClientCode: req.user?.ClientCode,
//           institutename: req.user?.institutename,
//           // batch: data[0]?.batch,
//           attendancedate: new Date(data[0]?.Attendancedate),
//         },
//         order: [["id", "ASC"]],
//       });
//       if (allatttendance) {
//         return respHandler.success(res, {
//           status: true,
//           msg: "Holiday Update successfully!!",
//           data: allatttendance,
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

const Updateholiday = async (req, res) => {
  try {
    const { holidaydate, comment, status } = req.body;
    let newdate = new Date(holidaydate);

    var monthName = monthNames[newdate?.getMonth()];

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
              Comment: "",
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
    const { data } = req.body;

    let allstudent = await AttendanceStudent.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        attendancedate: data?.attendancedate,
      },
    });
    if (allstudent) {
      allstudent?.map((item) => {
        await = AttendanceStudent.destroy({
          where: {
            ClientCode: req.user?.ClientCode,
            attendancedate: item?.attendancedate,
            empId: item?.empId,
          },
        });
      });
      return respHandler.success(res, {
        status: true,
        msg: "Holiday Delete successfully!!",
        data: [],
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
  DoneEmployeeAttendance,
  MarkEmployeeAttendance,
  AttendanceAnalasis,
  AddHoliday,
  GetHolidays,
  Updateholiday,
  Deleteholiday,
};
