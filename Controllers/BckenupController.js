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
        attributes: [
          ["StudentName", "StudentName"],
          ["StudentNumber", "StudentName"],
          ["StudentEmail", "StudentEmail"],
          ["Address", "Address"],
          ["Course", "Course"],
          ["Comment", "Comment"],
          [literal("DATE_FORMAT(EnquiryDate, '%d/%m/%Y')"), "EnquiryDate"],
        ],
        where: {
          ClientCode: req.user?.ClientCode,
        },
      });
    }
    let bookslist = [];
    let issuedbooklist = [];
    if (Library === true) {
      bookslist = await Book.findAll({
        attributes: [
          ["BookId", "BookId"],
          ["BookTitle", "BookTitle"],
          ["auther", "Auther"],
          ["quantity", "Quantity"],
          ["Realquantity", "Books In Library"],
          ["courseorclass", "Class"],
          [literal("DATE_FORMAT(addDate, '%d/%m/%Y')"), "Add Date"],
        ],
        where: {
          ClientCode: req.user?.ClientCode,
        },
      });

      issuedbooklist = await BookedBook.findAll({
        attributes: [
          ["Session", "Session"],
          ["Section", "Section"],
          ["SrNumber", "SrNumber"],
          ["rollnumber", "rollnumber"],
          ["courseorclass", "class"],
          ["BookId", "BookId"],
          ["BookTitle", "BookTitle"],
          ["auther", "auther"],
          [literal("DATE_FORMAT(IssueDate, '%d/%m/%Y')"), "Book Issue Date"],
        ],
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
        attributes: [
          ["Session", "Session"],
          ["Section", "Section"],
          ["SrNumber", "SrNumber"],
          ["rollnumber", "rollnumber"],
          ["courseorclass", "class"],
          ["name", "name"],
          ["email", "email"],
          ["phoneno1", "phoneno1"],
          ["fathersName", "fathersName"],
          ["fathersPhoneNo", "fathersPhoneNo"],
          ["StudentCategory", "StudentCategory"],
          ["Status", "Status"],
          [literal("DATE_FORMAT(admissionDate, '%d/%m/%Y')"), "admissionDate"],
        ],
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
        attributes: [
          [
            literal("DATE_FORMAT(attendancedate, '%d/%m/%Y')"),
            "attendancedate",
          ],
          ["name", "name"],
          ["Section", "Section"],
          // ["SrNumber", "SrNumber"],
          ["rollnumber", "rollnumber"],
          ["courseorclass", "class"],
          ["name", "name"],
          ["email", "email"],
          ["MonthName", "MonthName"],
          ["attendaceStatusIntext", "Attendance Status"],
          ["holidaytype", "holiday type"],
          ["Comment", "Comment"],
        ],
        where: {
          ClientCode: req.user?.ClientCode,
        },
        order: [
          ["attendancedate", "ASC"],
          ["yeay", "ASC"],
          ["MonthNo", "ASC"],
          ["Section", "ASC"],
          ["courseorclass", "ASC"],
          ["rollnumber", "ASC"],
        ],
      });
    }

    let employeelist = [];
    let employeeAttendance = [];
    if (employee === true) {
      employeelist = await Employees?.findAll({
        attributes: [
          [literal("DATE_FORMAT(joiningdate, '%d/%m/%Y')"), "joiningdate"],
          [literal("DATE_FORMAT(resigndate	, '%d/%m/%Y')"), "resigndate	"],
          ["name", "name"],
          ["email", "email"],
          ["phoneno2", "phoneno2"],
          ["phoneno2", "phoneno2"],
          ["city", "city"],
          ["state", "state"],
          ["pincode", "pincode"],
          ["department", "department"],
          ["employeeof", "Designation"],
          ["basicsalary", "basicsalary"],
          ["Allowance1", "Allowance1"],
          ["AllowanceAmount1", "AllowanceAmount1"],
          ["Allowance2", "Allowance2"],
          ["AllowanceAmount2", "AllowanceAmount2"],
          ["Allowance3", "Allowance3"],
          ["AllowanceAmount3", "AllowanceAmount3"],
          ["Deduction1", "Deduction1"],
          ["DeductionAmount1", "DeductionAmount1"],
          ["Deduction2", "Deduction2"],
          ["DeductionAmount2", "DeductionAmount2"],
          ["TotalSalary", "TotalSalary"],
          ["AllowLeave", "AllowLeave"],
          ["FathersName", "FathersName"],
          ["AccountHolder", "AccountHolder"],
          ["AccountNumber", "AccountNumber"],
          ["BankName", "BankName"],
          ["Branch", "Branch"],
          ["IfscCode", "IfscCode"],
          ["status", "status"],
        ],
        where: {
          ClientCode: req.user?.ClientCode,
        },
        order: [["empId", "ASC"]],
      });

      employeeAttendance = await EmployeeAttendance?.findAll({
        attributes: [
          [
            literal("DATE_FORMAT(attendancedate, '%d/%m/%Y')"),
            "attendancedate",
          ],
          ["name", "name"],

          ["attendaceStatusIntext", "Attendance Status"],
          ["holidaytype", "holiday type"],
          ["Comment", "Comment"],
        ],
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
        attributes: [
          ["Session", "Session"],
          ["Section", "Section"],
          ["SNO", "SrNumber"],
          ["RollNo", "rollnumber"],
          ["studentName", "studentName"],
          ["fathername", "fathername"],
          ["PaidAmount", "PaidAmount"],
          ["ReceiptNo", "ReceiptNo"],
          ["Feetype", "Feetype"],
          ["Course", "Class"],
          ["PayOption", "Payment Mode"],
          [literal("DATE_FORMAT(PaidDate, '%d/%m/%Y')"), "PaidDate"],
        ],
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
        attributes: [
          [literal("DATE_FORMAT(Date, '%d/%m/%Y')"), "Date"],
          ["Session", "Session"],
          ["Expensestype", "Expensestype"],
          ["ExpensesAmount", "ExpensesAmount"],
          ["PayOption", "Pay Mode"],
          ["Comment", "Comment"],
        ],
        where: {
          ClientCode: req.user?.ClientCode,
        },
        order: [
          ["Date", "ASC"],
          ["Session", "ASC"],
        ],
      });
    }

    let buslist = [];
    if (transport === true) {
      buslist = await VehicleDetails?.findAll({
        attributes: [
          ["BusNumber", "BusNumber"],
          ["Vahicletype", "Vahicletype"],
          ["FualType", "FualType"],
          ["DriverId1", "DriverId1"],
          ["DriverId2", "DriverId2"],
          ["HelferId1", "HelferId1"],
          ["HelferId2", "HelferId2"],
          ["NoOfSheets", "Total Sheets"],
          ["RealSheets", "Available Sheets"],
          ["GPSDeviceURL", "GPSDeviceURL"],
        ],
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
        attributes: [
          ["HostelName", "HostelName"],
          ["DescripTion", "DescripTion"],
        ],
        where: {
          ClientCode: req.user?.ClientCode,
        },
      });

      roomlist = await Room.findAll({
        attributes: [
          ["hostelname", "hostelname"],
          ["Category", "Category"],
          ["Facility", "Facility"],
          ["FromRoom", "FromRoom"],
          ["ToRoom", "ToRoom"],
          ["PermonthFee", "Per month Fee"],
        ],
        where: {
          ClientCode: req.user?.ClientCode,
        },
      });

      checkinlist = await RoomCheckin.findAll({
        attributes: [
          ["hostelname", "hostelname"],
          ["Category", "Category"],
          ["Facility", "Facility"],
          ["RoomNo", "RoomNo"],
          ["StudentName", "StudentName"],
          ["StudentClass", "StudentClass"],
          ["Session", "Session"],
          ["Section", "Section"],
          ["SNO", "Sr Number"],
          ["MobileNO", "MobileNO"],
          [literal("DATE_FORMAT(CheckinDate, '%d/%m/%Y')"), "CheckinDate"],
        ],
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
