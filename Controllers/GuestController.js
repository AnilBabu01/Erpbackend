const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const Guest = require("../Models/guest.model");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");

config();

const SECRET = process.env.SECRET;

const Guestlogin = async (req, res) => {
  const { userType, phoneNo, email,Fullname } = req.body;

  if (userType != "" || phoneNo != "" || email != ""||Fullname!='') {
    try {
      let createdUser = await Guest.findOne({
        where: { phoneNo: phoneNo, email: email, userType: userType,name:Fullname },
      });

      if (createdUser) {
        var token = jwt.sign(
          {
            id: createdUser.id,
            userType: createdUser.userType,
            guest: createdUser.guest,
          },
          SECRET
        );

        if (token) {
          return respHandler.success(res, {
            status: true,
            data: [{ token: token, user: createdUser }],
            msg: "You Have Login As Guest Successfully!!",
          });
        }
      } else {
        let createdUser = await Guest.create({
          userType: userType,
          email: email,
          phoneNo: phoneNo,
          name:Fullname
        });
        var token = jwt.sign(
          {
            id: createdUser.id,
            userType: createdUser.userType,
            guest: createdUser.guest,
          },
          SECRET
        );
        if (token) {
          return respHandler.success(res, {
            status: true,
            data: [{ token: token, user: createdUser }],
            msg: "You Have Login As Guest Successfully!!",
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
  } else {
    return respHandler.error(res, {
      status: false,
      msg: "All fields are required!!",
    });
  }
};

module.exports = {
  Guestlogin,
};
