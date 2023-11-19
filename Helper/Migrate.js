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
const Test = require('../Models/test.model');
const Question = require("../Models/question.model");
const Result = require("../Models/result.model");
const Ansquestion = require("../Models/ansquetion.model");
const Credential = require('../Models/Credentials.model');
const ReceiptPrefix = require('../Models/receiptprefix.model');
const ReceiptData = require('../Models/receiptdata.model');
const AttendanceEmployee = require('../Models/employeeattendance.model');
const EmployeeSalary = require('../Models/empsalary.model');
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });
