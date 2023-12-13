//add models and migrate that models
const sequelize = require("./Connect");
const admin = require("../Models/admin.model");
const parent = require("../Models/parent.model");
const Client = require("../Models/client.model");
const student = require("../Models/student.model");
const studentclass = require("../Models/studentclass.model");
const fee = require("../Models/fee.model");
const studentcategory = require("../Models/studentcategory.model");
const section = require("../Models/section.model");
const employeetype = require("../Models/employeetype.model");
const typeoforganization = require("../Models/typeorganization.model");
const Course = require("../Models/course.model");
const Employee = require("../Models/employee.model");
const Guest = require("../Models/guest.model");
const Enquiry = require("../Models/enquiry.model");
const Batch = require("../Models/batch.model");
const AttendanceStudent = require("../Models/attendance.model");
const Department = require("../Models/depart.model");
const Coursemonth = require("../Models/coursemonth.model");
const Coachingfeestatus = require("../Models/coachingfeestatus.model");
const Test = require("../Models/test.model");
const Question = require("../Models/question.model");
const Result = require("../Models/result.model");
const Ansquestion = require("../Models/ansquetion.model");
const Credential = require("../Models/Credentials.model");
const ReceiptPrefix = require("../Models/receiptprefix.model");
const ReceiptData = require("../Models/receiptdata.model");
const AttendanceEmployee = require("../Models/employeeattendance.model");
const EmployeeSalary = require("../Models/empsalary.model");
const Book = require("../Models/book.model");
const BookedBook = require("../Models/bookedbook.model");
const VehicleDetails = require("../Models/vehicledetails.mode");
const VehicleRoute = require("../Models/vehicleroute.model");
const VehicleStop = require("../Models/vehiclestop.model");
const VehicleType = require("../Models/vehicletype.model");
const RoomHostel = require("../Models/roomHostel.model");
const RoomCategory = require("../Models/roomHostel.model");
const Roomfacility = require("../Models/roomFacility.model");
const Room = require("../Models/room.model");
const SchoolFeeStatus = require("../Models/schoolfeestatus.model");
const SchoolHostelFeeStatus = require("../Models/schoolhostelfee.model");
const SchoolTransportFeeStatus = require("../Models/schooltransportfee.model");
const Empsalary = require("../Models/empsalary.model");
const Session = require("../Models/session.model");
const OtherFee = require("../Models/otherfee.model");
const Expensestype = require("../Models/expensestype.model");
const Expensesassesttype = require("../Models/expensesassettype.model");
const Expensesasset = require("../Models/expensesasset.model");
const Expenses = require("../Models/expenses.model");
const RoomCheckin = require("../Models/roomcheckin.model");
const Subject = require("../Models/Subject.model");
const ClassSubject = require("../Models/classubject.model");
const FooterDetails = require("../Models/footerdetails.model");
const Banner = require("../Models/note.model");
const Slider = require("../Models/Slider.model");
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });
