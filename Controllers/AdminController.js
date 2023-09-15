const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const Admin = require("../Models/admin.model");
const Typeorganisation = require("../Models/typeorganization.model");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
config();

const SECRET = process.env.SECRET;

const Register = async (req, res) => {
  const {
    name,
    email,
    institutename,
    phoneno1,
    phoneno2,
    typeoforganization,
    address,
    city,
    state,
    pincode,
    password,
  } = req.body;
  const genSalt = 10;
  const hash = await bcrypt.hash(password, genSalt);

  if (
    name != "" ||
    email != "" ||
    password != "" ||
    institutename != "" ||
    phoneno1 != "" ||
    phoneno2 != "" ||
    typeoforganization != "" ||
    address != "" ||
    city != "" ||
    state != "" ||
    pincode != ""
  ) {
    try {
      let user = await Admin.findOne({ where: { email: email } });
      if (user != null) {
        removefile(`public/upload/${req.files.logourl[0].filename}`);
        removefile(`public/upload/${req.files.profileurl[0].filename}`);
        return respHandler.error(res, {
          status: false,
          msg: "Email or Mobile Number already exist",
        });
      }

      let newUser = {
        name: name,
        email: email,
        institutename: institutename,
        phoneno1: phoneno1,
        phoneno2: phoneno2,
        typeoforganization: typeoforganization,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        password: hash,
        logourl: `images/${req.files.logourl[0].filename}`,
        profileurl: `images/${req.files.profileurl[0].filename}`,
      };
      let createdUser = await Admin.create(newUser);
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
          msg: "Admin Account Created Successfully!!",
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

const Loging = async (req, res) => {
  const { email, password } = req.body;
  if (email || password != "") {
    try {
      let user = await Admin.findOne({ where: { email: email } });
      if (!user) {
        return respHandler.error(res, {
          status: false,
          msg: "Email or Mobile Number Is Incorrect",
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
          msg: "Admin login successfully!!",
          data: [{ token: token, user: user }],
        });
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Email or Password Is Incorrect",
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

const Createtypeoforganization = async (req, res) => {
  try {
    const { TypeofOrganization } = req.body;
    let organization = await Typeorganisation.create({
      TypeofOrganization: TypeofOrganization,
    });
    if (organization) {
      return respHandler.success(res, {
        status: true,
        msg: "Organization Created successfully!!",
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

const Updatetypeoforganization = async (req, res) => {
  try {
    const { TypeofOrganization, id } = req.body;

    let status = await Typeorganisation.update(
      {
        TypeofOrganization: TypeofOrganization,
      },
      {
        where: {
          id: id,
        },
      }
    );
    let organization = await Typeorganisation.findOne({
      where: {
        id: id,
      },
    });

    if (status) {
      return respHandler.success(res, {
        status: true,
        msg: "Updated Organization successfully!!",
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

const gettypeoforganization = async (req, res) => {
  try {
    let organizations = await Typeorganisation.findAll();
    if (organizations) {
      return respHandler.success(res, {
        status: true,
        msg: "All Type Of Organization successfully!!",
        data: [organizations],
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

const deletetypeoforganization = async (req, res) => {
  try {
    const { id } = req.body;
    let organization = await Typeorganisation.findOne({ where: { id: id } });
    if (organization) {
      await Typeorganisation.destroy({
        where: {
          id: id,
        },
      });

      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Type of Organization Deleted Successfully!!",
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
  Createtypeoforganization,
  gettypeoforganization,
  deletetypeoforganization,
  Updatetypeoforganization,
};
