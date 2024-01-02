const { Op } = require("sequelize");
const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const Client = require("../Models/client.model");
const Credentials = require("../Models/Credentials.model");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
config();

const SECRET = process.env.SECRET;

getClientCount = async () => {
  let count = await Client.count({
    distinct: true,
    col: "userType",
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

  const genSalt = 10;
  const hash = await bcrypt.hash(password, genSalt);
  let clients = await Client.findAll();

  if (clients) {
    if (
      name != "" ||
      email != "" ||
      password != "" ||
      Clientname != "" ||
      phoneno1 != "" ||
      institutename != "" ||
      typeoforganization != "" ||
      address != "" ||
      city != "" ||
      state != "" ||
      pincode != "" ||
      userType != ""
    ) {
      try {
        let user = await Client.findOne({
          where: { phoneno1: phoneno1, email: email },
        });
        if (user != null) {
          let clientID = `CNO-${clients?.length - 1 + 900}`;
          let status = await Client.update(
            {
              name: name,
              email: email,
              Clientname: Clientname,
              phoneno1: phoneno1,
              institutename: institutename,
              ClientCode: clientID,
              typeoforganization: typeoforganization,
              address: address,
              city: city,
              state: state,
              pincode: pincode,
              password: hash,
              userType: userType,
              emailOtpStatus: true,
              phoneOtpStatus: true,
            },
            {
              where: {
                phoneno1: phoneno1,
                email: email,
              },
            }
          );
          if (status) {
            let clientID = `CNO-${clients?.length - 1 + 900}`;
            let clientdata = await Credentials.create({
              name: name,
              email: email,
              Clientname: Clientname,
              phoneno1: phoneno1,
              institutename: institutename,
              ClientCode: clientID,
              typeoforganization: typeoforganization,
              address: address,
              city: city,
              state: state,
              pincode: pincode,
              password: hash,
              userType: userType,
            });
            var token = jwt.sign(
              {
                id: user?.id,
                userType: user?.userType,
              },
              SECRET
            );
            if (token) {
              return respHandler.success(res, {
                status: true,
                msg: "College Account Created Successfully!!",
                data: [{ User: user, CollegeDetails: clientdata }],
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
  }
};

const Loging = async (req, res) => {
  const { email, password, institutename } = req.body;

  if (email || password != "" || institutename != "") {
    let last = institutename.split(" ").pop();
    var lastIndex = institutename?.lastIndexOf(" ");
    let first = institutename.substring(0, lastIndex);
    if (first && last) {
      try {
        let user = await Client.findOne({
          where: {
            [Op.or]: [{ email: email }, { phoneno1: email }],
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

const updateprofile = async (req, res) => {
  const {
    name,
    userType,
    email,
    institutename,
    phoneno1,
    phoneno2,
    typeoforganization,
    address,
    city,
    state,
    pincode,
  } = req.body;

  if (!req.files.profileurl || !req.files.logourl) {
    return respHandler.error(res, {
      status: false,
      msg: "Error in file uploading",
    });
  }

  if (
    name != "" ||
    email != "" ||
    institutename != "" ||
    phoneno1 != "" ||
    phoneno2 != "" ||
    typeoforganization != "" ||
    address != "" ||
    city != "" ||
    state != "" ||
    pincode != "" ||
    userType != ""
  ) {
    try {
      let user = await Client.findOne({ where: { id: req.user.id } });

      if (user != null) {
        if (req.files.logourl[0].filename) {
          removefile(`public/upload/${req?.user?.logourl?.substring(7)}`);
        }
        if (req.files.profileurl[0].filename) {
          removefile(`public/upload/${req?.user?.profileurl?.substring(7)}`);
        }
        let updateUser = {
          name: name,
          email: email,
          institutename: institutename,
          ClientCode: user?.ClientCode,
          phoneno1: phoneno1,
          phoneno2: phoneno2,
          typeoforganization: typeoforganization,
          address: address,
          city: city,
          state: state,
          pincode: pincode,
          userType: userType,
          logourl: req.files.logourl[0]
            ? `images/${req.files.logourl[0].filename}`
            : "",
          profileurl: req.files.profileurl[0]
            ? `images/${req.files.profileurl[0].filename}`
            : "",
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
              msg: "Profile Updated SuccessFully Successfully!!",
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

const Addenquiry = async (req, res) => {
  const {
    EnquiryDate,
    StudentName,
    StudentNumber,
    StudentEmail,
    Address,
    Course,
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
    let enquiries = await Enquiry.findAll({
      where: {
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
      },
    });

    if (enquiries) {
      return respHandler.success(res, {
        status: true,
        msg: "Enquiry Created successfully!!",
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
module.exports = {
  Register,
  Loging,
  updateprofile,
  Addenquiry,
  Getallenquuiry,
  UpdateEnquiry,
  DeleteEnquiry,
};
