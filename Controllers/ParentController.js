const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const Parent = require("../Models/parent.model");
const Student = require("../Models/student.model");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
config();

const SECRET = process.env.SECRET;

const Loging = async (req, res) => {
  const { phoneno1, password } = req.body;

 
  if (phoneno1 != "" || password != "") {
    try {
      let user = await Parent.findOne({ where: { phoneno1: phoneno1 } });

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

const getmystudents = async (req, res) => {
  try {
    let students = await Student.findAll({
      where: {
        parentId: req.user.id,
      },
    });

    if (students) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All children successfully!!",
        data: [students],
      });
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
    });
  }
};

module.exports = {
  Loging,
  getmystudents,
};
