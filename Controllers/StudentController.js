const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const Student = require("../Models/student.model");
const Parent = require("../Models/parent.model");
const Coachingfeestatus = require("../Models/coachingfeestatus.model");
const SchoolFeeStatus = require("../Models/schoolfeestatus.model");
const SchoolHostelFeeStatus = require("../Models/schoolhostelfee.model");
const SchoolTransportFeeStatus = require("../Models/schooltransportfee.model");
const ReceiptData = require("../Models/receiptdata.model");
const ReceiptPrefix = require("../Models/receiptprefix.model");
const Fee = require("../Models/fee.model");
const OtherFee = require("../Models/otherfee.model");
const VehicleDetails = require("../Models/vehicledetails.mode");
const AttendanceStudent = require("../Models/attendance.model");
const { monthdays } = require("../Helper/Constant");
const { Coachingfeemon } = require("../Helper/Constant");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
var moment = require("moment");
const {
  uploadfileonfirebase,
  deletefilefromfirebase,
} = require("../Middleware/uploadanddeletefromfirebase");

config();

const SECRET = process.env.SECRET;
//admin

const GetSession = () => {
  const currentDate = new Date();
  const sessionStartMonth = 3;
  let sessionStartYear = currentDate.getFullYear();
  if (currentDate.getMonth() < sessionStartMonth) {
    sessionStartYear -= 1;
  }
  const sessionEndMonth = 3;
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
const MonthanameArray = {
  1: "April",
  2: "May",
  3: "June",
  4: "July",
  5: "August",
  6: "September",
  7: "October",
  8: "November",
  9: "December",
  10: "January",
  11: "February",
  12: "March",
};
function printMonthAndYear() {
  const months = [
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

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  let result = [];

  for (let i = 3; i <= 14; i++) {
    const monthIndex = i % 12;
    const year = currentYear + Math.floor(i / 12);
    const monthYear = `${months[monthIndex]} ${year}`;
    result.push(monthYear);
  }

  return result;
}

const Addstudent = async (req, res) => {
  try {
    let newdate = new Date();
    var monthName = monthNames[newdate?.getMonth()];
    let session = GetSession();
    let days = monthdays[newdate?.getMonth() + 1];
    const {
      name,
      userType,
      email,
      phoneno1,
      phoneno2,
      address,
      city,
      state,
      pincode,
      fathersPhoneNo,
      fathersName,
      MathersName,
      rollnumber,
      admissionDate,
      StudentStatus,
      courseorclass,
      courseduration,
      studentTotalFee,
      permonthfee,
      adharno,
      pancardnno,
      batch,
      regisgrationfee,
      markSheetname,
      othersdocName,
      Status,
      Transport,
      Library,
      hostal,
      StudentCategory,
      HostelPerMonthFee,
      TotalHostelFee,
      TransportPerMonthFee,
      TransportTotalHostelFee,
      AnnualFee,
      Session,
      Section,
      whatsappNo,
      SrNumber,
      hostelname,
      Category,
      Facility,
      FromRoute,
      ToRoute,
      BusNumber,
      DateOfBirth,
      stream,
    } = req.body;

    const genSalt = 10;
    const hash = await bcrypt.hash(req?.user?.Studentpassword, genSalt);
    let profileimg;
    let adharimg;
    let birthdocimg;
    let otherimg;
    let marksheetimg;
    let parent = await Parent.findOne({
      where: {
        phoneno1: fathersPhoneNo,
        name: fathersName,
        ClientCode: req.user?.ClientCode,
      },
    });

    if (parent) {
      if (
        req.file != "" ||
        name != "" ||
        email != "" ||
        password != "" ||
        phoneno1 != "" ||
        phoneno2 != "" ||
        address != "" ||
        city != "" ||
        state != "" ||
        pincode != "" ||
        userType != ""
      ) {
        let checkrollno = await Student.findOne({
          where: {
            courseorclass: courseorclass,
            rollnumber: rollnumber,
            Session: Session,
            Section: Section,
            ClientCode: req.user?.ClientCode,
          },
        });

        if (checkrollno != null) {
          return respHandler.error(res, {
            status: false,
            msg: "Roll No Already Exist!!",
          });
        }

        let checkSno = await Student.findOne({
          where: {
            SrNumber: SrNumber,
            ClientCode: req.user?.ClientCode,
          },
        });
        if (checkSno != null) {
          return respHandler.error(res, {
            status: false,
            msg: "Sr NO Already Exist!!",
          });
        }

        let user = await Student.findOne({
          where: {
            courseorclass: courseorclass,
            rollnumber: rollnumber,
            Session: Session,
            Section: Section,
            ClientCode: req.user?.ClientCode,
          },
        });

        if (user != null) {
          return respHandler.error(res, {
            status: false,
            msg: "Student already exist",
          });
        }
        if (req?.files?.profileurl) {
          profileimg = await uploadfileonfirebase(
            req?.files?.profileurl,
            `student-profile-${SrNumber}-${req.user?.ClientCode}`
          );
        }

        if (req?.files?.adharcard) {
          adharimg = await uploadfileonfirebase(
            req?.files?.adharcard,
            `student-adharcard-${SrNumber}-${req.user?.ClientCode}`
          );
        }

        if (req?.files?.BirthDocument) {
          birthdocimg = await uploadfileonfirebase(
            req?.files?.BirthDocument,
            `student-BirthDocument-${SrNumber}-${req.user?.ClientCode}`
          );
        }

        if (req?.files?.othersdoc) {
          otherimg = await uploadfileonfirebase(
            req?.files?.othersdoc,
            `student-othersdoc-${SrNumber}-${req.user?.ClientCode}`
          );
        }

        if (req?.files?.markSheet) {
          marksheetimg = await uploadfileonfirebase(
            req?.files?.markSheet,
            `student-markSheet-${SrNumber}-${req.user?.ClientCode}`
          );
        }

        let newUser = {
          name: name,
          email: email,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          typeoforganization:
            req.user?.userType === "employee"
              ? req.user?.institutename
              : req.user?.userType,
          logourl: req?.user?.logourl,
          phoneno1: phoneno1,
          phoneno2: phoneno2,
          address: address,
          parentId: parent.id,
          fathersPhoneNo: parent?.phoneno1,
          fathersName: parent?.name,
          MathersName: MathersName,
          city: city,
          state: state,
          pincode: pincode,
          password: hash,
          courseorclass: courseorclass,
          studentTotalFee: studentTotalFee,
          pendingfee: studentTotalFee,
          courseduration: courseduration,
          adharno: adharno,
          pancardnno: pancardnno,
          batch: batch,
          regisgrationfee: regisgrationfee,
          permonthfee: permonthfee,
          admissionDate: admissionDate,
          rollnumber: rollnumber,
          StudentStatus: StudentStatus,
          markSheetname: markSheetname,
          othersdocName: othersdocName,
          Status: Status,
          StudentCategory: StudentCategory,
          Transport: Transport,
          Library: Library,
          hostal: hostal,
          FromRoute: "",
          ToRoute: "",
          BusNumber: "",
          HostelPerMonthFee: HostelPerMonthFee,
          TotalHostelFee: TotalHostelFee,
          TransportPerMonthFee: TransportPerMonthFee,
          TransportTotalHostelFee: TransportTotalHostelFee,
          HostelPendingFee: TotalHostelFee,
          TransportPendingFee: TransportTotalHostelFee,
          AnnualFee: AnnualFee,
          Section: Section,
          Session: Session,
          SrNumber: SrNumber,
          whatsappNo: whatsappNo,
          hostelname: hostelname,
          Category: Category,
          Facility: Facility,
          DateOfBirth: DateOfBirth,
          Stream: stream,
          profileurl: req?.files?.profileurl ? profileimg : "",
          adharcard: req?.files?.adharcard ? adharimg : "",
          markSheet: req?.files?.markSheet ? marksheetimg : "",
          othersdoc: req?.files?.othersdoc ? otherimg : "",
          BirthDocument: req?.files?.BirthDocument ? birthdocimg : "",
        };

        let CreatedStudent = await Student.create(newUser);
        let fee;
        if (req.user?.userType === "institute") {
          let data = {
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            studentId: CreatedStudent?.id,
          };

          fee = await Coachingfeestatus.create(data);
          var token = jwt.sign(
            {
              id: CreatedStudent.id,
              userType: CreatedStudent.userType,
            },
            SECRET
          );

          if (token) {
            const promises = days?.map(async (date) => {
              let result = await AttendanceStudent.create({
                name: CreatedStudent?.name,
                email: CreatedStudent?.email,
                ClientCode: req.user?.ClientCode,
                // institutename: req.user?.institutename,
                // userId: req?.user?.id,
                address: CreatedStudent?.address,
                parentId: CreatedStudent?.parentId,
                studentid: CreatedStudent?.id,
                courseorclass: CreatedStudent?.courseorclass,
                batch: CreatedStudent?.batch,
                rollnumber: CreatedStudent?.rollnumber,
                fathersPhoneNo: CreatedStudent?.fathersPhoneNo,
                fathersName: CreatedStudent?.fathersName,
                MathersName: CreatedStudent?.MathersName,
                rollnumber: CreatedStudent?.rollnumber,
                MonthName: monthName,
                yeay: newdate?.getFullYear(),
                MonthNo: newdate?.getMonth() + 1,
                attendancedate: `${newdate?.getFullYear()}-${
                  newdate?.getMonth() + 1
                }-${date}`,
                attendaceStatusIntext: "Absent",

                monthNumber: newdate?.getMonth() + 1,
              });

              return result;
            });
            if (await Promise.all(promises)) {
              return respHandler.success(res, {
                status: true,
                data: [{ token: token, user: CreatedStudent, fee: fee }],
                msg: "Student Added Successfully!!",
              });
            }
          }
        }
        if (req.user?.userType === "school") {
          let monthnameAndYaer = printMonthAndYear();
          let feemonth = await Fee.findOne({
            where: {
              coursename: courseorclass,
              ClientCode: req.user?.ClientCode,
            },
          });
          if (feemonth) {
            let otherfee = await OtherFee.findAll({
              where: {
                Course: courseorclass,
                Session: Session,
                Section: Section,
                ClientCode: req?.user?.ClientCode,
              },
            });
            if (otherfee) {
              otherfee?.map(async (item, index) => {
                await OtherFee.create({
                  ClientCode: req?.user?.ClientCode,
                  studentName: CreatedStudent?.name,
                  fathername: CreatedStudent?.fathersName,
                  Course: CreatedStudent?.courseorclass,
                  fathersid: CreatedStudent?.parentId,
                  studentid: CreatedStudent?.id,
                  batchname: CreatedStudent?.batch,
                  SNO: CreatedStudent?.SrNumber,
                  Session: item?.Session,
                  Section: CreatedStudent?.Section,
                  OtherFeeName: item?.OtherFeeName,
                  FeeAmount: item?.FeeAmount,
                  DuesDate: item?.DuesDate,
                });
              });
            }
            const promises1 = monthnameAndYaer?.map(async (item, index) => {
              var words = item.split(/\s+/);
              var firstWord = words[0];
              var lastWord = words[words.length - 1];
              console.log(firstWord, lastWord);
              let result = await SchoolFeeStatus.create({
                ClientCode: req.user?.ClientCode,
                studentId: CreatedStudent?.id,
                MonthName: MonthanameArray[index + 1],
                Year: lastWord,
                PerMonthFee: CreatedStudent?.permonthfee,
                Session: Session,
                SrNumber: SrNumber,
              });
              firstWord = "";
              lastWord = "";
              return result;
            });

            const promises2 = monthnameAndYaer?.map(async (item, index) => {
              var words = item.split(/\s+/);
              var firstWord = words[0];
              var lastWord = words[words.length - 1];
              console.log(firstWord, lastWord);

              let result = await SchoolHostelFeeStatus.create({
                ClientCode: req.user?.ClientCode,
                studentId: CreatedStudent?.id,
                MonthName: MonthanameArray[index + 1],
                Year: lastWord,
                PerMonthFee: CreatedStudent?.HostelPerMonthFee,
                Session: Session,
                SrNumber: SrNumber,
              });
              firstWord = "";
              lastWord = "";
              return result;
            });

            const promises3 = monthnameAndYaer?.map(async (item, index) => {
              var words = item.split(/\s+/);
              var firstWord = words[0];
              var lastWord = words[words.length - 1];
              console.log(firstWord, lastWord);

              let result = await SchoolTransportFeeStatus.create({
                ClientCode: req.user?.ClientCode,
                studentId: CreatedStudent?.id,
                MonthName: MonthanameArray[index + 1],
                Year: lastWord,
                PerMonthFee: CreatedStudent?.TransportPerMonthFee,
                Session: Session,
                SrNumber: SrNumber,
              });
              firstWord = "";
              lastWord = "";
              return result;
            });

            if (
              (await Promise.all(promises1)) &&
              (await Promise.all(promises2)) &&
              (await Promise.all(promises3))
            ) {
              let fee = SchoolFeeStatus.findAll({
                where: {
                  ClientCode: req.user?.ClientCode,
                  studentId: CreatedStudent?.id,
                },
              });
              var token = jwt.sign(
                {
                  id: CreatedStudent.id,
                  userType: CreatedStudent.userType,
                },
                SECRET
              );

              if (token) {
                const promises = days?.map(async (date) => {
                  let result = await AttendanceStudent.create({
                    name: CreatedStudent?.name,
                    email: CreatedStudent?.email,
                    ClientCode: req.user?.ClientCode,
                    address: CreatedStudent?.address,
                    parentId: CreatedStudent?.parentId,
                    studentid: CreatedStudent?.id,
                    Section: Session,
                    courseorclass: CreatedStudent?.courseorclass,
                    batch: CreatedStudent?.courseorclass,
                    rollnumber: CreatedStudent?.rollnumber,
                    fathersPhoneNo: CreatedStudent?.fathersPhoneNo,
                    fathersName: CreatedStudent?.fathersName,
                    MathersName: CreatedStudent?.MathersName,
                    rollnumber: CreatedStudent?.rollnumber,
                    MonthName: monthName,
                    yeay: newdate?.getFullYear(),
                    MonthNo: newdate?.getMonth() + 1,
                    attendancedate: `${newdate?.getFullYear()}-${
                      newdate?.getMonth() + 1
                    }-${date}`,
                    attendaceStatusIntext: "Absent",

                    monthNumber: newdate?.getMonth() + 1,
                  });

                  return result;
                });
                if (await Promise.all(promises)) {
                  return respHandler.success(res, {
                    status: true,
                    data: [{ token: token, user: CreatedStudent, fee: fee }],
                    msg: "Student Added Successfully!!",
                  });
                }
              }
            }
          }
        }
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "All fields are required!!",
        });
      }
    } else {
      const genSalt = 10;
      const hash1 = await bcrypt.hash(req?.user?.Parentpassword, genSalt);
      let newParent = {
        name: fathersName,
        ClientCode: req.user?.ClientCode,
        phoneno1: fathersPhoneNo,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        password: hash1,
        whatsaapNo: whatsappNo,
      };

      let createdParent = await Parent.create(newParent);

      if (createdParent) {
        if (req?.files?.profileurl) {
          profileimg = await uploadfileonfirebase(
            req?.files?.profileurl,
            `student-profile-${SrNumber}-${req.user?.ClientCode}`
          );
        }

        if (req?.files?.adharcard) {
          adharimg = await uploadfileonfirebase(
            req?.files?.adharcard,
            `student-adharcard-${SrNumber}-${req.user?.ClientCode}`
          );
        }

        if (req?.files?.BirthDocument) {
          birthdocimg = await uploadfileonfirebase(
            req?.files?.BirthDocument,
            `student-BirthDocument-${SrNumber}-${req.user?.ClientCode}`
          );
        }

        if (req?.files?.othersdoc) {
          otherimg = await uploadfileonfirebase(
            req?.files?.othersdoc,
            `student-othersdoc-${SrNumber}-${req.user?.ClientCode}`
          );
        }

        if (req?.files?.markSheet) {
          marksheetimg = await uploadfileonfirebase(
            req?.files?.markSheet,
            `student-markSheet-${SrNumber}-${req.user?.ClientCode}`
          );
        }
        let newUser = {
          name: name,
          email: email,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          typeoforganization:
            req.user?.userType === "employee"
              ? req.user?.institutename
              : req.user?.userType,
          logourl: req.user.logourl,
          phoneno1: phoneno1,
          phoneno2: phoneno2,
          address: address,
          city: city,
          state: state,
          pincode: pincode,
          password: hash,
          parentId: createdParent.id,
          fathersPhoneNo: createdParent?.phoneno1,
          fathersName: createdParent?.name,
          MathersName: MathersName,
          rollnumber: rollnumber,
          regisgrationfee: regisgrationfee,
          pendingfee: studentTotalFee,
          StudentStatus: StudentStatus,
          courseorclass: courseorclass,
          courseduration: courseduration,
          studentTotalFee: studentTotalFee,
          permonthfee: permonthfee,
          adharno: adharno,
          pancardnno: pancardnno,
          batch: batch,
          admissionDate: admissionDate,
          markSheetname: markSheetname,
          othersdocName: othersdocName,
          Status: Status,
          StudentCategory: StudentCategory,
          Transport: Transport,
          Library: Library,
          hostal: hostal,
          AnnualFee: AnnualFee,
          Session: Session,
          Section: Section,
          hostelname: hostelname,
          Category: Category,
          Facility: Facility,
          SrNumber: SrNumber,
          FromRoute: "",
          ToRoute: "",
          BusNumber: "",
          whatsappNo: whatsappNo,
          HostelPerMonthFee: HostelPerMonthFee,
          TotalHostelFee: TotalHostelFee,
          TransportPerMonthFee: TransportPerMonthFee,
          TransportTotalHostelFee: TransportTotalHostelFee,
          HostelPendingFee: TotalHostelFee,
          TransportPendingFee: TransportTotalHostelFee,
          DateOfBirth: DateOfBirth,
          Stream: stream,
          profileurl: req?.files?.profileurl ? profileimg : "",
          adharcard: req?.files?.adharcard ? adharimg : "",
          markSheet: req?.files?.markSheet ? marksheetimg : "",
          othersdoc: req?.files?.othersdoc ? otherimg : "",
          BirthDocument: req?.files?.BirthDocument ? birthdocimg : "",
        };

        let CreatedStudent = await Student.create(newUser);
        let fee;
        if (req.user?.userType === "institute") {
          let data = {
            ClientCode: req.user?.ClientCode,
            studentId: CreatedStudent?.id,
          };

          fee = await Coachingfeestatus.create(data);
          var token = jwt.sign(
            {
              id: CreatedStudent.id,
              userType: CreatedStudent.userType,
            },
            SECRET
          );

          if (token) {
            const promises = days?.map(async (date) => {
              let result = await AttendanceStudent.create({
                name: CreatedStudent?.name,
                email: CreatedStudent?.email,
                ClientCode: req.user?.ClientCode,
                // institutename: req.user?.institutename,
                // userId: req?.user?.id,
                address: CreatedStudent?.address,
                parentId: CreatedStudent?.parentId,
                studentid: CreatedStudent?.id,
                courseorclass: CreatedStudent?.courseorclass,
                batch: CreatedStudent?.batch,
                rollnumber: CreatedStudent?.rollnumber,
                fathersPhoneNo: CreatedStudent?.fathersPhoneNo,
                fathersName: CreatedStudent?.fathersName,
                MathersName: CreatedStudent?.MathersName,
                rollnumber: CreatedStudent?.rollnumber,
                MonthName: monthName,
                yeay: newdate?.getFullYear(),
                MonthNo: newdate?.getMonth() + 1,
                attendancedate: `${newdate?.getFullYear()}-${
                  newdate?.getMonth() + 1
                }-${date}`,
                attendaceStatusIntext: "Absent",

                monthNumber: newdate?.getMonth() + 1,
              });

              return result;
            });
            if (await Promise.all(promises)) {
              return respHandler.success(res, {
                status: true,
                data: [{ token: token, user: CreatedStudent, fee: fee }],
                msg: "Student Added Successfully!!",
              });
            }
          }
        }
        if (req.user?.userType === "school") {
          let monthnameAndYaer = printMonthAndYear();
          let feemonth = await Fee.findOne({
            where: {
              coursename: courseorclass,
              ClientCode: req.user?.ClientCode,
            },
          });
          if (feemonth) {
            let otherfee = await OtherFee.findAll({
              where: {
                Course: courseorclass,
                Session: Session,
                Section: Section,
                ClientCode: req?.user?.ClientCode,
              },
            });
            if (otherfee) {
              otherfee?.map(async (item, index) => {
                await OtherFee.create({
                  ClientCode: req?.user?.ClientCode,
                  studentName: CreatedStudent?.name,
                  fathername: CreatedStudent?.fathersName,
                  Course: CreatedStudent?.courseorclass,
                  fathersid: CreatedStudent?.parentId,
                  studentid: CreatedStudent?.id,
                  batchname: CreatedStudent?.batch,
                  SNO: CreatedStudent?.SrNumber,
                  Session: item?.Session,
                  Section: CreatedStudent?.Section,
                  OtherFeeName: item?.OtherFeeName,
                  FeeAmount: item?.FeeAmount,
                  DuesDate: item?.DuesDate,
                });
              });
            }
            const promises1 = monthnameAndYaer?.map(async (item, index) => {
              var words = item.split(/\s+/);
              var firstWord = words[0];
              var lastWord = words[words.length - 1];

              let result = await SchoolFeeStatus.create({
                ClientCode: req.user?.ClientCode,
                studentId: CreatedStudent?.id,
                MonthName: MonthanameArray[index + 1],
                Year: lastWord,
                PerMonthFee: CreatedStudent?.permonthfee,
                Session: Session,
                SrNumber: SrNumber,
              });
              firstWord = "";
              lastWord = "";
              return result;
            });
            const promises2 = monthnameAndYaer?.map(async (item, index) => {
              var words = item.split(/\s+/);
              var firstWord = words[0];
              var lastWord = words[words.length - 1];

              let result = await SchoolHostelFeeStatus.create({
                ClientCode: req.user?.ClientCode,
                studentId: CreatedStudent?.id,
                MonthName: MonthanameArray[index + 1],
                Year: lastWord,
                PerMonthFee: CreatedStudent?.HostelPerMonthFee,
                Session: Session,
                SrNumber: SrNumber,
              });
              firstWord = "";
              lastWord = "";
              return result;
            });

            const promises3 = monthnameAndYaer?.map(async (item, index) => {
              var words = item.split(/\s+/);
              var firstWord = words[0];
              var lastWord = words[words.length - 1];

              let result = await SchoolTransportFeeStatus.create({
                ClientCode: req.user?.ClientCode,
                studentId: CreatedStudent?.id,
                MonthName: MonthanameArray[index + 1],
                Year: lastWord,
                PerMonthFee: CreatedStudent?.TransportPerMonthFee,
                Session: Session,
                SrNumber: SrNumber,
              });
              firstWord = "";
              lastWord = "";
              return result;
            });

            if (
              (await Promise.all(promises1)) &&
              (await Promise.all(promises2)) &&
              (await Promise.all(promises3))
            ) {
              var token = jwt.sign(
                {
                  id: CreatedStudent.id,
                  userType: CreatedStudent.userType,
                },
                SECRET
              );

              if (token) {
                const promises = days?.map(async (date) => {
                  let result = await AttendanceStudent.create({
                    name: CreatedStudent?.name,
                    email: CreatedStudent?.email,
                    ClientCode: req.user?.ClientCode,
                    address: CreatedStudent?.address,
                    parentId: CreatedStudent?.parentId,
                    studentid: CreatedStudent?.id,
                    Section: Section,
                    courseorclass: CreatedStudent?.courseorclass,
                    batch: CreatedStudent?.courseorclass,
                    rollnumber: CreatedStudent?.rollnumber,
                    fathersPhoneNo: CreatedStudent?.fathersPhoneNo,
                    fathersName: CreatedStudent?.fathersName,
                    MathersName: CreatedStudent?.MathersName,
                    rollnumber: CreatedStudent?.rollnumber,
                    MonthName: monthName,
                    yeay: newdate?.getFullYear(),
                    MonthNo: newdate?.getMonth() + 1,
                    attendancedate: `${newdate?.getFullYear()}-${
                      newdate?.getMonth() + 1
                    }-${date}`,
                    attendaceStatusIntext: "Absent",

                    monthNumber: newdate?.getMonth() + 1,
                  });

                  return result;
                });
                if (await Promise.all(promises)) {
                  return respHandler.success(res, {
                    status: true,
                    data: [{ token: token, user: CreatedStudent, fee: fee }],
                    msg: "Student Added Successfully!!",
                  });
                }
              }
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

const Loging = async (req, res) => {
  const { rollnumber, password } = req.body;
  if (rollnumber != "" || password != "") {
    try {
      console.log("login data is ", req.body);

      let whereClause = {};
      whereClause.SrNumber = { [Op.regexp]: `^${rollnumber}.*` };
      let user = await Student.findOne({ where: whereClause });
      if (!user) {
        return respHandler.error(res, {
          status: false,
          msg: "Credentials Is Incorrect!!",
        });
      }
      const working = await bcrypt.compare(password, user.password);
      if (working) {
        var token = jwt.sign(
          {
            id: user.id,
            userType: user.userType,
          },
          SECRET
        );
        user.password = undefined;
        return respHandler.success(res, {
          status: true,
          msg: "Login successfully!!",
          data: [{ token: token, User: user }],
        });
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Credentials Is Incorrect!!",
        });
      }
    } catch (err) {
      return respHandler.error(res, {
        status: false,
        msg: "Something Went Wrong!!",
        error: [err.message],
      });
    }
  } else {
    return respHandler.error(res, {
      status: false,
      msg: "All fields are required!!",
    });
  }
};

///amdin or employee can get all studbnt list
const getAllStudent = async (req, res) => {
  try {
    const {
      name,
      batch,
      fromdate,
      todate,
      fathers,
      studentname,
      rollnumber,
      status,
      categoryname,
      library,
      sessionname,
      sectionname,
      sno,
      stream,
    } = req.query;

    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
    }

    if (fromdate && todate) {
      whereClause.admissionDate = { [Op.between]: [from, to] };
    }

    if (name) {
      whereClause.courseorclass = name;
    }
    if (batch) {
      whereClause.batch = { [Op.regexp]: `^${batch}.*` };
    }
    if (fathers) {
      whereClause.fathersName = { [Op.regexp]: `^${fathers}.*` };
    }
    if (rollnumber) {
      whereClause.rollnumber = { [Op.regexp]: `^${Number(rollnumber)}.*` };
    }
    if (studentname) {
      whereClause.name = { [Op.regexp]: `^${studentname}.*` };
    }
    if (status) {
      whereClause.Status = { [Op.regexp]: `^${status}.*` };
    }
    if (categoryname) {
      whereClause.StudentCategory = { [Op.regexp]: `^${categoryname}.*` };
    }

    if (sessionname) {
      whereClause.Session = { [Op.regexp]: `^${sessionname}.*` };
    } else {
      let currentsession = GetSession();
      whereClause.Session = { [Op.regexp]: `^${currentsession}.*` };
    }

    if (sectionname) {
      whereClause.Section = { [Op.regexp]: `^${sectionname}.*` };
    }

    if (stream) {
      whereClause.Stream = { [Op.regexp]: `^${stream}.*` };
    }
    if (library) {
      whereClause.Library = library;
    }

    if (sno) {
      whereClause.SrNumber = { [Op.regexp]: `^${sno}.*` };
    }

    let students = await Student.findAll({
      where: whereClause,
      include: [
        {
          model: Coachingfeestatus,
        },
      ],
      order: [["id", "DESC"]],
    });
    if (students) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Student successfully!!",
        data: students,
      });
    }
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

///amdin or employee can get all studbnt list
const getAllStudentCoaching = async (req, res) => {
  try {
    const {
      name,
      batch,
      fromdate,
      todate,
      fathers,
      studentname,
      rollnumber,
      status,
      categoryname,
      library,
      sno,
    } = req.query;

    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
    }

    if (fromdate && todate) {
      whereClause.admissionDate = { [Op.between]: [from, to] };
    }

    if (name) {
      whereClause.courseorclass = name;
    }
    if (batch) {
      whereClause.batch = { [Op.regexp]: `^${batch}.*` };
    }
    if (fathers) {
      whereClause.fathersName = { [Op.regexp]: `^${fathers}.*` };
    }
    if (rollnumber) {
      whereClause.rollnumber = { [Op.regexp]: `^${Number(rollnumber)}.*` };
    }
    if (studentname) {
      whereClause.name = { [Op.regexp]: `^${studentname}.*` };
    }
    if (status) {
      whereClause.Status = { [Op.regexp]: `^${status}.*` };
    }
    if (categoryname) {
      whereClause.StudentCategory = { [Op.regexp]: `^${categoryname}.*` };
    }

    if (library) {
      whereClause.Library = library;
    }

    if (sno) {
      whereClause.SrNumber = { [Op.regexp]: `^${sno}.*` };
    }

    let students = await Student.findAll({
      where: whereClause,
      include: [
        {
          model: Coachingfeestatus,
        },
      ],
      order: [["id", "DESC"]],
    });
    if (students) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Student successfully!!",
        data: students,
      });
    }
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const UpdateStudent = async (req, res) => {
  try {
    let newdate = new Date();
    var monthName = monthNames[newdate?.getMonth()];
    let fullyear = newdate.getFullYear();
    let lastyear = newdate.getFullYear() - 1;
    let session = GetSession();
    let days = monthdays[newdate?.getMonth() + 1];
    const {
      name,
      email,
      phoneno1,
      phoneno2,
      address,
      city,
      state,
      pincode,
      fathersPhoneNo,
      fathersName,
      MathersName,
      rollnumber,
      admissionDate,
      StudentStatus,
      courseduration,
      studentTotalFee,
      permonthfee,
      courseorclass,
      adharno,
      pancardnno,
      batch,
      id,
      markSheetname,
      othersdocName,
      Status,
      Transport,
      Library,
      StudentCategory,
      hostal,
      HostelPerMonthFee,
      TotalHostelFee,
      TransportPerMonthFee,
      TransportTotalHostelFee,
      AnnualFee,
      Session,
      Section,
      whatsappNo,
      SrNumber,
      hostelname,
      Category,
      Facility,
      hostelstatus,
      transportstatus,
      FromRoute,
      ToRoute,
      BusNumber,
      DateOfBirth,
      stream,
    } = req.body;

    let student = await Student.findOne({
      where: {
        id: id,
      },
    });
    if (student) {
      let profileimg;
      let adharimg;
      let birthdocimg;
      let otherimg;
      let marksheetimg;

      if (req?.files?.profileurl) {
        if (student?.profileimg != null) {
          await deletefilefromfirebase(
            `student-profile-${student?.SrNumber}-${student?.ClientCode}`
          );
        }
        profileimg = await uploadfileonfirebase(
          req?.files?.profileurl,
          `student-profile-${student?.SrNumber}-${student?.ClientCode}`
        );
      }

      if (req?.files?.adharcard) {
        if (student?.adharcard != "") {
          await deletefilefromfirebase(
            `student-adharcard-${student?.SrNumber}-${student?.ClientCode}`
          );
        }
        adharimg = await uploadfileonfirebase(
          req?.files?.adharcard,
          `student-adharcard-${student?.SrNumber}-${student?.ClientCode}`
        );
      }

      if (req?.files?.BirthDocument) {
        if (student?.BirthDocument != "") {
          await deletefilefromfirebase(
            `student-BirthDocument-${student?.SrNumber}-${student?.ClientCode}`
          );
        }
        birthdocimg = await uploadfileonfirebase(
          req?.files?.BirthDocument,
          `student-BirthDocument-${student?.SrNumber}-${student?.ClientCode}`
        );
      }

      if (req?.files?.othersdoc) {
        if (student?.othersdoc != "") {
          await deletefilefromfirebase(
            `student-othersdoc-${student?.SrNumber}-${student?.ClientCode}`
          );
        }
        otherimg = await uploadfileonfirebase(
          req?.files?.othersdoc,
          `student-othersdoc-${student?.SrNumber}-${student?.ClientCode}`
        );
      }

      if (req?.files?.markSheet) {
        if (student?.markSheet != "") {
          await deletefilefromfirebase(
            `student-markSheet-${student?.SrNumber}-${student?.ClientCode}`
          );
        }
        marksheetimg = await uploadfileonfirebase(
          req?.files?.markSheet,
          `student-markSheet-${student?.SrNumber}-${student?.ClientCode}`
        );
      }

      let status = await Student.update(
        {
          name: name,
          email: email,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          logourl: req?.user?.logourl,
          phoneno1: phoneno1,
          phoneno2: phoneno2,
          address: address,
          city: city,
          state: state,
          pincode: pincode,
          fathersPhoneNo: fathersPhoneNo,
          fathersName: fathersName,
          MathersName: MathersName,
          rollnumber: rollnumber,
          StudentStatus: StudentStatus,
          Status: Status,
          StudentCategory: StudentCategory,
          courseorclass: courseorclass,
          courseduration: courseduration,
          studentTotalFee: studentTotalFee,
          permonthfee: permonthfee,
          adharno: adharno,
          pancardnno: pancardnno,
          batch: batch,
          Transport: Transport,
          Library: Library,
          hostal: hostal,
          admissionDate: admissionDate,
          markSheetname: markSheetname,
          othersdocName: othersdocName,
          HostelPerMonthFee: HostelPerMonthFee,
          TotalHostelFee: TotalHostelFee,
          TransportPerMonthFee: TransportPerMonthFee,
          TransportTotalHostelFee: TransportTotalHostelFee,
          AnnualFee: AnnualFee,
          Session: Session,
          SrNumber: SrNumber,
          Section: Section,
          hostelname: hostelname,
          Category: Category,
          Facility: Facility,
          whatsappNo: whatsappNo,
          FromRoute: FromRoute,
          ToRoute: ToRoute,
          BusNumber: BusNumber,
          DateOfBirth: DateOfBirth,
          Stream: stream,
          profileurl: req?.files?.profileurl ? profileimg : req.body.profileurl,
          adharcard: req?.files?.adharcard ? adharimg : req.body.profileurl,
          markSheet: req?.files?.markSheet ? marksheetimg : req.body.profileurl,
          othersdoc: req?.files?.othersdoc ? otherimg : req.body.profileurl,
          BirthDocument: req?.files?.BirthDocument
            ? birthdocimg
            : req.body.profileurl,
        },
        {
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
          },
        }
      );

      if (status) {
        let UpdatedStudent = await Student.findOne({
          where: {
            id: id,
          },
        });
        if (UpdatedStudent) {
          let allhostelfee = await SchoolHostelFeeStatus.findAll({
            where: {
              studentId: id,
              SrNumber: UpdatedStudent?.SrNumber,
              Session: UpdatedStudent?.Session,
            },
          });

          let alltransportfee = await SchoolTransportFeeStatus.findAll({
            where: {
              studentId: id,
              SrNumber: UpdatedStudent?.SrNumber,
              Session: UpdatedStudent?.Session,
            },
          });

          if (allhostelfee && alltransportfee) {
            let promises1 = allhostelfee?.map(async (item) => {
              await SchoolHostelFeeStatus.update(
                {
                  ClientCode: req.user?.ClientCode,
                  studentId: UpdatedStudent?.id,
                  PerMonthFee: hostal ? HostelPerMonthFee : 0,
                  Session: UpdatedStudent?.Session,
                  SrNumber: UpdatedStudent?.SrNumber,
                  paidStatus: hostelstatus,
                },
                {
                  where: {
                    id: item?.id,
                    MonthName: item?.MonthName,
                    Session: item?.Session,
                    SrNumber: UpdatedStudent?.SrNumber,
                    ClientCode: req.user?.ClientCode,
                  },
                }
              );
            });

            let promises2 = alltransportfee?.map(async (item) => {
              await SchoolTransportFeeStatus.update(
                {
                  ClientCode: req.user?.ClientCode,
                  studentId: UpdatedStudent?.id,
                  PerMonthFee: Transport ? TransportPerMonthFee : 0,
                  Session: UpdatedStudent?.Session,
                  SrNumber: UpdatedStudent?.SrNumber,
                  paidStatus: transportstatus,
                },
                {
                  where: {
                    id: item?.id,
                    MonthName: item?.MonthName,
                    Session: item?.Session,
                    SrNumber: UpdatedStudent?.SrNumber,
                    ClientCode: req.user?.ClientCode,
                  },
                }
              );
            });

            if (
              (await Promise.all(promises1)) &&
              (await Promise.all(promises2))
            ) {
              if (Transport === false) {
                let oldbus = await VehicleDetails.findOne({
                  where: {
                    BusNumber: BusNumber,
                    ClientCode: req.user?.ClientCode,
                  },
                });

                let status = await VehicleDetails.update(
                  {
                    NoOfSheets: Number(oldbus?.NoOfSheets) + 1,
                  },
                  {
                    where: {
                      id: oldbus?.id,
                      ClientCode: req.user?.ClientCode,
                    },
                  }
                );
              } else {
                let isattendance = await AttendanceStudent.findOne({
                  where: {
                    studentid: UpdatedStudent?.id,
                    attendancedate: newdate,
                  },
                });
                if (isattendance) {
                  return respHandler.success(res, {
                    status: true,
                    msg: "Student Updated successfully!!",
                    data: UpdatedStudent,
                  });
                } else {
                  if (Status === "Active") {
                    const promises = days?.map(async (date) => {
                      let result = await AttendanceStudent.create({
                        name: UpdatedStudent?.name,
                        email: UpdatedStudent?.email,
                        ClientCode: req.user?.ClientCode,
                        address: UpdatedStudent?.address,
                        parentId: UpdatedStudent?.parentId,
                        studentid: UpdatedStudent?.id,
                        Section: UpdatedStudent?.Section,
                        courseorclass: UpdatedStudent?.courseorclass,
                        batch: UpdatedStudent?.courseorclass,
                        rollnumber: UpdatedStudent?.rollnumber,
                        fathersPhoneNo: UpdatedStudent?.fathersPhoneNo,
                        fathersName: UpdatedStudent?.fathersName,
                        MathersName: UpdatedStudent?.MathersName,
                        rollnumber: UpdatedStudent?.rollnumber,
                        MonthName: monthName,
                        yeay: newdate?.getFullYear(),
                        MonthNo: newdate?.getMonth() + 1,
                        attendancedate: `${newdate?.getFullYear()}-${
                          newdate?.getMonth() + 1
                        }-${date}`,
                        attendaceStatusIntext: "Absent",

                        monthNumber: newdate?.getMonth() + 1,
                      });

                      return result;
                    });
                    if (await Promise.all(promises)) {
                      return respHandler.success(res, {
                        status: true,
                        msg: "Student Updated successfully add attendance!!",
                        data: UpdatedStudent,
                      });
                    }
                  } else {
                    return respHandler.success(res, {
                      status: true,
                      msg: "Student Updated successfully!!",
                      data: UpdatedStudent,
                    });
                  }
                }
              }
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

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.query;
    let student = await Student.findOne({ where: { id: id } });
    if (student != null) {
      if (student?.profileimg != "") {
        await deletefilefromfirebase(
          `student-profile-${student?.SrNumber}-${student?.ClientCode}`
        );
      }

      if (student?.adharcard != "") {
        await deletefilefromfirebase(
          `student-adharcard-${student?.SrNumber}-${student?.ClientCode}`
        );
      }

      if (student?.BirthDocument != "") {
        await deletefilefromfirebase(
          `student-BirthDocument-${student?.SrNumber}-${student?.ClientCode}`
        );
      }

      if (student?.othersdoc != "") {
        await deletefilefromfirebase(
          `student-othersdoc-${student?.SrNumber}-${student?.ClientCode}`
        );
      }

      if (student?.markSheet != "") {
        await deletefilefromfirebase(
          `student-markSheet-${student?.SrNumber}-${student?.ClientCode}`
        );
      }

      await Student.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Student Deleted Successfully!!",
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Something Went Wrong!!",
        error: ["not found"],
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

getClientCount = async (req) => {
  let count = await ReceiptData.count({
    where: {
      ClientCode: req?.user?.ClientCode,
    },
  });

  return count;
};

const addfee = async (req, res) => {
  try {
    const {
      id,
      paymonths,
      studentData,
      feetype,
      discount,
      PayOption,
      paymentdate,
    } = req.body;
    if (discount === true) {
      let status = await Student.update(
        {
          Registrationfeestatus: true,
        },
        {
          where: {
            id: id,
            ClientCode: req?.user?.ClientCode,
          },
        }
      );
      if (status) {
        return respHandler.success(res, {
          status: true,
          msg: "Discount Added successfully!!",
          data: [],
        });
      }
    } else {
      let prefix;
      if (req?.user?.institutename) {
        prefix = await ReceiptPrefix.findOne({
          where: {
            ClientCode: req?.user?.ClientCode,
          },
        });
        if (prefix) {
          const promises = paymonths?.map(async (item) => {
            let = key = Coachingfeemon[Number(item)];

            let result = await Coachingfeestatus.update(
              {
                [key]: "Paid",
              },
              {
                where: {
                  studentId: id,
                  ClientCode: req?.user?.ClientCode,
                },
              }
            );
            return result;
          });

          let studentone = await Student.findOne({
            where: {
              id: id,
            },
          });
          if (studentone) {
            await Student.update(
              {
                paidfee:
                  studentone?.paidfee +
                  studentone?.permonthfee * paymonths.length,
                pendingfee:
                  Number(studentone?.pendingfee) -
                  studentone?.permonthfee * paymonths.length,
              },
              {
                where: {
                  id: id,
                  ClientCode: req?.user?.ClientCode,
                  institutename: req?.user?.institutename,
                },
              }
            );
          }
          if (await Promise.all(promises)) {
            if (feetype === "Registration") {
              await Student.update(
                {
                  Registrationfeestatus: true,
                },
                {
                  where: {
                    id: id,
                    ClientCode: req?.user?.ClientCode,
                    institutename: req?.user?.institutename,
                  },
                }
              );
            }

            let count = await getClientCount(req);
            let receipno = `${prefix?.receiptPrefix}${count}`;
            let newdate = new Date();
            let result = await ReceiptData.create({
              ClientCode: req?.user?.ClientCode,
              institutename: req?.user?.institutename,
              typeoforganization: req?.user?.institutename,
              ReceiptNo: receipno,
              Feetype: feetype,
              PaidDate: paymentdate,
              PaidAmount:
                feetype === "Registration"
                  ? studentData?.regisgrationfee
                  : studentData?.permonthfee * paymonths.length,
              RollNo: studentData?.rollnumber,
              studentName: studentData?.name,
              fathername: studentData?.fathersName,
              Course: studentData?.courseorclass,
              fathersid: studentData?.parentId,
              studentid: studentData?.id,
              batchname: studentData?.batch,
              SNO: studentData?.SrNumber,
              Session: studentData?.Session,
              Course: studentData?.courseorclass,
              Section: studentData?.Section,
              PayOption: PayOption,
              monthno: new Date(paymentdate).getMonth() + 1,
            });
            if (result) {
              let student = await Student.findOne({
                where: {
                  id: id,
                  ClientCode: req?.user?.ClientCode,
                },
                include: [
                  {
                    model: Coachingfeestatus,
                  },
                ],
              });
              return respHandler.success(res, {
                status: true,
                msg: "Fee Pay Added successfully!!",
                data: [{ receiptdata: result }],
              });
            }
          }
        } else {
          return respHandler.error(res, {
            status: false,
            msg: "Please Add Receipt Prefix !!",
            error: [""],
          });
        }

        console.log("dd", prefix?.receiptPrefix);
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

///amdin or employee can get all studbnt list
const getReceipt = async (req, res) => {
  try {
    const {
      fromdate,
      name,
      studentname,
      rollnumber,
      sessionname,
      sectionname,
      sno,
      todate,
    } = req.query;

    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);
    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
    }
    if (fromdate && todate) {
      whereClause.PaidDate = { [Op.between]: [from, to] };
    }

    if (req.user?.userType === "institute") {
      if (fromdate) {
        whereClause.PaidDate = fromdate;
      }
    }

    if (name) {
      whereClause.Course = { [Op.regexp]: `^${name}.*` };
    }

    if (rollnumber) {
      whereClause.RollNo = { [Op.regexp]: `^${Number(rollnumber)}.*` };
    }
    if (studentname) {
      whereClause.studentName = { [Op.regexp]: `^${studentname}.*` };
    }
    if (sno) {
      whereClause.SNO = { [Op.regexp]: `^${sno}.*` };
    }
    if (sectionname) {
      whereClause.Section = { [Op.regexp]: `^${sectionname}.*` };
    }

    if (sessionname) {
      whereClause.Session = { [Op.regexp]: `^${sessionname}.*` };
    } else {
      let newsession = GetSession();
      whereClause.Session = { [Op.regexp]: `^${newsession}.*` };
    }

    let receipts = await ReceiptData.findAll({
      where: whereClause,
      order: [["PaidDate", "DESC"]],
    });
    if (receipts) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Receipt successfully!!",
        data: receipts,
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Not Found!!",
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

///amdin or employee can get all studbnt list
const getReceiptCoaching = async (req, res) => {
  try {
    const {
      fromdate,
      name,
      studentname,
      rollnumber,
      sessionname,
      sectionname,
      sno,
      todate,
    } = req.query;

    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);
    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
    }
    if (fromdate && todate) {
      whereClause.PaidDate = { [Op.between]: [from, to] };
    }

    if (req.user?.userType === "institute") {
      if (fromdate) {
        whereClause.PaidDate = fromdate;
      }
    }

    if (name) {
      whereClause.Course = { [Op.regexp]: `^${name}.*` };
    }

    if (rollnumber) {
      whereClause.RollNo = { [Op.regexp]: `^${Number(rollnumber)}.*` };
    }
    if (studentname) {
      whereClause.studentName = { [Op.regexp]: `^${studentname}.*` };
    }
    if (sno) {
      whereClause.SNO = { [Op.regexp]: `^${sno}.*` };
    }

    let receipts = await ReceiptData.findAll({
      where: whereClause,
      order: [["PaidDate", "DESC"]],
    });
    if (receipts) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Receipt successfully!!",
        data: receipts,
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Not Found!!",
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

///amdin or employee can get all studbnt list
const getStudentFee = async (req, res) => {
  try {
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
      whereClause.id = req?.user?.id;
    }

    let students = await Student.findAll({
      where: whereClause,
      include: [
        {
          model: Coachingfeestatus,
        },
      ],
      order: [["id", "DESC"]],
    });
    if (students) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Student Fee successfully!!",
        data: students,
      });
    }
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};
///Add school academy Fee
const addSchoolFee = async (req, res) => {
  try {
    const { id, acadminArray, studentData, feetype, PayOption, paymentdate } =
      req.body;

    let prefix;

    if (req?.user) {
      prefix = await ReceiptPrefix.findOne({
        where: {
          ClientCode: req?.user?.ClientCode,
        },
      });

      if (prefix) {
        const promises = acadminArray?.map(async (item) => {
          let result = await SchoolFeeStatus.update(
            {
              paidStatus: true,
            },
            {
              where: {
                studentId: id,
                id: item?.id,
                ClientCode: req?.user?.ClientCode,
              },
            }
          );
          return result;
        });

        if (await Promise.all(promises)) {
          let studentone = await Student.findOne({
            where: {
              id: id,
            },
          });

          if (studentone) {
            let updated = await Student.update(
              {
                paidfee:
                  studentone?.paidfee +
                  studentone?.permonthfee * acadminArray.length,
                pendingfee:
                  Number(studentone?.pendingfee) -
                  studentone?.permonthfee * acadminArray.length,
              },
              {
                where: {
                  id: id,
                  ClientCode: req?.user?.ClientCode,
                  institutename: req?.user?.institutename,
                },
              }
            );
            if (updated) {
              let count = await getClientCount(req);
              let receipno = `${prefix?.receiptPrefix}${count}`;
              let newdate = new Date();
              let result = await ReceiptData.create({
                ClientCode: req?.user?.ClientCode,
                ReceiptNo: receipno,
                Feetype: feetype,
                PaidDate: paymentdate,
                PaidAmount:
                  feetype === "Registration"
                    ? studentData?.regisgrationfee
                    : studentData?.permonthfee * acadminArray.length,
                RollNo: studentData?.rollnumber,
                studentName: studentData?.name,
                fathername: studentData?.fathersName,
                Course: studentData?.courseorclass,
                SNO: studentData?.SrNumber,
                Session: studentData?.Session,
                Section: studentData?.Section,
                fathersid: studentData?.parentId,
                studentid: studentData?.id,
                batchname: studentData?.batch,
                PayOption: PayOption,
                monthno: new Date(paymentdate).getMonth() + 1,
              });
              if (result) {
                return respHandler.success(res, {
                  status: true,
                  msg: "Academy Fee Added Successfully!!",
                  data: result,
                });
              }
            }
          }
        }
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Please Add Receipt Prefix !!",
          error: [""],
        });
      }

      console.log("dd", prefix?.receiptPrefix);
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

///Add school academy Fee
const addHostelFee = async (req, res) => {
  try {
    const { id, acadminArray, studentData, feetype, paymentdate, PayOption } =
      req.body;

    let prefix;

    if (req?.user) {
      prefix = await ReceiptPrefix.findOne({
        where: {
          ClientCode: req?.user?.ClientCode,
        },
      });

      if (prefix) {
        const promises = acadminArray?.map(async (item) => {
          let result = await SchoolHostelFeeStatus.update(
            {
              paidStatus: true,
            },
            {
              where: {
                studentId: id,
                id: item?.id,
                ClientCode: req?.user?.ClientCode,
              },
            }
          );
          return result;
        });

        if (await Promise.all(promises)) {
          let studentone = await Student.findOne({
            where: {
              id: id,
            },
          });

          if (studentone) {
            let updated = await Student.update(
              {
                HostelPaidFee:
                  studentone?.HostelPaidFee +
                  studentone?.HostelPerMonthFee * acadminArray.length,
                HostelPendingFee:
                  Number(studentone?.HostelPendingFee) -
                  studentone?.HostelPerMonthFee * acadminArray.length,
              },
              {
                where: {
                  id: id,
                  ClientCode: req?.user?.ClientCode,
                  institutename: req?.user?.institutename,
                },
              }
            );
            if (updated) {
              let count = await getClientCount(req);
              let receipno = `${prefix?.receiptPrefix}${count}`;
              let newdate = new Date();
              let result = await ReceiptData.create({
                ClientCode: req?.user?.ClientCode,
                ReceiptNo: receipno,
                Feetype: feetype,
                PaidDate: paymentdate,
                PaidAmount:
                  feetype === "Registration"
                    ? studentData?.regisgrationfee
                    : studentData?.HostelPerMonthFee * acadminArray.length,
                RollNo: studentData?.rollnumber,
                studentName: studentData?.name,
                fathername: studentData?.fathersName,
                Course: studentData?.courseorclass,
                fathersid: studentData?.parentId,
                studentid: studentData?.id,
                batchname: studentData?.batch,
                SNO: studentData?.SrNumber,
                Session: studentData?.Session,
                Section: studentData?.Section,
                PayOption: PayOption,
                monthno: new Date(paymentdate).getMonth() + 1,
              });
              if (result) {
                return respHandler.success(res, {
                  status: true,
                  msg: "Hostel Fee Added Successfully!!",
                  data: result,
                });
              }
            }
          }
        }
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Please Add Receipt Prefix !!",
          error: [""],
        });
      }

      console.log("dd", prefix?.receiptPrefix);
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

///Add school academy Fee
const addTransportFee = async (req, res) => {
  try {
    const { id, acadminArray, studentData, feetype, PayOption, paymentdate } =
      req.body;

    let prefix;

    if (req?.user) {
      prefix = await ReceiptPrefix.findOne({
        where: {
          ClientCode: req?.user?.ClientCode,
        },
      });

      if (prefix) {
        const promises = acadminArray?.map(async (item) => {
          let result = await SchoolTransportFeeStatus.update(
            {
              paidStatus: true,
            },
            {
              where: {
                studentId: id,
                id: item?.id,
                ClientCode: req?.user?.ClientCode,
              },
            }
          );
          return result;
        });

        if (await Promise.all(promises)) {
          let studentone = await Student.findOne({
            where: {
              id: id,
            },
          });

          if (studentone) {
            let updated = await Student.update(
              {
                TransportPaidFee:
                  studentone?.TransportPaidFee +
                  studentone?.TransportPerMonthFee * acadminArray.length,
                TransportPendingFee:
                  Number(studentone?.TransportPendingFee) -
                  studentone?.TransportPerMonthFee * acadminArray.length,
              },
              {
                where: {
                  id: id,
                  ClientCode: req?.user?.ClientCode,
                  institutename: req?.user?.institutename,
                },
              }
            );
            if (updated) {
              let count = await getClientCount(req);
              let receipno = `${prefix?.receiptPrefix}${count}`;
              let newdate = new Date();
              let result = await ReceiptData.create({
                ClientCode: req?.user?.ClientCode,
                ReceiptNo: receipno,
                Feetype: feetype,
                PaidDate: paymentdate,
                PaidAmount:
                  feetype === "Registration"
                    ? studentData?.regisgrationfee
                    : studentData?.TransportPerMonthFee * acadminArray.length,
                RollNo: studentData?.rollnumber,
                studentName: studentData?.name,
                fathername: studentData?.fathersName,
                Course: studentData?.courseorclass,
                fathersid: studentData?.parentId,
                studentid: studentData?.id,
                batchname: studentData?.batch,
                SNO: studentData?.SrNumber,
                Session: studentData?.Session,
                Section: studentData?.Section,
                PayOption: PayOption,
                monthno: new Date(paymentdate).getMonth() + 1,
              });
              if (result) {
                return respHandler.success(res, {
                  status: true,
                  msg: "Transport Fee Added Successfully!!",
                  data: result,
                });
              }
            }
          }
        }
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Please Add Receipt Prefix !!",
          error: [""],
        });
      }

      console.log("dd", prefix?.receiptPrefix);
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const ChangeSession = async (req, res) => {
  try {
    const { studentlist, session, section, classname } = req.body;
    let newsate = new Date();
    let isallreadyChnagesSession = await Student.findAll({
      where: {
        Session: session,
        Section: section,
        courseorclass: classname,
      },
    });
    if (isallreadyChnagesSession?.length > 0) {
      return respHandler.error(res, {
        status: false,
        msg: "Already changed session!!",
        error: [""],
      });
    }

    if (studentlist[0]?.courseorclass === classname) {
      return respHandler.error(res, {
        status: false,
        msg: "Same class is not allow!!",
        error: [""],
      });
    }

    if (studentlist[0]?.Session === session) {
      return respHandler.error(res, {
        status: false,
        msg: "Same session is not allow!!",
        error: [""],
      });
    }

    if (session === "") {
      return respHandler.error(res, {
        status: false,
        msg: "Session is required!!",
        error: [""],
      });
    }
    if (section === "") {
      return respHandler.error(res, {
        status: false,
        msg: "Section is required!!",
        error: [""],
      });
    }
    if (classname === "") {
      return respHandler.error(res, {
        status: false,
        msg: "Class is required!!",
        error: [""],
      });
    }
    const promises = studentlist?.map(async (item) => {
      let result = await Student.create({
        name: item?.name,
        email: item?.email,
        ClientCode: req.user?.ClientCode,
        logourl: req?.user?.logourl,
        phoneno1: item?.phoneno1,
        phoneno2: item?.phoneno2,
        address: item?.address,
        parentId: item?.parentId,
        city: item?.city,
        state: item?.state,
        pincode: item?.pincode,
        fathersPhoneNo: item?.fathersPhoneNo,
        fathersName: item?.fathersName,
        MathersName: item?.MathersName,
        rollnumber: item?.rollnumber,
        typeoforganization: item?.typeoforganization,
        StudentStatus: item?.StudentStatus,
        Status: item?.Status,
        StudentCategory: item?.StudentCategory,
        courseorclass: item?.courseorclass,
        courseduration: item?.courseduration,
        studentTotalFee: item?.studentTotalFee,
        regisgrationfee: item?.regisgrationfee,
        permonthfee: item?.permonthfee,
        adharno: item?.adharno,
        pancardnno: item?.pancardnno,
        courseorclass: classname,
        Transport: item?.Transport,
        Library: item?.Library,
        hostal: item?.hostal,
        admissionDate: newsate,
        password: item?.password,
        markSheetname: item?.markSheetname,
        othersdocName: item?.othersdocName,
        HostelPerMonthFee: item?.HostelPerMonthFee,
        TotalHostelFee: item?.TotalHostelFee,
        TransportPerMonthFee: item?.TransportPerMonthFee,
        TransportTotalHostelFee: item?.TransportTotalHostelFee,
        AnnualFee: item?.AnnualFee,
        Session: session,
        Section: section,
        SrNumber: item?.SrNumber,
        hostelname: item?.hostelname,
        Category: item?.Category,
        Facility: item?.Facility,
        whatsappNo: item?.whatsappNo,
        profileurl: item?.profileurl,
        adharcard: item?.adharcard,
        markSheet: item?.markSheet,
        othersdoc: item?.othersdoc,
        BirthDocument: item?.BirthDocument,
        pendingfee: item?.studentTotalFee,
        institutename: item?.institutename,
        FromRoute: "",
        ToRoute: "",
        BusNumber: "",
        HostelPendingFee: item?.TotalHostelFee,
        TransportPendingFee: item?.TransportTotalHostelFee,
      });

      return result;
    });

    if (await Promise.all(promises)) {
      let allchangedSession = await Student.findAll({
        where: {
          Session: session,
          courseorclass: classname,
          Section: section,
          ClientCode: req.user?.ClientCode,
        },
      });
      if (allchangedSession) {
        let promises = allchangedSession?.map(async (items) => {
          let monthnameAndYaer = printMonthAndYear();
          const promises1 = monthnameAndYaer?.map(async (item, index) => {
            var words = item.split(/\s+/);
            var firstWord = words[0];
            var lastWord = words[words.length - 1];
            console.log(firstWord, lastWord);
            let result = await SchoolFeeStatus.create({
              ClientCode: req.user?.ClientCode,
              studentId: items?.id,
              MonthName: MonthanameArray[index + 1],
              Year: lastWord,
              PerMonthFee: items?.permonthfee,
              Session: items?.Session,
              SrNumber: items?.SrNumber,
            });
            firstWord = "";
            lastWord = "";
            return result;
          });

          const promises2 = monthnameAndYaer?.map(async (item, index) => {
            var words = item.split(/\s+/);
            var firstWord = words[0];
            var lastWord = words[words.length - 1];
            console.log(firstWord, lastWord);

            let result = await SchoolHostelFeeStatus.create({
              ClientCode: req.user?.ClientCode,
              studentId: items?.id,
              MonthName: MonthanameArray[index + 1],
              Year: lastWord,
              PerMonthFee: items?.HostelPerMonthFee,
              Session: items?.Session,
              SrNumber: items?.SrNumber,
            });
            firstWord = "";
            lastWord = "";
            return result;
          });

          const promises3 = monthnameAndYaer?.map(async (item, index) => {
            var words = item.split(/\s+/);
            var firstWord = words[0];
            var lastWord = words[words.length - 1];
            console.log(firstWord, lastWord);

            let result = await SchoolTransportFeeStatus.create({
              ClientCode: req.user?.ClientCode,
              studentId: items?.id,
              MonthName: MonthanameArray[index + 1],
              Year: lastWord,
              PerMonthFee: items?.TransportPerMonthFee,
              Session: items?.Session,
              SrNumber: items?.SrNumber,
            });
            firstWord = "";
            lastWord = "";
            return result;
          });
          if (
            (await Promise.all(promises1)) &&
            (await Promise.all(promises2)) &&
            (await Promise.all(promises3))
          ) {
            return 1;
          }
        });

        if (await Promise.all(promises)) {
          if (allchangedSession) {
            return respHandler.success(res, {
              status: true,
              msg: "Session Changed Successfully!!",
              data: allchangedSession,
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

///Add school academy Fee
const PaySchoolAnualRegister = async (req, res) => {
  try {
    const { id, feetype, annualfee, PayOption, paymentdate } = req.body;

    let prefix;

    if (req?.user) {
      prefix = await ReceiptPrefix.findOne({
        where: {
          ClientCode: req?.user?.ClientCode,
        },
      });

      if (prefix) {
        let studentone = await Student.findOne({
          where: {
            id: id,
          },
        });

        if (studentone) {
          let updated;
          if (feetype === "Registration" && annualfee === "Annual") {
            updated = await Student.update(
              {
                Registrationfeestatus: 1,
                AnnualFeeStatus: 1,
              },
              {
                where: {
                  id: id,
                  ClientCode: req?.user?.ClientCode,
                },
              }
            );
          } else {
            if (feetype === "Registration") {
              updated = await Student.update(
                {
                  Registrationfeestatus: 1,
                },
                {
                  where: {
                    id: id,
                    ClientCode: req?.user?.ClientCode,
                  },
                }
              );
            }

            if (annualfee === "Annual") {
              updated = await Student.update(
                {
                  AnnualFeeStatus: 1,
                },
                {
                  where: {
                    id: id,
                    ClientCode: req?.user?.ClientCode,
                  },
                }
              );
            }
          }

          if (updated) {
            let count = await getClientCount(req);
            let receipno = `${prefix?.receiptPrefix}${count}`;
            let newdate = new Date();
            let result = await ReceiptData.create({
              ClientCode: req?.user?.ClientCode,
              ReceiptNo: receipno,
              Feetype:
                feetype === "Registration" && annualfee === "Annual"
                  ? `${feetype} ${annualfee}`
                  : feetype === "Registration"
                  ? feetype
                  : annualfee === "Annual"
                  ? annualfee
                  : "",
              PaidDate: paymentdate,
              PaidAmount:
                feetype === "Registration" && annualfee === "Annual"
                  ? Number(studentone?.regisgrationfee) +
                    Number(studentone?.AnnualFee)
                  : feetype === "Registration"
                  ? Number(studentone?.regisgrationfee)
                  : annualfee === "Annual"
                  ? Number(studentone?.AnnualFee)
                  : 0,
              RollNo: studentone?.rollnumber,
              studentName: studentone?.name,
              fathername: studentone?.fathersName,
              Course: studentone?.courseorclass,
              SNO: studentone?.SrNumber,
              Session: studentone?.Session,
              Section: studentone?.Section,
              fathersid: studentone?.parentId,
              studentid: studentone?.id,
              batchname: studentone?.batch,
              PayOption: PayOption,
              monthno: new Date(paymentdate).getMonth() + 1,
            });
            if (result) {
              return respHandler.success(res, {
                status: true,
                msg: `${annualfee} ${feetype} Fee Added Successfully!!`,
                data: result,
              });
            }
          }
        }
      } else {
        return respHandler.error(res, {
          status: false,
          msg: `Please Add Receipt Prefix !!`,
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

const CreateOtherFee = async (req, res) => {
  try {
    const {
      courseorclass,
      Session,
      Section,
      OtherFeeName,
      FeeAmount,
      DuesDate,
    } = req.body;
    let students = await Student.findAll({
      where: {
        courseorclass: courseorclass,
        Session: Session,
        Section: Section,
        ClientCode: req?.user?.ClientCode,
      },
    });

    if (students != null) {
      const promises = students?.map(async (item) => {
        let result = await OtherFee.create({
          ClientCode: req?.user?.ClientCode,
          studentName: item?.name,
          fathername: item?.fathersName,
          Course: item?.courseorclass,
          fathersid: item?.parentId,
          studentid: item?.id,
          batchname: item?.batch,
          SNO: item?.SrNumber,
          Session: item?.Session,
          Section: item?.Section,
          SrNumber: item?.SrNumber,
          OtherFeeName: OtherFeeName,
          FeeAmount: FeeAmount,
          DuesDate: DuesDate,
        });

        return result;
      });

      if (await Promise.all(promises)) {
        let allOthersFee = await OtherFee.findAll({
          courseorclass: courseorclass,
          Session: Session,
          Section: Section,
          ClientCode: req?.user?.ClientCode,
        });

        return respHandler.success(res, {
          status: true,
          msg: "Other Fee Added successfully!!",
          data: allOthersFee,
        });
      }
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Student Not Found!!",
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

const UpdateOtherFee = async (req, res) => {
  try {
    const { othersfeeobj, OtherFeeName, FeeAmount, DuesDate } = req.body;

    let AllOtherfee = await OtherFee.findAll({
      where: {
        Course: othersfeeobj?.Course,
        Session: othersfeeobj?.Session,
        Section: othersfeeobj?.Section,
        ClientCode: req?.user?.ClientCode,
      },
    });

    if (AllOtherfee) {
      const promises = AllOtherfee?.map(async (item) => {
        `1`;
        let result = await OtherFee.update(
          {
            ClientCode: req?.user?.ClientCode,
            studentName: item?.name,
            fathername: item?.fathersName,
            Course: item?.courseorclass,
            fathersid: item?.parentId,
            studentid: item?.id,
            batchname: item?.batch,
            SNO: item?.SrNumber,
            Session: item?.Session,
            Section: item?.Section,
            OtherFeeName: OtherFeeName,
            FeeAmount: FeeAmount,
            DuesDate: DuesDate,
          },
          {
            where: {
              id: item?.id,
              Course: item?.Course,
              Session: item?.Session,
              Section: item?.Section,
              ClientCode: req?.user?.ClientCode,
            },
          }
        );

        return result;
      });

      if (await Promise.all(promises)) {
        let allOthersFee = await OtherFee.findAll({
          Course: othersfeeobj?.Course,
          Session: othersfeeobj?.Session,
          Section: othersfeeobj?.Section,
          ClientCode: req?.user?.ClientCode,
        });

        return respHandler.success(res, {
          status: true,
          msg: "Other Fee Updated Successfully!!",
          data: allOthersFee,
        });
      }
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Other Fee Not Found!!",
        error: [e],
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

const GetOtherFee = async (req, res) => {
  try {
    const { courseorclass, sessionname, sectionname, date } = req.query;

    let whereClause = {};
    let newdate = new Date(date);
    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
    }

    if (courseorclass) {
      whereClause.batch = { [Op.regexp]: `^${courseorclass}.*` };
    }

    if (sectionname) {
      whereClause.Course = { [Op.regexp]: `^${sectionname}.*` };
    }
    if (sessionname) {
      whereClause.Session = { [Op.regexp]: `^${sessionname}.*` };
    }
    // if (newdate) {
    //   whereClause.DuesDate = {newdate};
    // }
    let othersFeelist = await OtherFee.findAll({
      where: whereClause,
      group: ["createdAt"],
    });

    if (othersFeelist) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Other Fee Successfully!!",
        data: othersFeelist,
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

const DeleteOtherFee = async (req, res) => {
  try {
    const { othersfeeobj } = req.body;

    let AllOtherfee = await OtherFee.findAll({
      where: {
        Course: othersfeeobj?.Course,
        Session: othersfeeobj?.Session,
        Section: othersfeeobj?.Section,
        ClientCode: req?.user?.ClientCode,
      },
    });

    if (AllOtherfee) {
      const promises = AllOtherfee?.map(async (item) => {
        let result = await OtherFee.destroy({
          where: {
            id: item?.id,
            Course: item?.Course,
            Session: item?.Session,
            Section: item?.Section,
            ClientCode: req?.user?.ClientCode,
          },
        });

        return result;
      });

      if (await Promise.all(promises)) {
        return respHandler.success(res, {
          status: true,
          msg: "Other Fee Delete Successfully!!",
          data: "",
        });
      }
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Other Fee Not Found!!",
        error: othersfeeobj,
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

///Add school academy Fee
const addOtherFee = async (req, res) => {
  try {
    const { id, acadminArray, studentData, feetype, PayOption, paymentdate } =
      req.body;

    let prefix;

    if (req?.user) {
      prefix = await ReceiptPrefix.findOne({
        where: {
          ClientCode: req?.user?.ClientCode,
        },
      });

      if (prefix) {
        const promises = acadminArray?.map(async (item) => {
          let result = await OtherFee.update(
            {
              PaidStatus: true,
            },
            {
              where: {
                studentid: id,
                id: item?.id,
                ClientCode: req?.user?.ClientCode,
              },
            }
          );
          return result;
        });

        if (await Promise.all(promises)) {
          let studentone = await Student.findOne({
            where: {
              id: id,
            },
          });

          if (studentone) {
            let count = await getClientCount(req);
            let receipno = `${prefix?.receiptPrefix}${count}`;

            let result = await ReceiptData.create({
              ClientCode: req?.user?.ClientCode,
              ReceiptNo: receipno,
              Feetype: feetype,
              PaidDate: paymentdate,
              PaidAmount: acadminArray?.reduce(
                (n, { FeeAmount }) => parseFloat(n) + parseFloat(FeeAmount),
                0
              ),
              RollNo: studentData?.rollnumber,
              studentName: studentData?.name,
              fathername: studentData?.fathersName,
              Course: studentData?.courseorclass,
              fathersid: studentData?.parentId,
              studentid: studentData?.id,
              batchname: studentData?.batch,
              SNO: studentData?.SrNumber,
              Session: studentData?.Session,
              Section: studentData?.Section,
              PayOption: PayOption,
              monthno: new Date(paymentdate).getMonth() + 1,
            });
            if (result) {
              return respHandler.success(res, {
                status: true,
                msg: "Other Fee Added Successfully!!",
                data: result,
              });
            }
          }
        }
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Please Add Receipt Prefix !!",
          error: [""],
        });
      }

      console.log("dd", prefix?.receiptPrefix);
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

///amdin or employee can get all studbnt list
const GetStudentCoachingfee = async (req, res) => {
  try {
    const { studentid } = req.body;
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
      whereClause.id = studentid ? studentid : req?.user?.id;
    }

    let students = await Student.findAll({
      where: whereClause,
      include: [
        {
          model: Coachingfeestatus,
        },
      ],
      order: [["id", "DESC"]],
    });
    if (students) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Student Fee successfully!!",
        data: students,
      });
    }
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};
module.exports = {
  Addstudent,
  getAllStudent,
  getAllStudent,
  getAllStudentCoaching,
  UpdateStudent,
  deleteStudent,
  Loging,
  addfee,
  getReceipt,
  getReceiptCoaching,
  getStudentFee,
  addSchoolFee,
  addHostelFee,
  addTransportFee,
  ChangeSession,
  PaySchoolAnualRegister,
  CreateOtherFee,
  GetOtherFee,
  UpdateOtherFee,
  DeleteOtherFee,
  addOtherFee,
  GetStudentCoachingfee,
};
