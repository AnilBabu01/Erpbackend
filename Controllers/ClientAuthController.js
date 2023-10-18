const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const Client = require("../Models/client.model");
const Studentclass = require("../Models/studentclass.model");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
config();

const SECRET = process.env.SECRET;

const getotponPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    let stidentclassv = await Studentclass.findOne({
      where: {
       
      },
    });
    if (stidentclassv) {
      if (
        stidentclassv?.stidentclass?.toLowerCase() ===
        stidentclass.toLowerCase()
      ) {
        return respHandler.error(res, {
          status: false,
          msg: "Something Went Wrong!!",
          error: ["AllReady Exsist !!"],
        });
      }
    }
    let organization = await Studentclass.create({
      ClientCode: req.user?.ClientCode,
      institutename: req.user?.institutename,
      typeoforganization: req.user.typeoforganization,
      stidentclass: stidentclass,
    });
    if (organization) {
      return respHandler.success(res, {
        status: true,
        msg: "Class Created successfully!!",
        data: [organization],
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

const getotponEmail = async (req, res) => {
    try {
      const { phone } = req.body;
      let stidentclassv = await Studentclass.findOne({
        where: {
         
        },
      });
      if (stidentclassv) {
        if (
          stidentclassv?.stidentclass?.toLowerCase() ===
          stidentclass.toLowerCase()
        ) {
          return respHandler.error(res, {
            status: false,
            msg: "Something Went Wrong!!",
            error: ["AllReady Exsist !!"],
          });
        }
      }
      let organization = await Studentclass.create({
        ClientCode: req.user?.ClientCode,
        institutename: req.user?.institutename,
        typeoforganization: req.user.typeoforganization,
        stidentclass: stidentclass,
      });
      if (organization) {
        return respHandler.success(res, {
          status: true,
          msg: "Class Created successfully!!",
          data: [organization],
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

const VerifyPhone = async (req, res) => {
  try {
    const { stidentclass, id } = req.body;

    let status = await Studentclass.update(
      {
        stidentclass: stidentclass,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
          institutename: req.user?.institutename,
        },
      }
    );
    let studentclass = await Studentclass.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Class Updated successfully!!",
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


const VerifyEmail = async (req, res) => {
    try {
      const { stidentclass, id } = req.body;
  
      let status = await Studentclass.update(
        {
          stidentclass: stidentclass,
        },
        {
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
            institutename: req.user?.institutename,
          },
        }
      );
      let studentclass = await Studentclass.findOne({
        where: {
          id: id,
        },
      });
  
      if (status) {
        return respHandler.success(res, {
          status: true,
          msg: "Class Updated successfully!!",
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

module.exports = {
 getotponPhone,
 getotponEmail,
 VerifyEmail,
 VerifyPhone
};
