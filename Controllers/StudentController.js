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
const { Coachingfeemon } = require("../Helper/Constant");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
var moment = require("moment");
config();

const SECRET = process.env.SECRET;
//admin
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
    } = req.body;

    const genSalt = 10;
    const hash = await bcrypt.hash(req?.user?.Studentpassword, genSalt);

    let parent = await Parent.findOne({
      where: {
        fathersPhoneNo: fathersPhoneNo,
        fathersName: fathersName,
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
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
          if (req?.files?.profileurl) {
            removefile(`public/upload/${user.profileurl?.substring(7)}`);
          }

          if (req?.files?.adharcard) {
            removefile(`public/upload/${user?.adharcard?.substring(7)}`);
          }

          if (req?.files?.BirthDocument) {
            removefile(`public/upload/${user?.BirthDocument?.substring(7)}`);
          }

          if (req?.files?.othersdoc) {
            removefile(`public/upload/${user?.othersdoc?.substring(7)}`);
          }

          if (req?.files?.markSheet) {
            removefile(`public/upload/${user?.markSheet?.substring(7)}`);
          }

          return respHandler.error(res, {
            status: false,
            msg: "Student already exist",
          });
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
          fathersPhoneNo: fathersPhoneNo,
          fathersName: fathersName,
          MathersName: MathersName,
          rollnumber: rollnumber,
          StudentStatus: StudentStatus,
          markSheetname: markSheetname,
          othersdocName: othersdocName,
          Status: Status,
          StudentCategory: StudentCategory,
          Transport: Transport,
          Library: Library,
          hostal: hostal,
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
          profileurl: req?.files?.profileurl
            ? `images/${req?.files?.profileurl[0]?.filename}`
            : "",
          adharcard: req?.files?.adharcard
            ? `images/${req?.files?.adharcard[0]?.filename}`
            : "",
          markSheet: req?.files?.markSheet
            ? `images/${req?.files?.markSheet[0]?.filename}`
            : "",
          othersdoc: req?.files?.othersdoc
            ? `images/${req?.files?.othersdoc[0]?.filename}`
            : "",
          BirthDocument: req?.files?.BirthDocument
            ? `images/${req?.files?.BirthDocument[0]?.filename}`
            : "",
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
            return respHandler.success(res, {
              status: true,
              data: [{ token: token, user: CreatedStudent, fee: fee }],
              msg: "Student Added Successfully!!",
            });
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
                return respHandler.success(res, {
                  status: true,
                  data: [{ token: token, user: CreatedStudent, fee: fee }],
                  msg: "Student Added Successfully!!",
                });
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
        password: hash1,
        fathersPhoneNo: req.body.fathersPhoneNo,
        fathersName: fathersName,
        MathersName: MathersName,
        profileurl: "",
      };

      let createdParent = await Parent.create(newParent);

      if (createdParent) {
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
          fathersPhoneNo: req.body.fathersPhoneNo,
          fathersName: fathersName,
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
          whatsappNo: whatsappNo,
          HostelPerMonthFee: HostelPerMonthFee,
          TotalHostelFee: TotalHostelFee,
          TransportPerMonthFee: TransportPerMonthFee,
          TransportTotalHostelFee: TransportTotalHostelFee,
          HostelPendingFee: TotalHostelFee,
          TransportPendingFee: TransportTotalHostelFee,
          profileurl: req?.files?.profileurl
            ? `images/${req?.files?.profileurl[0]?.filename}`
            : "",
          adharcard: req?.files?.adharcard
            ? `images/${req?.files?.adharcard[0]?.filename}`
            : "",
          markSheet: req?.files?.markSheet
            ? `images/${req?.files?.markSheet[0]?.filename}`
            : "",
          othersdoc: req?.files?.othersdoc
            ? `images/${req?.files?.othersdoc[0]?.filename}`
            : "",
          BirthDocument: req?.files?.BirthDocument
            ? `images/${req?.files?.BirthDocument[0]?.filename}`
            : "",
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
            return respHandler.success(res, {
              status: true,
              data: [{ token: token, user: CreatedStudent, fee: fee }],
              msg: "Student Added Successfully!!",
            });
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
      let user = await Student.findOne({ where: { rollnumber: rollnumber } });
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
    }
    if (sectionname) {
      whereClause.Section = { [Op.regexp]: `^${sectionname}.*` };
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
    } = req.body;

    let student = await Student.findOne({
      where: {
        id: id,
      },
    });
    if (student) {
      // if (req?.files?.profileurl) {
      //   removefile(`public/upload/${student.profileurl?.substring(7)}`);
      // }

      // if (req?.files?.adharcard) {
      //   removefile(`public/upload/${student?.adharcard?.substring(7)}`);
      // }

      // if (req?.files?.BirthDocument) {
      //   removefile(`public/upload/${student?.BirthDocument?.substring(7)}`);
      // }

      // if (req?.files?.othersdoc) {
      //   removefile(`public/upload/${student?.othersdoc?.substring(7)}`);
      // }

      // if (req?.files?.markSheet) {
      //   removefile(`public/upload/${student?.markSheet?.substring(7)}`);
      // }

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
          profileurl: req?.files?.profileurl
            ? `images/${req?.files?.profileurl[0]?.filename}`
            : req.body.profileurl,
          adharcard: req?.files?.adharcard
            ? `images/${req?.files?.adharcard[0]?.filename}`
            : req.body.profileurl,
          markSheet: req?.files?.markSheet
            ? `images/${req?.files?.markSheet[0]?.filename}`
            : req.body.profileurl,
          othersdoc: req?.files?.othersdoc
            ? `images/${req?.files?.othersdoc[0]?.filename}`
            : req.body.profileurl,
          BirthDocument: req?.files?.BirthDocument
            ? `images/${req?.files?.BirthDocument[0]?.filename}`
            : req.body.profileurl,
        },
        {
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
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

                // if (status) {
                //   return respHandler.success(res, {
                //     status: true,
                //     msg: "Student Updated successfully!!",
                //     data: UpdatedStudent,
                //   });
                // }
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
    let st = await Student.findOne({ where: { id: id } });
    if (st) {
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
    const { id, paymonths, studentData, feetype, discount } = req.body;
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
              PaidDate: moment(new Date()).format("YYYY/MM/DD"),
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
    } = req.query;
    let Dates = new Date(fromdate);
    let whereClause = {};
    console.log("paramers", req.query);
    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
    }
    if (fromdate) {
      whereClause.PaidDate = { Dates };
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
    }

    let receipts = await ReceiptData.findAll({
      where: whereClause,
      // order: [["id", "DESC"]],
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
    const { id, acadminArray, studentData, feetype } = req.body;

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
                PaidDate: moment(Date()).format("YYYY/MM/DD"),
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
    const { id, acadminArray, studentData, feetype } = req.body;

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
                PaidDate: moment(new Date()).format("YYYY/MM/DD"),
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
    const { id, acadminArray, studentData, feetype } = req.body;

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
                PaidDate: moment(new Date()).format("YYYY/MM/DD"),
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
        SrNumber: item?.SrNumber,
        Section: section,
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
    const { id, feetype, annualfee } = req.body;

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
              PaidDate: moment(new Date()).format("YYYY/MM/DD"),
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
    const { id, acadminArray, studentData, feetype } = req.body;

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
              PaidDate: new Date(),
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
module.exports = {
  Addstudent,
  getAllStudent,
  getAllStudent,
  UpdateStudent,
  deleteStudent,
  Loging,
  addfee,
  getReceipt,
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
};
