const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
var moment = require("moment");
const sequelizes = require("../Helper/Connect");
const { config } = require("dotenv");
const Student = require("../Models/employee.model");
const AttendanceStudent = require("../Models/employeeattendance.model");
const Batch = require("../Models/batch.model");
const respHandler = require("../Handlers");
const { monthdays } = require("../Helper/Constant");
config();

const MarkEmployeeAttendance = async (req, res) => {
  try {
    const { Attendancedate, emp } = req.body;
    let newdate = new Date(Attendancedate);

    let checkattendance = await AttendanceStudent.findAll({
      where: {
        // empId: emp,
        attendancedate: newdate,
        ClientCode: req.user?.ClientCode,
        // institutename: req.user?.institutename,
        // attendaceStatusIntext: "Absent",
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
      if (emp) {
        students = await Student.findAll({
          where: {
            ClientCode: req.user?.ClientCode,
            id: emp,
            [Op.or]: [{ status: "On Leave" }, { status: "Active" }],
          },
          order: [["id", "ASC"]],
        });
      } else {
        students = await Student.findAll({
          where: {
            ClientCode: req.user?.ClientCode,
            [Op.or]: [{ status: "On Leave" }, { status: "Active" }],
          },
          order: [["id", "ASC"]],
        });
      }

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
          attendancedate: newdate,
          attendaceStatusIntext:
            item?.status === "Active" ? "Absent" : item?.status,
          monthNumber: newdate?.getMonth() + 1,
        });

        return result;
      });

      if (await Promise.all(promises)) {
        let checkattendance = await AttendanceStudent.findAll({
          where: {
            // batch: batch,
            attendancedate: newdate,
            ClientCode: req.user?.ClientCode,
            // institutename: req.user?.institutename,
            attendaceStatusIntext: "Absent",
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

const DoneEmployeeAttendance = async (req, res) => {
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
            institutename: req.user?.institutename,
            // courseorclass: item?.courseorclass,
            // batch: item?.batch,
            // rollnumber: item?.rollnumber,
            attendancedate: item?.attendancedate,
          },
        }
      );
    });
    let allatttendance = await AttendanceStudent.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
        // batch: data[0]?.batch,
        attendancedate: new Date(data[0]?.attendancedate),
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
    const { month } = req.body;
    let days = monthdays[month];
    let Students = await Student.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        [Op.or]: [{ Status: "On Leave" }, { Status: "Active" }],
      },
    });

    let result = [];
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
  DoneEmployeeAttendance,
  MarkEmployeeAttendance,
  AttendanceAnalasis,
  AddHoliday,
  GetHolidays,
  Updateholiday,
  Deleteholiday,
};
