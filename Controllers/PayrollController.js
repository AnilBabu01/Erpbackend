const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
var moment = require("moment");
const sequelizes = require("../Helper/Connect");
const { config } = require("dotenv");
const Employee = require("../Models/employee.model");
const Empsalary = require("../Models/empsalary.model");
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
      let month = endDate.getMonth();
      var monthName = monthNames[month];
      var year = endDate.getFullYear();
      let salary = await Empsalary.findOne({
        where: {
          MonthName: monthName,
          Year: year,
          EmpId: employee.id,
        },
      });
      if (salary) {
        let allmonth = await Empsalary.findAll({
          where: {
            EmpId: employee.id,
          },
        });
        if (allmonth) {
          let result = [];
          const promises = allmonth?.map(async (item) => {
            let days = monthdays[item?.MonthNo+1];

            let checkattendance = await sequelizes.query(
              `Select * FROM employeeattendances WHERE ClientCode= '${
                req.user?.ClientCode
              }' AND MonthNo ='${item?.MonthNo + 1}' AND empId = '${
                item?.EmpId
              }'  AND yeay ='${item?.Year}' AND MonthName ='${item?.MonthName}'
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
      } else {
        const result = getMonthNamesWithYear(startDate, endDate);
        const promises = result?.map(async (item) => {
          var words = item.split(/\s+/);
          var firstWord = words[0];
          var lastWord = words[words.length - 1];
          var secondWord = words.length > 1 ? words[1] : null;

          await Empsalary.create({
            ClientCode: req.user?.ClientCode,
            EmpId: employee?.id,
            OrEmpId: employee?.empId,
            name: employee?.name,
            email: employee?.email,
            MonthName: firstWord,
            Year: secondWord,
            MonthNo: lastWord,
            Allowance: employee?.Allowance,
            BasicSlary: employee?.basicsalary,
            Deduction: employee?.Deduction,
            TotalSalary: employee?.TotalSalary,
          });
        });

        if (await Promise.all(promises)) {
          let allmonth = await Empsalary.findAll({
            where: {
              EmpId: employee.id,
            },
          });
          if (allmonth) {
            let result = [];
            const promises = allmonth?.map(async (item) => {
              let days = monthdays[item?.MonthNo+1];
              let checkattendance = await sequelizes.query(
                `Select * FROM employeeattendances WHERE ClientCode= '${
                  req.user?.ClientCode
                }' AND MonthNo ='${item?.MonthNo + 1}' AND empId = '${
                  item?.EmpId
                }'  AND yeay ='${item?.Year}' AND MonthName ='${
                  item?.MonthName
                }'
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
  GetPayMonthList,
};
