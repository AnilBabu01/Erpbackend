const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const Student = require("../Models/student.model");
const Parent = require("../Models/parent.model");
const Coachingfeestatus = require("../Models/coachingfeestatus.model");
const { Coachingfeemon } = require("../Helper/Constant");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
config();

const SECRET = process.env.SECRET;
//admin
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
            rollnumber: rollnumber,
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
            institutename: req.user?.institutename,
          },
        });
        if (user != null) {
          if (req?.files?.profileurl) {
            removefile(`public/upload/${req?.files?.profileurl[0]?.filename}`);
          }

          if (req?.files?.adharcard) {
            removefile(`public/upload/${req?.files?.adharcard[0]?.filename}`);
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
          profileurl: req?.files?.profileurl
            ? `images/${req?.files?.profileurl[0]?.filename}`
            : "",
          adharcard: req?.files?.adharcard
            ? `images/${req?.files?.adharcard[0]?.filename}`
            : "",
          markSheet: req?.files?.markSheet
            ? `images/${req?.files?.markSheet[0]?.filename}`
            : "",
        };

        let createdUser = await Student.create(newUser);
        let data = {
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          studentId: createdUser?.id,
        };
        let fee = await Coachingfeestatus.create(data);
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
          StudentStatus: StudentStatus,
          courseorclass: courseorclass,
          courseorclass: courseorclass,
          studentTotalFee: studentTotalFee,
          permonthfee: permonthfee,
          adharno: adharno,
          pancardnno: pancardnno,
          batch: batch,
          admissionDate: admissionDate,
          profileurl: req?.files?.profileurl
            ? `images/${req?.files?.profileurl[0]?.filename}`
            : "",
          adharcard: req?.files?.adharcard
            ? `images/${req?.files?.adharcard[0]?.filename}`
            : "",
          markSheet: req?.files?.markSheet
            ? `images/${req?.files?.markSheet[0]?.filename}`
            : "",
        };

        let createdUser = await Student.create(newUser);
        let data = {
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          studentId: createdUser?.id,
        };
        let fee = await Coachingfeestatus.create(data);
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
            msg: "Student Added Created Successfully!!",
          });
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
          data: [{ token: token, user: user }],
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
    const { name, batch, fromdate, todate, fathers, studentname } = req.query;

    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
      whereClause.institutename = req.user.institutename;
    }

    if (fromdate && todate) {
      whereClause.admissionDate = { [Op.between]: [from, to] };
    }

    if (name) {
      whereClause.courseorclass = { [Op.regexp]: `^${name}.*` };
    }
    if (batch) {
      whereClause.batch = { [Op.regexp]: `^${batch}.*` };
    }
    if (fathers) {
      whereClause.fathersName = { [Op.regexp]: `^${fathers}.*` };
    }
    if (studentname) {
      whereClause.name = { [Op.regexp]: `^${studentname}.*` };
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
      Status,
      id,
    } = req.body;

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
        courseorclass: courseorclass,
        courseduration: courseduration,
        studentTotalFee: studentTotalFee,
        permonthfee: permonthfee,
        adharno: adharno,
        pancardnno: pancardnno,
        batch: batch,
        admissionDate: admissionDate,
        profileurl: req?.files?.profileurl
          ? `images/${req?.files?.profileurl[0]?.filename}`
          : "",
        adharcard: req?.files?.adharcard
          ? `images/${req?.files?.adharcard[0]?.filename}`
          : "",
        markSheet: req?.files?.markSheet
          ? `images/${req?.files?.markSheet[0]?.filename}`
          : "",
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

const addfee = async (req, res) => {
  try {
    const { id, paymonths } = req.body;

    const promises = paymonths?.map(async (item) => {
      let = key = Coachingfeemon[Number(item)];
      let result = await Coachingfeestatus.update(
        {
          [key]: "Paid",
        },
        {
          where: {
            studentId: id,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
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
            studentone?.paidfee + studentone?.permonthfee * paymonths.length,
        },
        {
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
          },
        }
      );
    }
    if (await Promise.all(promises)) {
      let student = await Student.findOne({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
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
        data: [{ student: student }],
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
  Addstudent,
  getAllStudent,
  getAllStudent,
  UpdateStudent,
  deleteStudent,
  Loging,
  addfee,
};
