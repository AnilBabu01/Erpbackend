const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const Client = require("../Models/client.model");
const Credentials = require("../Models/Credentials.model");
const Enquiry = require("../Models/enquiry.model");
const Batch = require("../Models/batch.model");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
const axios = require("axios");
config();

const SECRET = process.env.SECRET;
getClientCount = async () => {
  let count = await Client.count({
    distinct: true,
    col: "institutename",
  });

  return count;
};
const Register = async (req, res) => {
  const {
    name,
    userType,
    email,
    Clientname,
    phoneno1,
    phoneno2,
    typeoforganization,
    institutename,
    address,
    city,
    state,
    pincode,
    password,
  } = req.body;

  // if (!req.files.profileurl || !req.files.logourl) {
  //   return respHandler.error(res, {
  //     status: false,
  //     msg: "Error in file uploading",
  //   });
  // }
  const genSalt = 10;
  const hash = await bcrypt.hash(password, genSalt);
  var val = Math.floor(1000 + Math.random() * 9000);
  let mess = `Hello ${name} \n Thankyou for registering in instaphantom \n Your OTP is: ${val}`;
  const MsgUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=CgS6KLa6FZIWC4rGhHqjXUuBqaxaPbHxxgM8NItmRKFtJx1ncwGkmM1NqPEV&route=v3&sender_id=Cghpet&message=${mess}&language=english&flash=0&numbers=${phoneno1}`;

  let clients = await getClientCount();
  let clientID = `CNO-${clients + 900}`;
  if (
    name != "" ||
    email != "" ||
    password != "" ||
    Clientname != "" ||
    phoneno1 != "" ||
    phoneno2 != "" ||
    institutename != "" ||
    typeoforganization != "" ||
    address != "" ||
    city != "" ||
    state != "" ||
    pincode != "" ||
    userType != ""
  ) {
    try {
      let user = await Client.findOne({ where: { email: email } });
      if (user != null) {
        // removefile(`public/upload/${req.files.logourl[0].filename}`);
        // removefile(`public/upload/${req.files.profileurl[0].filename}`);
        return respHandler.error(res, {
          status: false,
          msg: "Email or Mobile Number already exist",
        });
      }
      let newUser = {
        name: name,
        email: email,
        Clientname: Clientname,
        phoneno1: phoneno1,
        phoneno2: phoneno2,
        institutename: institutename,
        ClientCode: clientID,
        typeoforganization: typeoforganization,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        password: hash,
        userType: userType,
        // logourl: `images/${req.files.logourl[0].filename}`,
        // profileurl: `images/${req.files.profileurl[0].filename}`,
      };

      let createdUser = await Client.create(newUser);
      let clientdata = await Credentials.create(newUser);

      var token = jwt.sign(
        {
          id: createdUser.id,
          userType: createdUser.userType,
        },
        SECRET
      );
      if (token) {
        axios
          .get(MsgUrl)
          .then(function (response) {
            // handle success
            return respHandler.success(res, {
              status: true,
              msg: "Coaching Account Created Successfully!!",
              data: [{ User: createdUser, CollegeDetails: clientdata }],
            });
          })
          .catch(function (error) {
            // handle error
            console.log(error);
            return respHandler.error(res, {
              status: false,
              msg: error.message,
              error: [error.message],
            });
          });
        // return respHandler.success(res, {
        //   status: true,
        //   data: [{ token: token, user: createdUser }],
        //   msg: "Client Account Created Successfully!!",
        // });
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

const Loging = async (req, res) => {
  const { email, password, institutename } = req.body;
  console.log('from coaching login ',email,password,institutename);
  if (email || password != "") {
    let last = institutename.split(" ").pop();
    var lastIndex = institutename?.lastIndexOf(" ");
    let first = institutename.substring(0, lastIndex);
    if (first && last) {
      try {
        let user = await Client.findOne({
          where: {
            email: email,
            institutename: first,
            ClientCode: last,
          },
        });
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
    }
  } else {
    return respHandler.error(res, {
      status: false,
      msg: "All fields are required!!",
    });
  }
};

const Addenquiry = async (req, res) => {
  const {
    EnquiryDate,
    StudentName,
    StudentNumber,
    StudentEmail,
    Address,
    Course,
    Comment,
  } = req.body;

  if (EnquiryDate != "" || EnquiryDate != "") {
    try {
      let enquiry = await Enquiry.findOne({
        where: {
          EnquiryDate: EnquiryDate,
          StudentName: StudentName,
          StudentNumber: StudentNumber,
          StudentEmail: StudentEmail,
          Address: Address,
          Course: Course,
          Comment: Comment,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      if (enquiry) {
        return respHandler.error(res, {
          status: false,
          msg: "Enquiry is allready exist with these detials!!",
        });
      }
      const enquiry1 = await Enquiry.create({
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
        EnquiryDate: EnquiryDate,
        StudentName: StudentName,
        StudentNumber: StudentNumber,
        StudentEmail: StudentEmail,
        Address: Address,
        Course: Course,
        Comment: Comment,
      });
      if (enquiry1) {
        return respHandler.success(res, {
          status: true,
          msg: "Enquiry Created successfully!!",
          data: enquiry1,
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
  } else {
    return respHandler.error(res, {
      status: false,
      msg: "All fields are required!!",
    });
  }
};

const Getallenquuiry = async (req, res) => {
  try {
    const { page, limit, fromdate, todate, name } = req.query;
    let enquiries;
    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);
    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
      whereClause.institutename = req.user.institutename;
    }

    if (fromdate && todate) {
      whereClause.EnquiryDate = { [Op.between]: [from, to] };
    }

    if (name) {
      whereClause.StudentName = { [Op.regexp]: `^${name}.*` };
    }

    if (limit && page) {
      const Limit = Number(limit);
      const Page = Number(page);
      const skip = (Page - 1) * Limit;
      enquiries = await Enquiry.findAll({
        limit: Limit,
        offset: skip,
        where: whereClause,
        order: [["EnquiryDate", "DESC"]],
      });
    } else {
      enquiries = await Enquiry.findAll({
        where: whereClause,
        order: [["EnquiryDate", "DESC"]],
      });
    }

    if (enquiries) {
      return respHandler.success(res, {
        status: true,
        msg: "Enquiry Fetch successfully!!",
        data: enquiries,
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

const UpdateEnquiry = async (req, res) => {
  try {
    const {
      EnquiryDate,
      StudentName,
      StudentNumber,
      StudentEmail,
      Address,
      Course,
      Comment,
      id,
    } = req.body;

    let status = await Enquiry.update(
      {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
        EnquiryDate: EnquiryDate,
        StudentName: StudentName,
        StudentNumber: StudentNumber,
        StudentEmail: StudentEmail,
        Address: Address,
        Course: Course,
        Comment: Comment,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      }
    );
    let enquiry = await Enquiry.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Enquiry Updated successfully!!",
        data: enquiry,
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

const DeleteEnquiry = async (req, res) => {
  try {
    const { id } = req.body;
    let enquiry = await Enquiry.findOne({
      where: {
        id: id,
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (enquiry) {
      await Enquiry.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Enquiry Deleted Successfully!!",
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

const Addbatch = async (req, res) => {
  try {
    const { StartingTime, EndingTime } = req.body;

    let batch = await Batch.findOne({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
        StartingTime: StartingTime,
        EndingTime: EndingTime,
      },
    });

    if (batch) {
      return respHandler.error(res, {
        status: false,
        msg: "AllReady Exsist!!",
        error: [],
      });
    } else {
      let status = await Batch.create({
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
        StartingTime: StartingTime,
        EndingTime: EndingTime,
      });
      if (status) {
        return respHandler.success(res, {
          status: true,
          data: status,
          msg: "Batch Created Successfully!!",
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

const Getbatch = async (req, res) => {
  try {
    let batch = await Batch.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });
    if (!batch) {
      return respHandler.error(res, {
        status: false,
        msg: "Not Found !!",
        error: [],
      });
    } else {
      return respHandler.success(res, {
        status: true,
        data: batch,
        msg: "Fetch Batch Successfully!!",
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
const Updatebatch = async (req, res) => {
  try {
    const { id, StartingTime, EndingTime } = req.body;
    let batch = await Batch.findOne({
      ClientCode: req.user?.ClientCode,
      institutename: req.user?.institutename,
    });
    if (!batch) {
      return respHandler.error(res, {
        status: false,
        msg: "Not Found !!",
        error: [],
      });
    } else {
      let status = await Batch.update(
        {
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
          StartingTime: StartingTime,
          EndingTime: EndingTime,
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
        let batch = await Batch.findOne({
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
          },
        });
        return respHandler.success(res, {
          status: true,
          data: batch,
          msg: "Batch Updated Successfully!!",
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

const Deletebatch = async (req, res) => {
  try {
    const { id } = req.body;
    let batch = await Batch.findOne({
      id: id,
      ClientCode: req.user?.ClientCode,
      institutename: req.user?.institutename,
    });
    if (!batch) {
      return respHandler.error(res, {
        status: false,
        msg: "Not Found !!",
        error: [],
      });
    } else {
      await Batch.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Batch Deleted Successfully!!",
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
  Register,
  Loging,
  Addenquiry,
  Getallenquuiry,
  UpdateEnquiry,
  DeleteEnquiry,
  Addbatch,
  Updatebatch,
  Deletebatch,
  Getbatch,
};
