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
const Session = require("../Models/session.model");
const Subject = require("../Models/Subject.model");
const ClassSubject = require("../Models/classubject.model");
const FooterDetails = require("../Models/footerdetails.model");
const Note = require("../Models/note.model");
const Slider = require("../Models/Slider.model");
const Student = require("../Models/student.model");
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
    empId,
    Allowance1,
    AllowanceAmount1,
    Allowance2,
    AllowanceAmount2,
    Allowance3,
    AllowanceAmount3,
    Deduction1,
    DeductionAmount1,
    Deduction2,
    DeductionAmount2,
    AllowLeave,
    FathersName,
    transport,
    transportRead,
    transportWrite,
    transportEdit,
    transportDelete,
    hostel,
    hostelRead,
    hostelWrite,
    hostelEdit,
    hostelDelete,
    library,
    libraryRead,
    libraryWrite,
    libraryEdit,
    libraryDelete,
  } = req.body;

  const genSalt = 10;
  const hash = await bcrypt.hash(req?.user?.Employeepassword, genSalt);

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
          ClientCode: req.user?.ClientCode,
          userId: req.user.id,
          empId: empId,
        },
      });
      if (user != null) {
        return respHandler.error(res, {
          status: false,
          msg: "Email or Mobile Number Allready exist",
        });
      }
      let user1 = await Employee.findOne({
        where: {
          ClientCode: req.user?.ClientCode,
          userId: req.user.id,
          empId: empId,
        },
      });
      if (user1 != null) {
        return respHandler.error(res, {
          status: false,
          msg: "Empployee Id Allready exist",
        });
      }
      let newUser = {
        name: name,
        email: email,
        institutename: req.user.institutename,
        userType: userType,
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
        Allowance1: Allowance1,
        AllowanceAmount1: AllowanceAmount1,
        Allowance2: Allowance2,
        AllowanceAmount2: AllowanceAmount2,
        Allowance3: Allowance3,
        AllowanceAmount3: AllowanceAmount3,
        Deduction1: Deduction1,
        DeductionAmount1: DeductionAmount1,
        Deduction2: Deduction2,
        DeductionAmount2: DeductionAmount2,
        AllowLeave: AllowLeave,
        FathersName: FathersName,
        empId: empId,
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
        transport: transport,
        transportRead: transportRead,
        transportWrite: transportWrite,
        transportEdit: transportEdit,
        transportDelete: transportDelete,
        hostel: hostel,
        hostelRead: hostelRead,
        hostelWrite: hostelWrite,
        hostelEdit: hostelEdit,
        hostelDelete: hostelDelete,
        library: library,
        libraryRead: libraryRead,
        libraryWrite: libraryWrite,
        libraryEdit: libraryEdit,
        libraryDelete: libraryDelete,
        profileurl: req?.files?.profileurl
          ? `images/${req?.files?.profileurl[0]?.filename}`
          : "",
        Aadharurl: req?.files?.Aadharurl
          ? `images/${req?.files?.Aadharurl[0]?.filename}`
          : req?.user?.profileurl,
        Drivingurl: req?.files?.Drivingurl
          ? `images/${req?.files?.Drivingurl[0]?.filename}`
          : "",
        tenurl: req?.files?.tenurl
          ? `images/${req?.files?.tenurl[0]?.filename}`
          : "",
        twelturl: req?.files?.twelturl
          ? `images/${req?.files?.twelturl[0]?.filename}`
          : req?.user?.profileurl,
        Graduationurl: req?.files?.Graduationurl
          ? `images/${req?.files?.Graduationurl[0]?.filename}`
          : "",
        PostGraduationurl: req?.files?.PostGraduationurl
          ? `images/${req?.files?.PostGraduationurl[0]?.filename}`
          : "",
        Certificate1url: req?.files?.Certificate1url
          ? `images/${req?.files?.Certificate1url[0]?.filename}`
          : req?.user?.profileurl,
        Certificate2url: req?.files?.Certificate2url
          ? `images/${req?.files?.Certificate2url[0]?.filename}`
          : "",
        Certificate3url: req?.files?.Certificate3url
          ? `images/${req?.files?.Certificate3url[0]?.filename}`
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
      empId,
      Allowance1,
      AllowanceAmount1,
      Allowance2,
      AllowanceAmount2,
      Allowance3,
      AllowanceAmount3,
      Deduction1,
      DeductionAmount1,
      Deduction2,
      DeductionAmount2,
      AllowLeave,
      FathersName,
      transport,
      transportRead,
      transportWrite,
      transportEdit,
      transportDelete,
      hostel,
      hostelRead,
      hostelWrite,
      hostelEdit,
      hostelDelete,
      library,
      libraryRead,
      libraryWrite,
      libraryEdit,
      libraryDelete,
      userType,
    } = req.body;

    let employees = await Employee.findOne({
      where: {
        id: id,
      },
    });
    if (employees != null) {
      if (req?.files?.profileurl) {
        removefile(`public/upload/${employees?.profileurl?.substring(7)}`);
      }
      if (req?.files?.Aadharurl) {
        removefile(`public/upload/${employees?.OfferLater?.substring(7)}`);
      }
      if (req?.files?.Drivingurl) {
        removefile(`public/upload/${employees?.JoningLater?.substring(7)}`);
      }
      if (req?.files?.tenurl) {
        removefile(`public/upload/${employees?.JoningLater?.substring(7)}`);
      }
      if (req?.files?.twelturl) {
        removefile(`public/upload/${employees.OfferLater?.substring(7)}`);
      }
      if (req?.files?.Graduationurl) {
        removefile(`public/upload/${employees?.JoningLater?.substring(7)}`);
      }
      if (req?.files?.PostGraduationurl) {
        removefile(`public/upload/${employees?.JoningLater?.substring(7)}`);
      }
      if (req?.files?.Certificate1url) {
        removefile(`public/upload/${employees?.OfferLater?.substring(7)}`);
      }
      if (req?.files?.Certificate2url) {
        removefile(`public/upload/${employees?.JoningLater?.substring(7)}`);
      }
      if (req?.files?.Certificate2url) {
        removefile(`public/upload/${employees?.JoningLater?.substring(7)}`);
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
          Allowance1: Allowance1,
          AllowanceAmount1: AllowanceAmount1,
          Allowance2: Allowance2,
          AllowanceAmount2: AllowanceAmount2,
          Allowance3: Allowance3,
          AllowanceAmount3: AllowanceAmount3,
          Deduction1: Deduction1,
          DeductionAmount1: DeductionAmount1,
          Deduction2: Deduction2,
          DeductionAmount2: DeductionAmount2,
          AllowLeave: AllowLeave,
          FathersName: FathersName,
          empId: empId,
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
          transport: transport,
          transportRead: transportRead,
          transportWrite: transportWrite,
          transportEdit: transportEdit,
          transportDelete: transportDelete,
          hostel: hostel,
          hostelRead: hostelRead,
          hostelWrite: hostelWrite,
          hostelEdit: hostelEdit,
          hostelDelete: hostelDelete,
          library: library,
          libraryRead: libraryRead,
          libraryWrite: libraryWrite,
          libraryEdit: libraryEdit,
          libraryDelete: libraryDelete,
          userType: userType,
          profileurl: req?.files?.profileurl
            ? `images/${req?.files?.profileurl[0]?.filename}`
            : req?.user?.profileurl,
          Aadharurl: req?.files?.Aadharurl
            ? `images/${req?.files?.Aadharurl[0]?.filename}`
            : req?.user?.Aadharurl,
          Drivingurl: req?.files?.Drivingurl
            ? `images/${req?.files?.Drivingurl[0]?.filename}`
            : req?.user?.Drivingurl,
          JonitenurlngLater: req?.files?.tenurl
            ? `images/${req?.files?.tenurl[0]?.filename}`
            : req?.user?.tenurl,

          twelturl: req?.files?.twelturl
            ? `images/${req?.files?.twelturl[0]?.filename}`
            : req?.user?.twelturl,
          Graduationurl: req?.files?.Graduationurl
            ? `images/${req?.files?.Graduationurl[0]?.filename}`
            : req?.user?.Graduationurl,
          PostGraduationurl: req?.files?.tenurl
            ? `images/${req?.files?.PostGraduationurl[0]?.filename}`
            : req?.user?.PostGraduationurl,

          Certificate1url: req?.files?.Certificate1url
            ? `images/${req?.files?.Certificate1url[0]?.filename}`
            : req?.user?.Certificate1url,
          Certificate2url: req?.files?.Certificate2url
            ? `images/${req?.files?.Certificate2url[0]?.filename}`
            : req?.user?.Certificate2url,
          Certificate3url: req?.files?.Certificate3url
            ? `images/${req?.files?.Certificate3url[0]?.filename}`
            : req?.user?.Certificate3url,
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
    const {
      name,
      fromdate,
      todate,
      status,
      empId,
      empdeparment,
      empdesination,
    } = req.query;
    console.log(req.query);
    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
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

    if (empId) {
      whereClause.empId = { [Op.regexp]: `^${empId}.*` };
    }
    if (empdeparment) {
      whereClause.department = { [Op.regexp]: `^${empdeparment}.*` };
    }

    if (empdesination) {
      whereClause.employeeof = { [Op.regexp]: `^${empdesination}.*` };
    }

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
    Library,
    Transport,
    hostel,
    FrontOffice,
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
        // if (req?.files?.logourl) {
        //   removefile(`public/upload/${user?.logourl?.substring(7)}`);
        // }
        // if (req?.files?.profileurl) {
        //   removefile(`public/upload/${user?.profileurl?.substring(7)}`);
        // }
        // if (req?.files?.certificatelogo) {
        //   removefile(`public/upload/${user?.certificatelogo?.substring(7)}`);
        // }
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
          Library: Library,
          Transport: Transport,
          hostel: hostel,
          FrontOffice: FrontOffice,
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

const CreateSection = async (req, res) => {
  try {
    const { section } = req.body;
    let sectionv = await Section.findOne({
      where: {
        section: section,
        ClientCode: req.user.ClientCode,
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

const CreateSession = async (req, res) => {
  try {
    const { session } = req.body;
    let sectionv = await Session.findOne({
      where: {
        Session: session,
        ClientCode: req.user.ClientCode,
      },
    });
    if (sectionv) {
      if (sectionv?.Session?.toLowerCase() === session.toLowerCase()) {
        return respHandler.error(res, {
          status: false,
          msg: "AlReady Exists!!",
          error: ["AlReady Exsist !!"],
        });
      }
    }

    let sections = await Session.create({
      ClientCode: req.user?.ClientCode,
      Session: session,
    });
    if (sections) {
      return respHandler.success(res, {
        status: true,
        msg: "Session Created successfully!!",
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

const UpdateSession = async (req, res) => {
  try {
    const { session, id } = req.body;

    let status = await Session.update(
      {
        Session: session,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );
    let studentclass = await Session.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Session Updated successfully!!",
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

const getSession = async (req, res) => {
  try {
    let organizations = await Session.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
      },
    });
    if (organizations) {
      return respHandler.success(res, {
        status: true,
        msg: "All Sessions successfully!!",
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

const DeleteSession = async (req, res) => {
  try {
    const { id } = req.body;
    let organization = await Session.findOne({ where: { id: id } });
    if (organization) {
      await Session.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Session Deleted Successfully!!",
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

const CreateSubject = async (req, res) => {
  try {
    const { dayname, subject, starttime, endtime, classId, empID, section } =
      req.body;
    let isteacherAvailability = await Subject.findAll({
      where: {
        section: section,
        dayname: dayname,
        empID: empID,
        starttime: starttime,
        endtime: endtime,
        ClientCode: req.user?.ClientCode,
      },
    });
    if (isteacherAvailability?.length > 0) {
      return respHandler.error(res, {
        status: false,
        msg: "Already Assigned This Time Slot!!",
        error: [""],
      });
    } else {
      let issubject = await Subject.findOne({
        where: {
          section: section,
          dayname: dayname,
          subject: subject,
          starttime: starttime,
          endtime: endtime,
          classId: classId,
          empID: empID,
          ClientCode: req.user.ClientCode,
        },
      });
      if (issubject) {
        if (issubject?.subject?.toLowerCase() === subject.toLowerCase()) {
          return respHandler.error(res, {
            status: false,
            msg: "AlReady Exist!!",
            error: ["AllReady Exsist !!"],
          });
        }
      }

      let subjects = await Subject.create({
        section: section,
        dayname: dayname,
        subject: subject,
        starttime: starttime,
        endtime: endtime,
        classId: classId,
        empID: empID,
        ClientCode: req.user.ClientCode,
      });
      if (subjects) {
        return respHandler.success(res, {
          status: true,
          msg: "Subject Added successfully!!",
          data: subjects,
        });
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Something Went Wrong!!",
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

const UpdateSubject = async (req, res) => {
  try {
    const {
      dayname,
      subject,
      starttime,
      endtime,
      classId,
      empID,
      id,
      section,
    } = req.body;

    let isteacherAvailability = await Subject.findAll({
      where: {
        section: section,
        dayname: dayname,
        empID: empID,
        starttime: starttime,
        endtime: endtime,
        ClientCode: req.user?.ClientCode,
      },
    });
    if (isteacherAvailability?.length > 0) {
      return respHandler.error(res, {
        status: false,
        msg: "Already Assigned This Time Slot!!",
        error: [""],
      });
    } else {
      let status = await Subject.update(
        {
          dayname: dayname,
          subject: subject,
          starttime: starttime,
          endtime: endtime,
          classId: classId,
          empID: empID,
        },
        {
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
          },
        }
      );

      if (status) {
        let issubject = await Subject.findOne({
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
          },
        });
        return respHandler.success(res, {
          status: true,
          msg: "Subject Updated successfully!!",
          data: issubject,
        });
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Something Went Wrong!!",
          error: [err.message],
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

const GetSubject = async (req, res) => {
  try {
    let result = [];
    const { classId, empID, dayname } = req.query;
    let whereClause = {};
    console.log("data is data ", req.query);
    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }
    if (classId) {
      whereClause.classId = classId;
    }
    if (empID) {
      whereClause.empID = empID;
    }
    if (dayname) {
      whereClause.dayname = dayname;
    }

    let Allsubject = await Subject.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
    });

    if (Allsubject) {
      const promises = Allsubject?.map(async (item) => {
        let classname = await Course.findOne({
          where: {
            id: item?.classId,
            ClientCode: req?.user?.ClientCode,
          },
        });
        let empname = await Employee.findOne({
          where: {
            id: item?.empID,
            ClientCode: req?.user?.ClientCode,
          },
        });

        if (classname && empname) {
          result.push({
            subject: item,
            classname: classname,
            empname: empname,
          });
        }
        return 1;
      });

      if (await Promise.all(promises)) {
        return respHandler.success(res, {
          status: true,
          msg: "Fetch All Subject Successfully!!",
          data: result,
        });
      }
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

const DeleteSubject = async (req, res) => {
  try {
    const { id } = req.body;
    let issubject = await Subject.findOne({ where: { id: id } });
    if (issubject) {
      await Subject.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Subject Deleted Successfully!!",
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

const CreateClassSubject = async (req, res) => {
  try {
    const { Subject } = req.body;
    let sectionv = await ClassSubject.findOne({
      where: {
        Subject: Subject,
        ClientCode: req.user.ClientCode,
      },
    });
    if (sectionv) {
      if (sectionv?.Subject?.toLowerCase() === Subject.toLowerCase()) {
        return respHandler.error(res, {
          status: false,
          msg: "AlReady Exists!!",
          error: ["AlReady Exsist !!"],
        });
      }
    }

    let sections = await ClassSubject.create({
      ClientCode: req.user?.ClientCode,
      Subject: Subject,
    });
    if (sections) {
      return respHandler.success(res, {
        status: true,
        msg: "Subject Created successfully!!",
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

const UpdateClassSubject = async (req, res) => {
  try {
    const { Subject, id } = req.body;

    let status = await ClassSubject.update(
      {
        Subject: Subject,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );
    let studentclass = await ClassSubject.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Subject Updated successfully!!",
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

const getClassSubject = async (req, res) => {
  try {
    let organizations = await ClassSubject.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
      },
    });
    if (organizations) {
      return respHandler.success(res, {
        status: true,
        msg: "All Subject successfully!!",
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

const DeleteClassSubject = async (req, res) => {
  try {
    const { id } = req.body;
    let organization = await ClassSubject.findOne({ where: { id: id } });
    if (organization) {
      await ClassSubject.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Subject Deleted Successfully!!",
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

const GetEmpTimeTable = async (req, res) => {
  try {
    let result = [];
    let emptimetable = await Subject.findAll({
      where: {
        empID: req.user?.id,
        ClientCode: req.user?.ClientCode,
      },
    });
    if (emptimetable) {
      const promises = emptimetable?.map(async (item) => {
        let classname = await Course.findOne({
          where: {
            id: item?.classId,
            ClientCode: req?.user?.ClientCode,
          },
        });

        if (classname) {
          result.push({
            subject: item,
            classname: classname,
          });
        }
        return 1;
      });

      if (await Promise.all(promises)) {
        return respHandler.success(res, {
          status: true,
          msg: "Fetch Emp Time Table Successfully!!",
          data: result,
        });
      }
    } else {
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

const CreateBanner = async (req, res) => {
  try {
    const { Notestext } = req.body;
    let sectionv = await Note.findOne({
      where: {
        Notestext: Notestext,
        ClientCode: req.user.ClientCode,
      },
    });
    if (sectionv) {
      if (sectionv?.Notestext?.toLowerCase() === Notestext.toLowerCase()) {
        return respHandler.error(res, {
          status: false,
          msg: "AlReady Exists!!",
          error: ["AlReady Exsist !!"],
        });
      }
    }

    let sections = await Note.create({
      ClientCode: req.user?.ClientCode,
      Notestext: Notestext,
    });
    if (sections) {
      return respHandler.success(res, {
        status: true,
        msg: "Notes Created successfully!!",
        data: sections,
      });
    } else {
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

const UpdateBanner = async (req, res) => {
  try {
    const { Notestext, id } = req.body;

    let status = await Note.update(
      {
        Notestext: Notestext,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );
    let studentclass = await Note.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Notes Updated successfully!!",
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

const getBanner = async (req, res) => {
  try {
    let organizations = await Note.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
      },
    });
    if (organizations) {
      return respHandler.success(res, {
        status: true,
        msg: "All Notes successfully!!",
        data: organizations,
      });
    } else {
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

const DeleteBanner = async (req, res) => {
  try {
    const { id } = req.body;
    let organization = await Note.findOne({ where: { id: id } });
    if (organization) {
      await Note.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Note Deleted Successfully!!",
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

const CreateFooterDtails = async (req, res) => {
  try {
    const {
      facilitycontent,
      facebookurl,
      instagramurl,
      twiterurl,
      linkldlurl,
      ChairmanContactNo,
      PrincipalContactNo,
      Email,
      Mapurl,
    } = req.body;

    let coursemonths = await FooterDetails.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
      },
    });
    if (coursemonths.length > 0) {
      return respHandler.error(res, {
        status: false,
        msg: "Already Added Footer Details!!",
        error: [""],
      });
    }

    let sections = await FooterDetails.create({
      facilitycontent: facilitycontent,
      facebookurl: facebookurl,
      instagramurl: instagramurl,
      twiterurl: twiterurl,
      linkldlurl: linkldlurl,
      ChairmanContactNo: ChairmanContactNo,
      PrincipalContactNo: PrincipalContactNo,
      Email: Email,
      Mapurl: Mapurl,
      ClientCode: req.user?.ClientCode,
    });
    if (sections) {
      return respHandler.success(res, {
        status: true,
        msg: "Footer Details Added successfully!!",
        data: sections,
      });
    } else {
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

const UpdateFooterDtails = async (req, res) => {
  try {
    const {
      facilitycontent,
      facebookurl,
      instagramurl,
      twiterurl,
      linkldlurl,
      ChairmanContactNo,
      PrincipalContactNo,
      Email,
      Mapurl,
      id,
    } = req.body;

    let status = await FooterDetails.update(
      {
        facilitycontent: facilitycontent,
        facebookurl: facebookurl,
        instagramurl: instagramurl,
        twiterurl: twiterurl,
        linkldlurl: linkldlurl,
        ChairmanContactNo: ChairmanContactNo,
        PrincipalContactNo: PrincipalContactNo,
        Email: Email,
        Mapurl: Mapurl,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );
    let studentclass = await FooterDetails.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Footer Details Updated successfully!!",
        data: [studentclass],
      });
    } else {
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

const getFooterDtails = async (req, res) => {
  try {
    let organizations = await FooterDetails.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
      },
    });
    if (organizations) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Footer Details Successfully!!",
        data: organizations,
      });
    } else {
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

const DeleteFooterDtails = async (req, res) => {
  try {
    const { id } = req.body;
    let organization = await FooterDetails.findOne({ where: { id: id } });
    if (organization) {
      await FooterDetails.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Footer Details Deleted Successfully!!",
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

const CreateSlider = async (req, res) => {
  let { Dec } = req.body;
  try {
    let Sliderimg = await Slider.create({
      ClientCode: req.user?.ClientCode,
      Dec: Dec,
      ImgUrl: req?.files?.ImgUrl
        ? `images/${req?.files?.ImgUrl[0]?.filename}`
        : "",
    });

    if (Sliderimg) {
      return respHandler.success(res, {
        status: true,
        data: Sliderimg,
        msg: "Slider Added Successfully!!",
      });
    } else {
      // removefile(`public/upload/${req?.files?.ImgUrl[0]?.filename}`);
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

const GetSlider = async (req, res) => {
  try {
    let Allsliderimg = await Slider.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
      },
    });
    if (Allsliderimg) {
      return respHandler.success(res, {
        status: true,
        data: Allsliderimg,
        msg: "Fetch All Slider Successfully!!",
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

const updateSlider = async (req, res) => {
  let { id, Dec, ImgUrl } = req.body;

  try {
    let isSlider = await Slider.findOne({
      where: {
        id: id,
      },
    });
    if (removefile(`public/upload/${isSlider?.ImgUrl?.substring(7)}`)) {
      let status = await Slider.update(
        {
          Dec: Dec,
          ImgUrl: req?.files?.ImgUrl
            ? `images/${req?.files?.ImgUrl[0]?.filename}`
            : req?.user?.ImgUrl,
        },
        {
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
          },
        }
      );

      if (status) {
        let sliders = await Slider.findOne({
          where: {
            id: id,
          },
        });
        if (sliders) {
          return respHandler.success(res, {
            status: true,
            data: sliders,
            msg: "Slider Updated Successfully!!",
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

const DeleteSlider = async (req, res) => {
  try {
    let { id } = req.body;
    let isdlider = await Slider.findOne({ id: id });

    if (isdlider) {
      removefile(`public/upload/${isdlider?.ImgUrl.substring(7)}`);
      let status = await Slider.destroy({
        where: {
          id: isdlider.id,
        },
      });
      if (status) {
        return respHandler.success(res, {
          status: true,
          data: [],
          msg: "Slider Deleted Successfully!!",
        });
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Something Went Wrong!!",
          error: ["not found"],
        });
      }
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

const GetStudentTimeTable = async (req, res) => {
  try {
    let result = [];
    let isclass = await Course.findOne({
      where: {
        coursename: req.user?.courseorclass,
        ClientCode: req.user?.ClientCode,
      },
    });
    if (isclass) {
      let emptimetable = await Subject.findAll({
        where: {
          classId: isclass?.id,
          ClientCode: req.user?.ClientCode,
        },
      });
      if (emptimetable) {
        const promises = emptimetable?.map(async (item) => {
          let classname = await Course.findOne({
            where: {
              id: item?.classId,
              ClientCode: req?.user?.ClientCode,
            },
          });
          let employee = await Employee.findOne({
            where: {
              id: item?.empID,
              ClientCode: req?.user?.ClientCode,
            },
          });

          if (classname && employee) {
            result.push({
              subject: item,
              classname: classname,
              employee: employee,
            });
          }
          return 1;
        });

        if (await Promise.all(promises)) {
          return respHandler.success(res, {
            status: true,
            msg: "Fetch Emp Time Table Successfully!!",
            data: result,
          });
        }
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Something Went Wrong!!",
          error: [err.message],
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

const GetParentStudentList = async (req, res) => {
  try {
    let studentlist = await Student.findAll({
      where: {
        parentId: req.user?.id,
        ClientCode: req.user?.ClientCode
      },
    });
    if (studentlist) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Student Successfully!!",
        data: studentlist,
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
  CreateSession,
  UpdateSession,
  getSession,
  DeleteSession,
  CreateSubject,
  UpdateSubject,
  GetSubject,
  DeleteSubject,
  CreateClassSubject,
  getClassSubject,
  DeleteClassSubject,
  UpdateClassSubject,
  GetEmpTimeTable,
  CreateBanner,
  UpdateBanner,
  DeleteBanner,
  getBanner,
  CreateFooterDtails,
  UpdateFooterDtails,
  DeleteFooterDtails,
  getFooterDtails,
  CreateSlider,
  updateSlider,
  GetSlider,
  DeleteSlider,
  GetStudentTimeTable,
  GetParentStudentList,
};
