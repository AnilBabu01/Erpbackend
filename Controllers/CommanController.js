const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const Employee = require("../Models/employee.model");
const Section = require("../Models/section.model");
const StudentCategory = require("../Models/studentcategory.model");
const Fee = require("../Models/fee.model");
const Client = require("../Models/client.model");
const Course = require("../Models/course.model");
const Employeetype = require("../Models/employeetype.model");
const Departments = require("../Models/depart.model");
const Coursemonth = require("../Models/coursemonth.model");
const Credentials = require("../Models/Credentials.model");
const ReceiptPrefix = require("../Models/receiptprefix.model");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
config();

const SECRET = process.env.SECRET;

const RegisterEmployee = async (req, res) => {
  const {
    name,
    userType,
    email,
    phoneno1,
    phoneno2,
    address,
    city,
    state,
    status,
    pincode,
    joiningdate,
    resigndate,
    empsubject,
    employeetype,
    department,
    fronrofice,
    student,
    accounts,
    HumanResource,
    employeeof,
    master,
    report,
    basicsalary,
    Allowance,
    Deduction,
    TotalSalary,
    AccountHolder,
    AccountNumber,
    BankName,
    Branch,
    IfscCode,
    fronroficeRead,
    fronroficeWrite,
    fronroficeEdit,
    fronroficeDelete,
    studentRead,
    studentWrite,
    studentEdit,
    studentDelete,
    attendance,
    attendanceRead,
    attendanceWrite,
    attendanceEdit,
    attendanceDelete,
    accountsRead,
    accountsWrite,
    accountsEdit,
    accountsDelete,
    HumanResourceRead,
    HumanResourceWrite,
    HumanResourceEdit,
    HumanResourceDelete,
    masterRead,
    masterWrite,
    masterEdit,
    masterDelete,
  } = req.body;

  const genSalt = 10;
  const hash = await bcrypt.hash(req?.user?.Employeepassword, genSalt);

  console.log("profiel img ");
  if (
    req.file != "" ||
    name != "" ||
    email != "" ||
    phoneno1 != "" ||
    phoneno2 != "" ||
    address != "" ||
    city != "" ||
    state != "" ||
    pincode != "" ||
    userType != "" ||
    employeetype != "" ||
    department != ""
  ) {
    try {
      let user = await Employee.findOne({
        where: {
          email: email,
          institutename: req.user.institutename,
          userId: req.user.id,
        },
      });
      if (user != null) {
        return respHandler.error(res, {
          status: false,
          msg: "Email or Mobile Number already exist",
        });
      }
      let newUser = {
        name: name,
        email: email,
        institutename: req.user.institutename,
        organizationtype: req.user.userType,
        ClientCode: req.user.ClientCode,
        userId: req.user.id,
        logourl: req.user.logourl,
        employeeof: employeeof,
        phoneno1: phoneno1,
        phoneno2: phoneno2,
        address: address,
        city: city,
        state: state,
        status: status,
        pincode: pincode,
        password: hash,
        basicsalary: Number(basicsalary),
        Allowance: Number(Allowance),
        Deduction: Number(Deduction),
        TotalSalary: Number(TotalSalary),
        AccountHolder: AccountHolder,
        AccountNumber: AccountNumber,
        BankName: BankName,
        Branch: Branch,
        IfscCode: IfscCode,
        joiningdate: joiningdate,
        resigndate: resigndate,
        empsubject: empsubject,
        employeetype: employeetype,
        department: department,
        fronrofice: fronrofice,
        student: student,
        accounts: accounts,
        HumanResource: HumanResource,
        master: master,
        report: report,
        fronroficeRead: fronroficeRead,
        fronroficeWrite: fronroficeWrite,
        fronroficeEdit: fronroficeEdit,
        fronroficeDelete: fronroficeDelete,
        studentRead: studentRead,
        studentWrite: studentWrite,
        studentEdit: studentEdit,
        studentDelete: studentDelete,
        attendance: attendance,
        attendanceRead: attendanceRead,
        attendanceWrite: attendanceWrite,
        attendanceEdit: attendanceEdit,
        attendanceDelete: attendanceDelete,
        accountsRead: accountsRead,
        accountsWrite: accountsWrite,
        accountsEdit: accountsEdit,
        accountsDelete: accountsDelete,
        HumanResourceRead: HumanResourceRead,
        HumanResourceWrite: HumanResourceWrite,
        HumanResourceEdit: HumanResourceEdit,
        HumanResourceDelete: HumanResourceDelete,
        masterRead: masterRead,
        masterWrite: masterWrite,
        masterEdit: masterEdit,
        masterDelete: masterDelete,
        profileurl: req?.files?.profileurl
          ? `images/${req?.files?.profileurl[0]?.filename}`
          : "",
        ResumeFile: req?.files?.ResumeFile
          ? `images/${req?.files?.ResumeFile[0]?.filename}`
          : req?.user?.profileurl,
        OfferLater: req?.files?.OfferLater
          ? `images/${req?.files?.OfferLater[0]?.filename}`
          : "",
        JoningLater: req?.files?.JoningLater
          ? `images/${req?.files?.JoningLater[0]?.filename}`
          : "",
      };

      let createdUser = await Employee.create(newUser);
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
          data: [{ token: token, user: createdUser }],
          msg: "Employee Account Created Successfully!!",
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

const Logingemployee = async (req, res) => {
  const { email, password } = req.body;
  if (email || password != "") {
    try {
      let user = await Employee.findOne({ where: { email: email } });
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

const DeleteEmployee = async (req, res) => {
  try {
    const { id } = req.body;
    let organization = await Employee.findOne({ where: { id: id } });
    if (organization) {
      removefile(`public/upload/${req?.user?.ResumeFile?.substring(7)}`);

      removefile(`public/upload/${req?.user?.profileurl?.substring(7)}`);

      removefile(`public/upload/${req?.user?.OfferLater?.substring(7)}`);

      removefile(`public/upload/${req?.user?.JoningLater?.substring(7)}`);

      await Employee.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Employee Deleted Successfully!!",
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

const UpdateEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneno1,
      phoneno2,
      address,
      city,
      state,
      status,
      pincode,
      joiningdate,
      resigndate,
      empsubject,
      employeetype,
      department,
      fronrofice,
      student,
      accounts,
      HumanResource,
      employeeof,
      master,
      report,
      basicsalary,
      Allowance,
      Deduction,
      TotalSalary,
      AccountHolder,
      AccountNumber,
      BankName,
      Branch,
      IfscCode,
      fronroficeRead,
      fronroficeWrite,
      fronroficeEdit,
      fronroficeDelete,
      studentRead,
      studentWrite,
      studentEdit,
      studentDelete,
      attendance,
      attendanceRead,
      attendanceWrite,
      attendanceEdit,
      attendanceDelete,
      accountsRead,
      accountsWrite,
      accountsEdit,
      accountsDelete,
      HumanResourceRead,
      HumanResourceWrite,
      HumanResourceEdit,
      HumanResourceDelete,
      masterRead,
      masterWrite,
      masterEdit,
      masterDelete,
      id,
    } = req.body;

    let employees = await Employee.findOne({
      where: {
        id: id,
      },
    });
    if (employees != null) {
      if (req?.files?.ResumeFile) {
        removefile(`public/upload/${req?.user?.ResumeFile?.substring(7)}`);
      }
      if (req?.files?.profileurl) {
        removefile(`public/upload/${req?.user?.profileurl?.substring(7)}`);
      }
      if (req?.files?.OfferLater) {
        removefile(`public/upload/${req?.user?.OfferLater?.substring(7)}`);
      }
      if (req?.files?.JoningLater) {
        removefile(`public/upload/${req?.user?.JoningLater?.substring(7)}`);
      }

      let statuss = await Employee.update(
        {
          name: name,
          email: email,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          organizationtype: req.user.userType,
          userId: req.user.id,
          logourl: req.user.logourl,
          employeeof: employeeof,
          phoneno1: phoneno1,
          phoneno2: phoneno2,
          address: address,
          city: city,
          state: state,
          pincode: pincode,
          // password: hash,
          basicsalary: Number(basicsalary),
          Allowance: Number(Allowance),
          Deduction: Number(Deduction),
          TotalSalary: Number(TotalSalary),
          AccountHolder: AccountHolder,
          AccountNumber: AccountNumber,
          BankName: BankName,
          Branch: Branch,
          IfscCode: IfscCode,
          status: status,
          joiningdate: joiningdate,
          resigndate: resigndate,
          empsubject: empsubject,
          employeetype: employeetype,
          department: department,
          fronrofice: fronrofice,
          student: student,
          accounts: accounts,
          HumanResource: HumanResource,
          master: master,
          report: report,
          fronroficeRead: fronroficeRead,
          fronroficeWrite: fronroficeWrite,
          fronroficeEdit: fronroficeEdit,
          fronroficeDelete: fronroficeDelete,
          studentRead: studentRead,
          studentWrite: studentWrite,
          studentEdit: studentEdit,
          studentDelete: studentDelete,
          attendance: attendance,
          attendanceRead: attendanceRead,
          attendanceWrite: attendanceWrite,
          attendanceEdit: attendanceEdit,
          attendanceDelete: attendanceDelete,
          accountsRead: accountsRead,
          accountsWrite: accountsWrite,
          accountsEdit: accountsEdit,
          accountsDelete: accountsDelete,
          HumanResourceRead: HumanResourceRead,
          HumanResourceWrite: HumanResourceWrite,
          HumanResourceEdit: HumanResourceEdit,
          HumanResourceDelete: HumanResourceDelete,
          masterRead: masterRead,
          masterWrite: masterWrite,
          masterEdit: masterEdit,
          masterDelete: masterDelete,

          profileurl: req?.files?.profileurl
            ? `images/${req?.files?.profileurl[0]?.filename}`
            : req?.user?.profileurl,
          ResumeFile: req?.files?.ResumeFile
            ? `images/${req?.files?.ResumeFile[0]?.filename}`
            : req?.user?.ResumeFile,
          OfferLater: req?.files?.OfferLater
            ? `images/${req?.files?.OfferLater[0]?.filename}`
            : req?.user?.OfferLater,
          JoningLater: req?.files?.JoningLater
            ? `images/${req?.files?.JoningLater[0]?.filename}`
            : req?.user?.JoningLater,
        },
        {
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
          },
        }
      );
      let studentclass = await Employee.findOne({
        where: {
          id: id,
        },
      });

      if (statuss) {
        return respHandler.success(res, {
          status: true,
          msg: "Employee Updated successfully!!",
          data: [studentclass],
        });
      }
      return respHandler.error(res, {
        status: false,
        msg: "Something Went Wrong!!",
        error: [err.message],
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

const Getallemployee = async (req, res) => {
  try {
    const { name, fromdate, todate, status } = req.query;
 
    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
      whereClause.institutename = req.user.institutename;
    }

    if (fromdate) {
      whereClause.joiningdate = { from };
    }

    if (todate) {
      whereClause.resigndate = { to };
    }
    if (status) {
      whereClause.status = { [Op.regexp]: `^${status}.*` };
    }
    if (name) {
      whereClause.name = { [Op.regexp]: `^${name}.*` };
    }

    console.log("query data is ",req.query,whereClause);

    let employees = await Employee.findAll({
      where: whereClause,
    });

    if (employees) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Employee successfully!!",
        data: employees,
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
const Getprofile = async (req, res) => {
  try {
    if (req?.user) {
      let credentailsdata = await Credentials.findOne({
        where: {
          ClientCode: req?.user?.ClientCode,
        },
      });
      if (credentailsdata) {
        return respHandler.success(res, {
          status: true,
          msg: "Credentials fetch successfully!!",
          data: { User: req?.user, CredentailsData: credentailsdata },
        });
      }
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Something Went Wrong!!",
        error: ["Not Found"],
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

const CreateSection = async (req, res) => {
  try {
    const { section } = req.body;
    let sectionv = await Section.findOne({
      where: {
        section: section,
        ClientCode: req.user.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (sectionv) {
      if (sectionv?.section?.toLowerCase() === section.toLowerCase()) {
        return respHandler.error(res, {
          status: false,
          msg: "Something Went Wrong!!",
          error: ["AllReady Exsist !!"],
        });
      }
    }

    let sections = await Section.create({
      ClientCode: req.user?.ClientCode,
      institutename: req.user?.institutename,
      section: section,
    });
    if (sections) {
      return respHandler.success(res, {
        status: true,
        msg: "Section Created successfully!!",
        data: [sections],
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

const UpdateSection = async (req, res) => {
  try {
    const { section, id } = req.body;

    let status = await Section.update(
      {
        section: section,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      }
    );
    let studentclass = await Section.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Section Updated successfully!!",
        data: [studentclass],
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

const getSection = async (req, res) => {
  try {
    let organizations = await Section.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (organizations) {
      return respHandler.success(res, {
        status: true,
        msg: "All Sections successfully!!",
        data: organizations,
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

const DeleteSection = async (req, res) => {
  try {
    const { id } = req.body;
    let organization = await Section.findOne({ where: { id: id } });
    if (organization) {
      await Section.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Section Deleted Successfully!!",
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

const CreateStudentCategory = async (req, res) => {
  try {
    const { category } = req.body;

    console.log("data is ", category);

    let categoryv = await StudentCategory.findOne({
      where: {
        category: category,
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (categoryv) {
      if (categoryv?.category?.toLowerCase() === category.toLowerCase()) {
        return respHandler.error(res, {
          status: false,
          msg: "AllReady Exsist !!",
          error: ["AllReady Exsist !!"],
        });
      }
    }
    let categorys = await StudentCategory.create({
      userId: req.user?.id,
      ClientCode: req.user?.ClientCode,
      institutename: req.user?.institutename,
      category: category,
    });
    if (categorys) {
      return respHandler.success(res, {
        status: true,
        msg: "Student Category  Created successfully!!",
        data: [categorys],
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

const UpdateStudentCategory = async (req, res) => {
  try {
    const { category, id } = req.body;

    let status = await StudentCategory.update(
      {
        category: category,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      }
    );
    let categorys = await StudentCategory.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Category Updated successfully!!",
        data: [categorys],
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

const getStudentCategory = async (req, res) => {
  try {
    let categorys = await StudentCategory.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (categorys) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Category successfully!!",
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

const DeleteStudentCategory = async (req, res) => {
  try {
    const { id } = req.body;
    let categorys = await StudentCategory.findOne({ where: { id: id } });
    if (categorys) {
      await StudentCategory.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Student category Deleted Successfully!!",
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

const CreateFee = async (req, res) => {
  try {
    const {
      adminssionfee,
      Registractionfee,
      feepermonth,
      coursename,
      courseduration,
    } = req.body;
    let feev;

    if (adminssionfee) {
      feev = await Fee.findOne({
        where: {
          coursename: coursename,
          courseduration: courseduration,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
    }
    if (Registractionfee) {
      feev = await Fee.findOne({
        where: {
          coursename: coursename,
          courseduration: courseduration,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
    }

    if (feev) {
      if (feev?.coursename?.toLowerCase() === coursename.toLowerCase()) {
        return respHandler.error(res, {
          status: false,
          msg: "AllReady Exsist !!",
          error: ["AllReady Exsist !!"],
        });
      }
    }
    let fees = await Fee.create({
      ClientCode: req.user?.ClientCode,
      institutename: req.user?.institutename,
      Registractionfee: Registractionfee,
      adminssionfee: adminssionfee,
      feepermonth: feepermonth,
      coursename: coursename,
      courseduration: courseduration,
    });
    if (fees) {
      return respHandler.success(res, {
        status: true,
        msg: "Fees  Created successfully!!",
        data: [fees],
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

const UpdateFee = async (req, res) => {
  try {
    const {
      adminssionfee,
      feepermonth,
      Registractionfee,
      coursename,
      courseduration,
      id,
    } = req.body;

    let status = await Fee.update(
      {
        adminssionfee: adminssionfee,
        feepermonth: feepermonth,
        coursename: coursename,
        Registractionfee: Registractionfee,
        courseduration: courseduration,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      }
    );
    let fees = await Fee.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Fees Updated successfully!!",
        data: [fees],
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

const getFee = async (req, res) => {
  try {
    let categorys = await Fee.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (categorys) {
      return respHandler.success(res, {
        status: true,
        msg: "All Fees successfully!!",
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

const DeleteFee = async (req, res) => {
  try {
    const { id } = req.body;
    let fees = await Fee.findOne({ where: { id: id } });
    if (fees) {
      await Fee.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Fees Deleted Successfully!!",
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

const GetAllCollege = async (req, res) => {
  try {
    let Clients = await Client.findAll({ where: { userType: "college" } });
    if (Clients) {
      return respHandler.success(res, {
        status: true,
        data: Clients,
        msg: "Fetch All College Successfully!!",
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

const GetAllSchool = async (req, res) => {
  try {
    let Clients = await Client.findAll({ where: { userType: "school" } });
    if (Clients) {
      return respHandler.success(res, {
        status: true,
        data: Clients,
        msg: "Fetch All College Successfully!!",
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

const GetAllCoaching = async (req, res) => {
  try {
    let Clients = await Client.findAll({ where: { userType: "institute" } });
    if (Clients) {
      return respHandler.success(res, {
        status: true,
        data: Clients,
        msg: "Fetch All College Successfully!!",
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

const GetAllclient = async (req, res) => {
  try {
    let Clients = await Client.findAll({});
    if (Clients) {
      return respHandler.success(res, {
        status: true,
        data: Clients,
        msg: "Fetch All Client Successfully!!",
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
const updateprofile = async (req, res) => {
  const {
    name,
    userType,
    email,
    Clientname,
    phoneno1,
    phoneno2,
    institutename,
    address,
    city,
    state,
    pincode,
    Sendemail,
    SendemailPassword,
    Studentpassword,
    Employeepassword,
    Parentpassword,
  } = req.body;

  if (
    name != "" ||
    email != "" ||
    Clientname != "" ||
    phoneno1 != "" ||
    phoneno2 != "" ||
    address != "" ||
    city != "" ||
    state != "" ||
    pincode != "" ||
    userType != "" ||
    institutename != "" ||
    SendemailPassword != "" ||
    Sendemail != ""
  ) {
    try {
      let user = await Client.findOne({ where: { id: req.user.id } });

      if (user != null) {
        ``;
        if (req?.files?.logourl) {
          removefile(`public/upload/${req?.user?.logourl?.substring(7)}`);
        }
        if (req?.files?.profileurl) {
          removefile(`public/upload/${req?.user?.profileurl?.substring(7)}`);
        }
        if (req?.files?.certificatelogo) {
          removefile(
            `public/upload/${req?.user?.certificatelogo?.substring(7)}`
          );
        }
        let updateUser = {
          name: name,
          email: email,
          Sendemail: Sendemail,
          SendemailPassword: SendemailPassword,
          Studentpassword: Studentpassword,
          Parentpassword: Parentpassword,
          Employeepassword: Employeepassword,
          Clientname: Clientname,
          phoneno1: phoneno1,
          phoneno2: phoneno2,
          institutename: institutename,
          ClientCode: user?.ClientCode,
          address: address,
          city: city,
          state: state,
          pincode: pincode,
          userType: userType ? userType : user?.userType,
          logourl: req?.files?.logourl
            ? `images/${req?.files?.logourl[0]?.filename}`
            : req?.user?.logourl,
          profileurl: req?.files?.profileurl
            ? `images/${req?.files?.profileurl[0]?.filename}`
            : req?.user?.profileurl,
          certificatelogo: req?.files?.certificatelogo
            ? `images/${req?.files?.certificatelogo[0]?.filename}`
            : req?.user?.profileurl,
        };
        let updateduser = await Client.update(updateUser, {
          where: {
            id: req.user.id,
          },
        });
        if (updateduser) {
          let user = await Client.findOne({
            where: {
              id: req.user.id,
            },
          });
          if (user) {
            return respHandler.success(res, {
              status: true,
              data: [user],
              msg: "Profile Updated Successfully!!",
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
  } else {
    return respHandler.error(res, {
      status: false,
      msg: "All fields are required!!",
    });
  }
};

const updateCredentials = async (req, res) => {
  const {
    name,
    userType,
    email,
    Clientname,
    phoneno1,
    phoneno2,
    institutename,
    address,
    city,
    state,
    pincode,
    Sendemail,
    SendemailPassword,
    Studentpassword,
    Employeepassword,
    Parentpassword,
  } = req.body;

  if (
    name != "" ||
    email != "" ||
    Clientname != "" ||
    phoneno1 != "" ||
    phoneno2 != "" ||
    address != "" ||
    city != "" ||
    state != "" ||
    pincode != "" ||
    userType != "" ||
    institutename != "" ||
    SendemailPassword != "" ||
    Sendemail != ""
  ) {
    try {
      let user = await Credentials.findOne({
        where: { ClientCode: req?.user?.ClientCode },
      });

      console.log("geting error", user?.logourl);

      if (user != null) {
        if (req?.files?.logourl) {
          removefile(`public/upload/${user?.logourl?.substring(7)}`);
        }
        if (req?.files?.profileurl) {
          removefile(`public/upload/${user?.profileurl?.substring(7)}`);
        }
        if (req?.files?.certificatelogo) {
          removefile(`public/upload/${user?.certificatelogo?.substring(7)}`);
        }
        let updateUser = {
          name: name,
          email: email,
          Sendemail: Sendemail,
          SendemailPassword: SendemailPassword,
          Studentpassword: Studentpassword,
          Parentpassword: Parentpassword,
          Employeepassword: Employeepassword,
          Clientname: Clientname,
          phoneno1: phoneno1,
          phoneno2: phoneno2,
          institutename: institutename,
          ClientCode: user?.ClientCode,
          address: address,
          city: city,
          state: state,
          pincode: pincode,
          userType: userType ? userType : user?.userType,
          logourl: req?.files?.logourl
            ? `images/${req?.files?.logourl[0]?.filename}`
            : req?.body?.logourl,
          profileurl: req?.files?.profileurl
            ? `images/${req?.files?.profileurl[0]?.filename}`
            : req?.body?.profileurl,
          certificatelogo: req?.files?.certificatelogo
            ? `images/${req?.files?.certificatelogo[0]?.filename}`
            : req?.body?.certificatelogo,
        };
        let updateduser = await Credentials.update(updateUser, {
          where: {
            ClientCode: req?.user?.ClientCode,
          },
        });
        let updatednormaluser = await Client.update(updateUser, {
          where: {
            ClientCode: req?.user?.ClientCode,
          },
        });
        if ((updateduser, updatednormaluser)) {
          let user = await Credentials.findOne({
            where: {
              ClientCode: req?.user?.ClientCode,
            },
          });
          if (user) {
            return respHandler.success(res, {
              status: true,
              data: [user],
              msg: "Credentials Updated Successfully!!",
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
  } else {
    return respHandler.error(res, {
      status: false,
      msg: "All fields are required!!",
    });
  }
};

const GetCredentials = async (req, res) => {
  try {
    let credentials = await Credentials.findOne({
      where: {
        ClientCode: req?.user?.ClientCode,
      },
    });
    if (credentials) {
      return respHandler.success(res, {
        status: true,
        data: credentials,
        msg: "Fetch credentials Successfully!!",
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
const CreateCourse = async (req, res) => {
  try {
    const { coursename, courseduration } = req.body;

    let coursenamev = await Course.findOne({
      where: {
        coursename: coursename,
        courseduration: courseduration,
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (coursenamev) {
      if (coursenamev?.coursename?.toLowerCase() === coursename.toLowerCase()) {
        return respHandler.error(res, {
          status: false,
          msg: "AllReady Exsist!!",
          error: ["AllReady Exsist !!"],
        });
      }
    }
    let course = await Course.create({
      ClientCode: req.user?.ClientCode,
      institutename: req.user?.institutename,
      courseduration: courseduration,
      coursename: coursename,
    });
    if (course) {
      return respHandler.success(res, {
        status: true,
        msg: "Course Created successfully!!",
        data: [course],
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

const UpdateCourse = async (req, res) => {
  try {
    const { coursename, courseduration, id } = req.body;

    let status = await Course.update(
      {
        coursename: coursename,
        courseduration: courseduration,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      }
    );
    let studentclass = await Course.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Course Updated successfully!!",
        data: [studentclass],
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

const getCourse = async (req, res) => {
  try {
    let organizations = await Course.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (organizations) {
      return respHandler.success(res, {
        status: true,
        msg: "All Course successfully!!",
        data: organizations,
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

const DeleteCourse = async (req, res) => {
  try {
    const { id } = req.body;
    console.log("from delete", id);
    let organization = await Course.findOne({ where: { id: id } });
    if (organization) {
      await Course.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Course Deleted Successfully!!",
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

const CreateDesignation = async (req, res) => {
  try {
    const { employeetype } = req.body;

    let categoryv = await Employeetype.findOne({
      where: {
        employeetype: employeetype,
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (categoryv) {
      if (
        categoryv?.employeetype?.toLowerCase() === employeetype.toLowerCase()
      ) {
        return respHandler.error(res, {
          status: false,
          msg: "AllReady Exsist !!",
          error: ["AllReady Exsist !!"],
        });
      }
    }
    let categorys = await Employeetype.create({
      ClientCode: req.user?.ClientCode,
      institutename: req.user?.institutename,
      employeetype: employeetype,
    });
    if (categorys) {
      return respHandler.success(res, {
        status: true,
        msg: "Designation  Created successfully!!",
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

const UpdateDesignation = async (req, res) => {
  try {
    const { employeetype, id } = req.body;

    let status = await Employeetype.update(
      {
        employeetype: employeetype,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      }
    );
    let categorys = await Employeetype.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Designation Updated successfully!!",
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

const getDesignation = async (req, res) => {
  try {
    let categorys = await Employeetype.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (categorys) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Designation successfully!!",
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

const DeleteDesignation = async (req, res) => {
  try {
    const { id } = req.body;
    let categorys = await Employeetype.findOne({ where: { id: id } });
    if (categorys) {
      await Employeetype.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Designation Deleted Successfully!!",
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

const CreateDepartment = async (req, res) => {
  try {
    const { DepartmentName } = req.body;

    let departments = await Departments.findOne({
      where: {
        DepartmentName: DepartmentName,
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (departments) {
      if (
        departments?.DepartmentName?.toLowerCase() ===
        DepartmentName.toLowerCase()
      ) {
        return respHandler.error(res, {
          status: false,
          msg: "AllReady Exsist !!",
          error: ["AllReady Exsist !!"],
        });
      }
    }
    let department = await Departments.create({
      ClientCode: req.user?.ClientCode,
      institutename: req.user?.institutename,
      DepartmentName: DepartmentName,
    });
    if (department) {
      return respHandler.success(res, {
        status: true,
        msg: "Department Created successfully!!",
        data: department,
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

const UpdateDepartment = async (req, res) => {
  try {
    const { DepartmentName, id } = req.body;

    let status = await Departments.update(
      {
        DepartmentName: DepartmentName,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      }
    );
    let categorys = await Departments.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Department Updated successfully!!",
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

const getDepartment = async (req, res) => {
  try {
    let categorys = await Departments.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (categorys) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Department successfully!!",
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

const DeleteDepartment = async (req, res) => {
  try {
    const { id } = req.body;
    let categorys = await Departments.findOne({ where: { id: id } });
    if (categorys) {
      await Departments.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Department Deleted Successfully!!",
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

const CreateCoursemonth = async (req, res) => {
  try {
    const { noOfMonth } = req.body;

    let coursemonths = await Coursemonth.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (coursemonths.length > 0) {
      return respHandler.error(res, {
        status: false,
        msg: "You Have Allready Added Course Duration !!",
        error: [""],
      });
    }
    let coursemonth = await Coursemonth.create({
      ClientCode: req.user?.ClientCode,
      institutename: req.user?.institutename,
      noOfMonth: noOfMonth,
    });
    if (coursemonth) {
      return respHandler.success(res, {
        status: true,
        msg: "Course Duration In Month Created successfully!!",
        data: coursemonth,
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

const UpdateCoursemonth = async (req, res) => {
  try {
    const { noOfMonth, id } = req.body;

    let status = await Coursemonth.update(
      {
        noOfMonth: noOfMonth,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      }
    );
    let coursemonth = await Coursemonth.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Course Duration Updated successfully!!",
        data: coursemonth,
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

const getCoursemonth = async (req, res) => {
  try {
    let coursemonth = await Coursemonth.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (coursemonth) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Course Duration successfully!!",
        data: coursemonth,
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

const DeleteCoursemonth = async (req, res) => {
  try {
    const { id } = req.body;
    let coursemonth = await Coursemonth.findOne({ where: { id: id } });
    if (coursemonth) {
      await Coursemonth.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Course Duration Deleted Successfully!!",
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

const CreateReceiptPrefix = async (req, res) => {
  try {
    const { receiptPrefix } = req.body;

    let coursemonths = await ReceiptPrefix.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (coursemonths.length > 0) {
      return respHandler.error(res, {
        status: false,
        msg: "You Have Allready Added Receipt Prefix !!",
        error: [""],
      });
    }
    let coursemonth = await ReceiptPrefix.create({
      ClientCode: req.user?.ClientCode,
      institutename: req.user?.institutename,
      receiptPrefix: receiptPrefix,
    });
    if (coursemonth) {
      return respHandler.success(res, {
        status: true,
        msg: "Receipt Prefix Created successfully!!",
        data: coursemonth,
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

const UpdateReceiprefix = async (req, res) => {
  try {
    const { receiptPrefix, id } = req.body;

    let status = await ReceiptPrefix.update(
      {
        receiptPrefix: receiptPrefix,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      }
    );
    let coursemonth = await ReceiptPrefix.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Receipt Prefix Updated successfully!!",
        data: coursemonth,
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

const getReceiptPrefix = async (req, res) => {
  try {
    let coursemonth = await ReceiptPrefix.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (coursemonth) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Receipt Prefix successfully!!",
        data: coursemonth,
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Not Found !!",
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
  Getprofile,
  updateprofile,
  updateCredentials,
  GetCredentials,
  RegisterEmployee,
  Logingemployee,
  CreateSection,
  getSection,
  UpdateSection,
  DeleteSection,
  CreateStudentCategory,
  UpdateStudentCategory,
  getStudentCategory,
  DeleteStudentCategory,
  CreateFee,
  UpdateFee,
  getFee,
  DeleteFee,
  Getallemployee,
  GetAllCoaching,
  GetAllCollege,
  GetAllSchool,
  GetAllclient,
  CreateCourse,
  getCourse,
  UpdateCourse,
  DeleteCourse,
  CreateDesignation,
  getDesignation,
  UpdateDesignation,
  DeleteDesignation,
  CreateDepartment,
  UpdateDepartment,
  getDepartment,
  DeleteDepartment,
  DeleteEmployee,
  UpdateEmployee,
  CreateCoursemonth,
  UpdateCoursemonth,
  getCoursemonth,
  DeleteCoursemonth,
  CreateReceiptPrefix,
  UpdateReceiprefix,
  getReceiptPrefix,
};
