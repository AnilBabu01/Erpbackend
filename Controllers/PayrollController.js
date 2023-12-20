const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
var moment = require("moment");
const sequelizes = require("../Helper/Connect");
const { config } = require("dotenv");
const Employee = require("../Models/employee.model");
const Empsalary = require("../Models/empsalary.model");
const employeeattendances = require("../Models/employeeattendance.model")
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
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function getMonthNamesWithYear(startDate, endDate) {
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);
  const monthNamesWithYear = [];

  while (currentDate <= endDateObj) {
    const monthName = new Intl.DateTimeFormat("en", { month: "long" }).format(
      currentDate
    );
    const year = currentDate.getFullYear();
    const monthno = currentDate.getMonth();
    const monthWithYear = `${monthName} ${year} ${monthno}`;
    monthNamesWithYear.push(monthWithYear);

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return monthNamesWithYear;
}

const GetPayMonthList = async (req, res) => {
  try {
    const { empid } = req.body;
    let employee = await Employee.findOne({
      where: {
        id: empid,
      },
    });

    if (employee) {
      const startDate = new Date(employee?.joiningdate);
      const endDate = new Date();
      const results = getMonthNamesWithYear(startDate, endDate);

      let result = [];
      const promises = results?.map(async (item, index) => {
        var words = item.split(/\s+/);
        var monthName = words[0];
        var MonthNo = words[words.length - 1];
        var year = words.length > 1 ? words[1] : null;

        let days = monthdays[index + 1];

        // let checkattendance = await sequelizes.query(
        //   `Select * FROM employeeattendances WHERE ClientCode= '${
        //     req.user?.ClientCode
        //   }' AND MonthNo ='${
        //     index + 1
        //   }' AND empId = '${empid}'  AND yeay ='${year}' AND MonthName ='${monthName}'
        //     ;`,
        //   {
        //     nest: true,
        //     type: QueryTypes.SELECT,
        //     raw: true,
        //   }
        // );

        let checkattendance = await employeeattendances.findAll({
          where: {
            // batch: batchname,
            empId: empid,
            ClientCode: req.user?.ClientCode,
            MonthName: monthName,
            yeay: year,
            MonthNo: Number(MonthNo) + 1,
          },
        });

        let isSalary = await Empsalary.findOne({
          where: {
            EmpId: employee?.id,
            MonthName: monthName,
            Year: year,
            MonthNo: index + 1,
            ClientCode: req.user?.ClientCode,
          },
        });

        if (checkattendance) {
          result.push({
            monthdetials: employee,
            attendance: checkattendance,
            days: days,
            MonthName: monthName,
            Year: year,
            MonthNo: index + 1,
            paidStatus: isSalary ? true : false,
          });
        }
      });
      if (await Promise.all(promises)) {
        return respHandler.success(res, {
          status: true,
          msg: "Fetch All Month Details!!",
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

const PaySalary = async (req, res) => {
  try {
    const { empid, paidAmount, allDetails, sessionname } = req.body;
    let employee = await Employee.findOne({
      where: {
        id: empid,
        ClientCode: req.user?.ClientCode,
      },
    });

    if (employee) {
      let EmpMonthSalary = await Empsalary.create({
        ClientCode: req.user?.ClientCode,
        EmpId: employee?.id,
        OrEmpId: employee?.empId,
        name: employee?.name,
        department: employee?.department,
        employeeof: employee?.employeeof,
        email: employee?.email,
        MonthName: allDetails?.MonthName,
        Year: allDetails?.Year,
        MonthNo: allDetails?.MonthNo,
        basicsalary: employee?.basicsalary,
        TotalSalary: employee?.TotalSalary,
        Allowance1: employee?.Allowance1,
        AllowanceAmount1: employee?.AllowanceAmount1,
        Allowance2: employee?.Allowance2,
        AllowanceAmount2: employee?.AllowanceAmount2,
        Allowance3: employee?.Allowance3,
        AllowanceAmount3: employee?.AllowanceAmount3,
        Deduction1: employee?.Deduction1,
        DeductionAmount1: employee?.DeductionAmount1,
        Deduction2: employee?.Deduction2,
        DeductionAmount2: employee?.DeductionAmount2,
        AllowLeave: employee?.AllowLeave,
        PaidAmount: paidAmount,
        SalaryPaid: true,
        Session: sessionname,
      });

      if (EmpMonthSalary) {
        return respHandler.success(res, {
          status: true,
          msg: "Paid Salary SuccessFully!!",
          data: EmpMonthSalary,
        });
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Something Went Wrong!!",
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

const GetEmpSalaryList = async (req, res) => {
  try {
    const { empid, empname, sessionname, fromdate, todate } = req.query;
    console.log("console data is ", req.query);
    let whereClause = {};
    let result = [];
    let from = new Date(fromdate);
    let to = new Date(todate);
    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }

    if (empid) {
      whereClause.OrEmpId = { [Op.regexp]: `^${empid}.*` };
    }
    if (fromdate && todate) {
      whereClause.PaidDate = { [Op.between]: [from, to] };
    }
    if (empname) {
      whereClause.name = { [Op.regexp]: `^${empname}.*` };
    }
    if (sessionname) {
      whereClause.Session = { [Op.regexp]: `^${sessionname}.*` };
    }
    let roomCategory = await Empsalary.findAll({
      where: whereClause,
    });
    if (roomCategory) {
      const promises = roomCategory?.map(async (item) => {
        let days = monthdays[Number(item?.MonthNo)];
        let checkattendance = await sequelizes.query(
          `Select * FROM employeeattendances WHERE ClientCode= '${req.user?.ClientCode}' AND MonthNo ='${item?.MonthNo}' AND empId = '${item?.EmpId}'  AND yeay ='${item?.Year}' AND MonthName ='${item?.MonthName}'
            ;`,
          {
            nest: true,
            type: QueryTypes.SELECT,
            raw: true,
          }
        );

        if (checkattendance) {
          result.push({
            monthdetials: item,
            attendance: checkattendance,
            days: days,
            MonthName: item?.MonthName,
            Year: item?.Year,
            MonthNo: item?.MonthNo,
            paidStatus: "",
          });
        }
      });
      if (await Promise.all(promises)) {
        return respHandler.success(res, {
          status: true,
          msg: "Fetch Employee Salary Ssuccessfully!!",
          data: result,
        });
      }
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

module.exports = {
  GetPayMonthList,
  PaySalary,
  GetEmpSalaryList,
};
