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
const ReceiptData = require("../Models/receiptdata.model");
const Batch = require("../Models/batch.model");
const Enquiry = require("../Models/enquiry.model");
const StudentAttendance = require("../Models/attendance.model");
const EmployeeAttendance = require("../Models/employeeattendance.model");
const Expenses = require("../Models/expenses.model");
const VehicleType = require("../Models/vehicletype.model");
const VehicleRoute = require("../Models/vehicleroute.model");
const VehicleStop = require("../Models/vehiclestop.model");
const VehicleDetails = require("../Models/vehicledetails.mode");
const RoomCategory = require("../Models/roomcategory.model");
const Facility = require("../Models/roomfacility.model");
const RoomHostel = require("../Models/roomhostel.model");
const Room = require("../Models/room.model");
const Employee = require("../Models/employee.model");
const RoomCheckin = require("../Models/roomcheckin.model");
const removefile = require("../Middleware/removefile");
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

const GetAllbackdataData = async (req, res) => {
  try {
    const {
      frontoffice,
      Library,
      student,
      employee,
      hostel,
      transport,
      expenses,
      accounts,
    } = req.body;
    let newdate = new Date();
    var monthName = monthNames[newdate?.getMonth()];
    let date = new Date();
    let fullyear = date.getFullYear();
    let lastyear = date.getFullYear() - 1;
    let sessionname = `${lastyear}-${fullyear}`;

    let whereClause = {};
    let from = new Date(newdate);
    let to = new Date(newdate);
    whereClause.PaidDate = { [Op.between]: [from, to] };
    whereClause.Session = sessionname;

    let enquirys = [];
    if (frontoffice === true) {
      enquirys = await Enquiry.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
      });
    }
    let bookslist = [];
    let issuedbooklist = [];
    if (Library === true) {
      bookslist = await Book.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
      });

      issuedbooklist = await BookedBook.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
          issueStatus: 1,
        },
        order: [
          ["Session", "ASC"],
          ["Section", "ASC"],
          ["SrNumber", "ASC"],
        ],
      });
    }

    let studentlist = [];
    let studentAttendance = [];
    if (student === true) {
      studentlist = await Student?.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
        order: [
          ["Session", "ASC"],
          ["Section", "ASC"],
          // ["rollnumber", "ASC"],
          ["courseorclass", "ASC"],
        ],
      });

      studentAttendance = await StudentAttendance?.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
        order: [
          ["attendancedate", "ASC"],
          ["yeay", "ASC"],
          ["MonthNo", "ASC"],
          ["Section", "ASC"],
          ["courseorclass", "ASC"],
        ],
      });
    }

    let employeelist = [];
    let employeeAttendance = [];
    if (employee === true) {
      employeelist = await Employees?.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
        order: [["empId", "ASC"]],
      });

      employeeAttendance = await EmployeeAttendance?.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
        order: [
          ["attendancedate", "ASC"],
          ["yeay", "ASC"],
          ["MonthNo", "ASC"],
        ],
      });
    }

    let paidfee = [];
    let pedningfee = [];
    let allreceiptdata = [];
    if (accounts === true) {
      paidfee = await Student?.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
        attributes: [
          "name",
          "Session",
          "Section",
          "courseorclass",
          "paidfee",
          "HostelPaidFee",
          "TransportPaidFee",
          "SrNumber",
        ],
        order: [
          ["Session", "ASC"],
          ["Section", "ASC"],
          // ["rollnumber", "ASC"],
          ["courseorclass", "ASC"],
        ],
      });

      pedningfee = await Student?.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
        attributes: [
          "name",
          "Session",
          "Section",
          "courseorclass",
          "pendingfee",
          "HostelPendingFee",
          "TransportPendingFee",
          "SrNumber",
        ],
        order: [
          ["Session", "ASC"],
          ["Section", "ASC"],
          // ["rollnumber", "ASC"],
          ["courseorclass", "ASC"],
        ],
      });

      allreceiptdata = await ReceiptData.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
        order: [
          ["SNO", "ASC"],
          ["Session", "ASC"],
          ["Section", "ASC"],
          ["Course", "ASC"],
        ],
      });
    }

    let expenseslist = [];
    if (expenses === true) {
      expenseslist = await Expenses?.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },   
        order: [["Date", "ASC"],["Session", "ASC"]],
      });
    }

    let buslist = [];
    if (transport === true) {
      buslist = await VehicleDetails?.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
      });
    }

    let hostelist = [];
    let roomlist = [];
    let checkinlist = [];
    if (hostel === true) {
      hostelist = await RoomHostel.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
      });

      roomlist = await Room.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
      });

      checkinlist = await RoomCheckin.findAll({
        where: {
          ClientCode: req.user?.ClientCode,
        },
      });
    }

    if (
      enquirys &&
      studentlist &&
      bookslist &&
      issuedbooklist &&
      studentAttendance &&
      employeelist &&
      employeeAttendance &&
      pedningfee &&
      paidfee &&
      allreceiptdata &&
      expenseslist &&
      buslist &&
      checkinlist &&
      hostelist &&
      roomlist
    ) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Dashborad Total data Successfully!!",
        data: {
          enquirys: enquirys,
          bookslist: bookslist,
          issuedbooklist: issuedbooklist,
          studentlist: studentlist,
          studentAttendance: studentAttendance,
          employeelist: employeelist,
          employeeAttendance: employeeAttendance,
          paidfee: paidfee,
          pedningfee: pedningfee,
          allreceiptdata: allreceiptdata,
          expenseslist: expenseslist,
          buslist: buslist,
          checkinlist: checkinlist,
          hostelist: hostelist,
          roomlist: roomlist,
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

module.exports = {
  GetAllbackdataData,
};
