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
const { Coachingfeemon } = require("../Helper/Constant");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
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
            ClientCode: req.user?.ClientCode,
          },
        });
        if (checkrollno != null) {
          return respHandler.error(res, {
            status: false,
            msg: "Roll NO already exist!!",
          });
        }
        let user = await Student.findOne({
          where: {
            email: email,
            name: name,
            phoneno1: phoneno1,
            courseorclass: courseorclass,
            rollnumber: rollnumber,
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

        let createdUser = await Student.create(newUser);
        let fee;
        if (req.user?.userType === "institute") {
          let data = {
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            studentId: createdUser?.id,
          };

          fee = await Coachingfeestatus.create(data);
          var token = jwt.sign(
            {
              id: createdUser.id,
              userType: createdUser.userType,
            },
            SECRET
          );

          if (token) {
            return respHandler.success(res, {
              status: true,
              data: [{ token: token, user: createdUser, fee: fee }],
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
            const promises1 = monthnameAndYaer?.map(async (item, index) => {
              var words = item.split(/\s+/);
              var firstWord = words[0];
              var lastWord = words[words.length - 1];
              console.log(firstWord, lastWord);
              let result = await SchoolFeeStatus.create({
                ClientCode: req.user?.ClientCode,
                studentId: createdUser?.id,
                MonthName: MonthanameArray[index + 1],
                Year: lastWord,
                PerMonthFee: feemonth?.feepermonth,
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
                studentId: createdUser?.id,
                MonthName: MonthanameArray[index + 1],
                Year: lastWord,
                PerMonthFee: createdUser?.HostelPerMonthFee,
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
                studentId: createdUser?.id,
                MonthName: MonthanameArray[index + 1],
                Year: lastWord,
                PerMonthFee: createdUser?.TransportPerMonthFee,
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
                  studentId: createdUser?.id,
                },
              });
              var token = jwt.sign(
                {
                  id: createdUser.id,
                  userType: createdUser.userType,
                },
                SECRET
              );

              if (token) {
                return respHandler.success(res, {
                  status: true,
                  data: [{ token: token, user: createdUser, fee: fee }],
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
          HostelPerMonthFee: HostelPerMonthFee,
          TotalHostelFee: TotalHostelFee,
          TransportPerMonthFee: TransportPerMonthFee,
          TransportTotalHostelFee: TransportTotalHostelFee,
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

        let createdUser = await Student.create(newUser);
        let fee;
        if (req.user?.userType === "institute") {
          let data = {
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
            studentId: createdUser?.id,
          };

          fee = await Coachingfeestatus.create(data);
          var token = jwt.sign(
            {
              id: createdUser.id,
              userType: createdUser.userType,
            },
            SECRET
          );

          if (token) {
            return respHandler.success(res, {
              status: true,
              data: [{ token: token, user: createdUser, fee: fee }],
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
            const promises1 = monthnameAndYaer?.map(async (item, index) => {
              var words = item.split(/\s+/);
              var firstWord = words[0];
              var lastWord = words[words.length - 1];

              let result = await SchoolFeeStatus.create({
                ClientCode: req.user?.ClientCode,
                studentId: createdUser?.id,
                MonthName: MonthanameArray[index + 1],
                Year: lastWord,
                PerMonthFee: feemonth?.feepermonth,
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
                studentId: createdUser?.id,
                MonthName: MonthanameArray[index + 1],
                Year: lastWord,
                PerMonthFee: createdUser?.HostelPerMonthFee,
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
                studentId: createdUser?.id,
                MonthName: MonthanameArray[index + 1],
                Year: lastWord,
                PerMonthFee: createdUser?.TransportPerMonthFee,
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
                  studentId: createdUser?.id,
                },
              });
              var token = jwt.sign(
                {
                  id: createdUser.id,
                  userType: createdUser.userType,
                },
                SECRET
              );

              if (token) {
                return respHandler.success(res, {
                  status: true,
                  data: [{ token: token, user: createdUser, fee: fee }],
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
    } = req.query;

    console.log("geting ", req?.query);

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

    console.log("con", whereClause);

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

      let categorys = await Student.findOne({
        where: {
          id: id,
        },
      });

      if (status) {
        return respHandler.success(res, {
          status: true,
          msg: "Student Updated successfully!!",
          data: categorys,
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
  let count = await ReceiptData.findAll({
    where: {
      ClientCode: req?.user?.ClientCode,
      institutename: req?.user?.institutename,
    },
  });

  return count?.length + 1;
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
            institutename: req?.user?.institutename,
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
            institutename: req?.user?.institutename,
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
                  institutename: req?.user?.institutename,
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

            let result = await ReceiptData.create({
              ClientCode: req?.user?.ClientCode,
              institutename: req?.user?.institutename,
              typeoforganization: req?.user?.institutename,
              ReceiptNo: receipno,
              Feetype: feetype,
              PaidDate: new Date(),
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
    const { fromdate, name, studentname, rollnumber } = req.query;
    let Dates = new Date(fromdate);
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
      whereClause.institutename = req.user.institutename;
    }
    if (fromdate) {
      whereClause.PaidDate = { [Op.regexp]: `^${Dates}.*` };
    }

    if (name) {
      whereClause.Course = { [Op.regexp]: `^${name}.*` };
    }

    if (rollnumber) {
      whereClause.RollNo = { [Op.regexp]: `^${rollnumber}.*` };
    }
    if (studentname) {
      whereClause.studentName = { [Op.regexp]: `^${studentname}.*` };
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
      whereClause.institutename = req.user.institutename;
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
};
