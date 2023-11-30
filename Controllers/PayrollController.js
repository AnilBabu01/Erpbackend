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
      const results = getMonthNamesWithYear(startDate, endDate);

      let result = [];
      const promises = results?.map(async (item, index) => {
        var words = item.split(/\s+/);
        var monthName = words[0];
        var MonthNo = words[words.length - 1];
        var year = words.length > 1 ? words[1] : null;

        let days = monthdays[index + 1];
        let checkattendance = await sequelizes.query(
          `Select * FROM employeeattendances WHERE ClientCode= '${
            req.user?.ClientCode
          }' AND MonthNo ='${
            index + 1
          }' AND empId = '${empid}'  AND yeay ='${year}' AND MonthName ='${monthName}'
            ;`,
          {
            nest: true,
            type: QueryTypes.SELECT,
            raw: true,
          }
        );

        if (checkattendance) {
          result.push({
            monthdetials: employee,
            attendance: checkattendance,
            days: days,
            monthName:monthName,
            year:year

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

module.exports = {
  GetPayMonthList,
};
