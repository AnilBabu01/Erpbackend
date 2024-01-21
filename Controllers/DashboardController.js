const {
  sequelize,
  QueryTypes,
  Op,
  where,
  literal,
  DATE,
} = require("sequelize");
const { config } = require("dotenv");
const respHandler = require("../Handlers");
const Book = require("../Models/book.model");
const BookedBook = require("../Models/bookedbook.model");
const Student = require("../Models/student.model");
const Employees = require("../Models/employee.model");
const Parents = require("../Models/parent.model");
const StudentAttendance = require("../Models/attendance.model");
const EmployeeAttendance = require("../Models/employeeattendance.model");
const ReceiptData = require("../Models/receiptdata.model");
const Batch = require("../Models/batch.model");
const sequelizes = require("../Helper/Connect");
config();
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
const GetSession = () => {
  const currentDate = new Date();
  const sessionStartMonth = 3;
  let sessionStartYear = currentDate.getFullYear();
  if (currentDate.getMonth() < sessionStartMonth) {
    sessionStartYear -= 1;
  }
  const sessionEndMonth = 2;
  const sessionEndYear = sessionStartYear + 1;
  const sessionStartDate = new Date(
    sessionStartYear,
    sessionStartMonth,
    1
  ).getFullYear();
  const sessionEndDate = new Date(
    sessionEndYear,
    sessionEndMonth,
    0
  ).getFullYear();

  return `${sessionStartDate}-${sessionEndDate}`;
};
const GetAllTotalData = async (req, res) => {
  try {
    let newdate = new Date();
    var monthName = monthNames[newdate?.getMonth()];
    let sessionname = GetSession()

    let whereClause = {};
    let from = new Date(newdate);
    let to = new Date(newdate);
    whereClause.PaidDate = { [Op.between]: [from, to] };
    whereClause.Session = sessionname;

    let allTodayreceiptdata = await ReceiptData.findAll({
      where: whereClause,
      order: [["PaidDate", "DESC"]],
    });

    let TotalStudent = await Student.findAll({
      attributes: ["name"],
      where: {
        ClientCode: req?.user?.ClientCode,
        [Op.or]: [
          { Status: "Unknown" },
          { Status: "On Leave" },
          { Status: "Active" },
        ],
      },
      group: ["SrNumber"],
    });

    let TotalEmployee = await Employees.findAll({
      where: {
        ClientCode: req?.user?.ClientCode,
        [Op.or]: [{ status: "Active" }, { status: "On Leave" }],
      },
    });

    let TotalParents = await Parents.count({
      where: {
        ClientCode: req?.user?.ClientCode,
      },
    });

    let allexpenses = await sequelizes.query(
      `Select Expensestype,PayOption,Comment, SUM(ExpensesAmount) AS total_paidamount FROM expenses WHERE ClientCode= '${req.user?.ClientCode}' AND Expensestype  IN ('Expenses', 'Liability')  AND Session ='${sessionname}' GROUP BY Expensestype ,PayOption;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    let allreceiptdata = await sequelizes.query(
      `Select PaidDate, Course,PayOption, SUM(PaidAmount) AS total_paidamount FROM receiptdata WHERE ClientCode= '${req.user?.ClientCode}' AND Session ='${sessionname}' GROUP BY Course ,PayOption;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    let allStudentPending = await sequelizes.query(
      `Select SUM(HostelPendingFee) AS HostelPendingFee ,SUM(TransportPendingFee) AS TransportPendingFee,SUM(pendingfee) AS pendingfee FROM students WHERE ClientCode= '${req.user?.ClientCode}' AND Session ='${sessionname}' GROUP BY Session;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    let AllStudentAttendance = await StudentAttendance.findAll({
      where: {
        ClientCode: req?.user?.ClientCode,
        attendancedate: newdate,
        MonthName: monthName,
        yeay: newdate?.getFullYear(),
        MonthNo: newdate?.getMonth() + 1,
      },
    });

    let AllEmployeeAttendance = await EmployeeAttendance.findAll({
      where: {
        ClientCode: req?.user?.ClientCode,
        attendancedate: newdate,
        MonthName: monthName,
        yeay: newdate?.getFullYear(),
        MonthNo: newdate?.getMonth() + 1,
      },
    });

    let ReceiptChartdata = await sequelizes.query(
      `Select monthno,SUM(PaidAmount) AS total  FROM receiptdata WHERE ClientCode= '${req.user?.ClientCode}' AND Session ='${sessionname}' GROUP BY monthno ORDER BY
      monthno;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    let ExpensesChartdata = await sequelizes.query(
      `Select MonthNO,SUM(ExpensesAmount) AS total  FROM expenses WHERE ClientCode= '${req.user?.ClientCode}' AND Session ='${sessionname}' GROUP BY MonthNO ORDER BY MonthNO;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    if (
      TotalEmployee &&
      TotalParents &&
      TotalStudent &&
      AllEmployeeAttendance &&
      AllStudentAttendance &&
      allexpenses &&
      allreceiptdata &&
      allStudentPending &&
      allTodayreceiptdata &&
      ReceiptChartdata &&
      ExpensesChartdata
    ) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Dashborad Total data Successfully!!",
        data: {
          TotalEmployee: TotalEmployee?.length,
          TotalParents: TotalParents,
          TotalStudent: TotalStudent?.length,
          AllEmployeeAttendance: AllEmployeeAttendance,
          AllStudentAttendance: AllStudentAttendance,
          allexpenses: allexpenses,
          allreceiptdata: allreceiptdata,
          allStudentPending: allStudentPending,
          allTodayreceiptdata: allTodayreceiptdata,
          ReceiptChartdata: ReceiptChartdata,
          ExpensesChartdata: ExpensesChartdata,
        },
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

const GetFeePaidChart = async (req, res) => {
  try {
    const { sessionname } = req.body;
  

    // let whereClause = {};
    // let from = new Date(newdate);
    // let to = new Date(newdate);
    // whereClause.PaidDate = { [Op.between]: [from, to] };

    let ReceiptChartdata = await sequelizes.query(
      `Select monthno,SUM(PaidAmount) AS total  FROM receiptdata WHERE ClientCode= '${req.user?.ClientCode}' AND Session ='${sessionname}' GROUP BY monthno;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    if (ReceiptChartdata) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Line Chart Data Successfully!!",
        data: ReceiptChartdata,
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

const GetExpensesChart = async (req, res) => {
  try {
    const { sessionname } = req.body;
    let newdate = new Date();
  

    // let whereClause = {};
    // let from = new Date(newdate);
    // let to = new Date(newdate);
    // whereClause.PaidDate = { [Op.between]: [from, to] };

    let ReceiptChartdata = await sequelizes.query(
      `Select MonthNO,SUM(ExpensesAmount) AS total  FROM expenses WHERE ClientCode= '${req.user?.ClientCode}' AND Session ='${sessionname}' GROUP BY MonthNO;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    if (ReceiptChartdata) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Line Chart Data Successfully!!",
        data: ReceiptChartdata,
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

const GetCoachingAllTotalData = async (req, res) => {
  try {
    let newdate = new Date();
    var monthName = monthNames[newdate?.getMonth()];  
    let sessionname = GetSession()

    let whereClause = {};
    let from = new Date(newdate);
    let to = new Date(newdate);
    whereClause.PaidDate = { [Op.between]: [from, to] };
    

    let allTodayreceiptdata = await ReceiptData.findAll({
      where: whereClause,
      order: [["PaidDate", "DESC"]],
    });

 

    let TotalStudent = await Student.findAll({
      attributes: ["name"],
      where: {
        ClientCode: req?.user?.ClientCode,
        [Op.or]: [
          { Status: "Unknown" },
          { Status: "On Leave" },
          { Status: "Active" },
        ],
      },
      group: ["SrNumber"],
    });

    let TotalBatch = await Batch.findAll({
      where: {
        ClientCode: req?.user?.ClientCode,
      },
    });

    let TotalEmployee = await Employees.findAll({
      where: {
        ClientCode: req?.user?.ClientCode,
        [Op.or]: [{ status: "Active" }, { status: "On Leave" }],
      },
    });

    let TotalParents = await Parents.count({
      where: {
        ClientCode: req?.user?.ClientCode,
      },
    });

    let allexpenses = await sequelizes.query(
      `Select Expensestype,PayOption,Comment, SUM(ExpensesAmount) AS total_paidamount FROM expenses WHERE ClientCode= '${req.user?.ClientCode}' AND Expensestype  IN ('Expenses', 'Liability')   GROUP BY Expensestype ,PayOption;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    let allreceiptdata = await sequelizes.query(
      `Select PaidDate, Course,PayOption, SUM(PaidAmount) AS total_paidamount FROM receiptdata WHERE ClientCode= '${req.user?.ClientCode}'  GROUP BY Course ,PayOption;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    let allStudentPending = await sequelizes.query(
      `Select SUM(HostelPendingFee) AS HostelPendingFee ,SUM(TransportPendingFee) AS TransportPendingFee,SUM(pendingfee) AS pendingfee FROM students WHERE ClientCode= '${req.user?.ClientCode}' GROUP BY courseorclass;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    let AllStudentAttendance = await StudentAttendance.findAll({
      where: {
        ClientCode: req?.user?.ClientCode,
        attendancedate: newdate,
        MonthName: monthName,
        yeay: newdate?.getFullYear(),
        MonthNo: newdate?.getMonth() + 1,
      },
    });

    let AllEmployeeAttendance = await EmployeeAttendance.findAll({
      where: {
        ClientCode: req?.user?.ClientCode,
        attendancedate: newdate,
        MonthName: monthName,
        yeay: newdate?.getFullYear(),
        MonthNo: newdate?.getMonth() + 1,
      },
    });

    let ReceiptChartdata = await sequelizes.query(
      `Select monthno,SUM(PaidAmount) AS total  FROM receiptdata WHERE ClientCode= '${req.user?.ClientCode}' GROUP BY monthno ORDER BY
      monthno;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    let ExpensesChartdata = await sequelizes.query(
      `Select MonthNO,SUM(ExpensesAmount) AS total  FROM expenses WHERE ClientCode= '${req.user?.ClientCode}' AND Session ='${sessionname}' GROUP BY MonthNO ORDER BY MonthNO;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    if (
      TotalEmployee &&
      TotalParents &&
      TotalStudent &&
      AllEmployeeAttendance &&
      AllStudentAttendance &&
      allexpenses &&
      allreceiptdata &&
      allStudentPending &&
      allTodayreceiptdata &&
      ReceiptChartdata &&
      ExpensesChartdata &&
      TotalBatch
    ) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Dashborad Total data Successfully!!",
        data: {
          TotalBatch: TotalBatch?.length,
          TotalEmployee: TotalEmployee?.length,
          TotalParents: TotalParents,
          TotalStudent: TotalStudent?.length,
          AllEmployeeAttendance: AllEmployeeAttendance,
          AllStudentAttendance: AllStudentAttendance,
          allexpenses: allexpenses,
          allreceiptdata: allreceiptdata,
          allStudentPending: allStudentPending,
          allTodayreceiptdata: allTodayreceiptdata,
          ReceiptChartdata: ReceiptChartdata,
          ExpensesChartdata: ExpensesChartdata,
        },
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

const getyearlist = async (req, res) => {
  try {
    let yearlist = await sequelizes.query(
      `Select  DISTINCT YEAR(PaidDate) AS year FROM receiptdata WHERE ClientCode= '${req.user?.ClientCode}';`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    if (yearlist) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Year List Successfully!!",
        data: yearlist,
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Not Found!!",
        error: "",
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

const getexpensesyearlist = async (req, res) => {
  try {
    let yearlist = await sequelizes.query(
      `Select  DISTINCT YEAR(Date) AS year FROM expenses WHERE ClientCode= '${req.user?.ClientCode}' GROUP BY monthno;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    if (yearlist) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Year List Successfully!!",
        data: yearlist,
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Not Found!!",
        error: "",
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

const GetCoachingFeePaidChart = async (req, res) => {
  try {
    const { sessionname } = req.body;
    let year;
    let date = new Date();
    let fullyear = date.getFullYear();
    if (sessionname) {
      year = sessionname;
    } else {
      year = fullyear;
    }

    let ReceiptChartdata = await sequelizes.query(
      `Select monthno,SUM(PaidAmount) AS total  FROM receiptdata WHERE ClientCode= '${req.user?.ClientCode}' AND YEAR(PaidDate) = '${year}' GROUP BY monthno;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    if (ReceiptChartdata) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Line Chart Data Successfully!!",
        data: ReceiptChartdata,
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
const GetCoachingExpensesChart = async (req, res) => {
  try {
    const { sessionname } = req.body;
    let year;
    let date = new Date();
    let fullyear = date.getFullYear();
    if (sessionname) {
      year = sessionname;
    } else {
      year = fullyear;
    }

    let ReceiptChartdata = await sequelizes.query(
      `Select MonthNO,SUM(ExpensesAmount) AS total  FROM expenses WHERE ClientCode= '${req.user?.ClientCode}' AND YEAR(Date) = '${year}' GROUP BY MonthNO;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    if (ReceiptChartdata) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Line Chart Data Successfully!!",
        data: ReceiptChartdata,
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

module.exports = {
  GetAllTotalData,
  GetFeePaidChart,
  GetExpensesChart,
  GetCoachingAllTotalData,
  getyearlist,
  getexpensesyearlist,
  GetCoachingExpensesChart,
  GetCoachingFeePaidChart,
};
