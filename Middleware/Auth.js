const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
const Admin = require("../Models/admin.model");
const Client = require("../Models/client.model");
const Employee = require("../Models/employee.model");
const Parent = require("../Models/parent.model");
const Student = require("../Models/student.model");
const Guest = require("../Models/guest.model");
const respHandler = require("../Handlers");
config();
const SECRET_KEY = process.env.SECRET;

const verifyToken = async (req, res, next) => {
  console.log(req.headers["authorization"]);

  console.log("data is tokem from delete method",)
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"]

  if (!token) {
    return respHandler.error(res, {
      status: false,
      msg: "A token is required for authentication",
      statuscode: 499,
    });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded, token);
    let user;
    if (decoded.userType === "admin") {
      user = await Admin.findByPk(decoded.id, {
        attributes: { exclude: ["updatedAt", "password"] },
      });
    }

    if (decoded.guest === "guest") {
      if (decoded.userType === "school") {
        user = await Guest.findByPk(decoded.id, {
          attributes: { exclude: ["updatedAt", "password"] },
        });
      }

      if (decoded.userType === "college") {
        user = await Guest.findByPk(decoded.id, {
          attributes: { exclude: ["updatedAt", "password"] },
        });
      }
      if (decoded.userType === "institute") {
        user = await Guest.findByPk(decoded.id, {
          attributes: { exclude: ["updatedAt", "password"] },
        });
      }
    } else {
      if (decoded.userType === "school") {
        user = await Client.findByPk(decoded.id, {
          attributes: { exclude: ["updatedAt", "password"] },
        });
      }

      if (decoded.userType === "college") {
        user = await Client.findByPk(decoded.id, {
          attributes: { exclude: ["updatedAt", "password"] },
        });
      }
      if (decoded.userType === "institute") {
        user = await Client.findByPk(decoded.id, {
          attributes: { exclude: ["updatedAt", "password"] },
        });
      }
    }
    if (decoded.userType === "employee") {
      user = await Employee.findByPk(decoded.id, {
        attributes: { exclude: ["updatedAt", "password"] },
      });
    }
    if (decoded.userType === "student") {
      user = await Student.findByPk(decoded.id, {
        attributes: { exclude: ["updatedAt", "password"] },
      });
    }
    if (decoded.userType === "parent") {
      user = await Parent.findByPk(decoded.id, {
        attributes: { exclude: ["updatedAt", "password"] },
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Invalid Token",
      error: [err.message],
      statuscode: 401,
    });
  }
};

module.exports = verifyToken;
