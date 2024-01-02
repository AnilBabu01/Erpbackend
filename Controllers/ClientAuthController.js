const { Op } = require("sequelize");
const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const Client = require("../Models/client.model");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
const axios = require("axios");
const sendEmail = require("../Middleware/sendEmail");
config();
const genSalt = 10;
const SECRET = process.env.SECRET;

const getotponPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    if (phone) {
      let client = await Client.findOne({
        where: { phoneno1: phone },
      });
      if (client) {
        if (client?.address) {
          return respHandler.error(res, {
            status: false,
            msg: "You have allready with this phone number !!",
            error: [""],
          });
        } else {
          var val = Math.floor(1000 + Math.random() * 900000);
          let status = await Client.update(
            {
              phoneOtp: val,
              phoneOtpStatus: false,
            },
            {
              where: {
                id: client?.id,
                phoneno1: phone,
              },
            }
          );
          if (status) {
            let mess = `Thankyou for registering in abtechzone \n Your OTP is: ${val}`;
            const MsgUrl = `https://www.fast2sms.com/dev/bulkV2?authorization= ${process.env.FASTSMSAPI}&route=v3&sender_id=Cghpet&message=${mess}&language=english&flash=0&numbers=${phone}`;
            axios
              .get(MsgUrl)
              .then(function (response) {
                // handle success
                return respHandler.success(res, {
                  status: true,
                  msg: "Opt Sent Successfully !!",
                  data: [{ User: client }],
                });
              })
              .catch(function (error) {
                return respHandler.error(res, {
                  status: false,
                  msg: error.message,
                  error: [error.message],
                });
              });
          }
        }
      } else {
        var val = Math.floor(1000 + Math.random() * 900000);
        let optsave = await Client.create({
          phoneno1: phone,
          phoneOtp: val,
        });

        if (optsave) {
          let mess = `\n Thankyou for registering in abtechzone \n Your OTP is: ${val}`;
          const MsgUrl = `https://www.fast2sms.com/dev/bulkV2?authorization= ${process.env.FASTSMSAPI}&route=v3&sender_id=Cghpet&message=${mess}&language=english&flash=0&numbers=${phone}`;
          axios
            .get(MsgUrl)
            .then(function (response) {
              // handle success
              return respHandler.success(res, {
                status: true,
                msg: "Opt Sent Successfully !!",
                data: [{ User: optsave }],
              });
            })
            .catch(function (error) {
              return respHandler.error(res, {
                status: false,
                msg: error.message,
                error: [error.message],
              });
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

const getotponEmail = async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (email) {
      let client = await Client.findOne({
        where: { phoneno1: phone, email: email },
      });
      if (client) {
        if (client?.address) {
          return respHandler.error(res, {
            status: false,
            msg: "You have allready with this Email !!",
            error: [""],
          });
        } else {
          var val = Math.floor(1000 + Math.random() * 900000);
          let status = await Client.update(
            {
              emailOtp: val,
              emailOtpStatus: false,
            },
            {
              where: {
                id: client?.id,
                phoneno1: phone,
                email: email,
              },
            }
          );
          if (status) {
            try {
              let message = `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Document</title>
                  <style>
                    * {
                      padding: 0px;
                      margin: 0px;
                    }
                    .header {
                      width: 100%;
                      background-color: #ff6900;
                      height: 8rem;
                    }
                    .maindiv {
                      position: relative;
                    }
                    .contentdiv {
                      background-color: #093959;
                      width: 100%;
                     
                 
                      align-items: center;
                     
                      padding: 1rem;
                    }
                    .contentdiv h1 {
                      color: white;
                      font-size: 17px;
                      text-align: center;
                      margin-bottom: 1rem;
                    }
                    .contentdiv img {
                      width: 10rem;
                    }
                    .contentdiv p {
                      color: white;
                      margin-bottom: 1rem;
                      text-align: center;
                    }
                  </style>
                </head>
                <body>
                  <div class="maindiv">
                    <div class="contentdiv">
                      <h1>Wellcome To AbTechZone !</h1>
                      <p>Thank you for choosing us</p>
                      <p>Your Email Verification code is : ${val}</p>
                    </div>
                  </div>
                </body>
              </html>
              
              `;
              await sendEmail({
                email: email,
                subject: "Verify email for account creation",
                message,
              });

              return respHandler.success(res, {
                status: true,
                msg: "Opt Sent On Your Email Successfully !!",
                data: [{ User: client }],
              });
            } catch (err) {
              return respHandler.error(res, {
                status: false,
                msg: "Something Went Wrong!!",
                error: [err.message],
              });
            }
          }
        }
      } else {
        var val = Math.floor(1000 + Math.random() * 900000);
        let optsave = await Client.update(
          {
            emailOtp: val,
            email: email,
            emailOtpStatus: false,
          },
          {
            where: {
              phoneno1: phone,
            },
          }
        );

        if (optsave) {
          try {
            let message = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                <style>
                  * {
                    padding: 0px;
                    margin: 0px;
                  }
                  .header {
                    width: 100%;
                    background-color: #ff6900;
                    height: 8rem;
                  }
                  .maindiv {
                    position: relative;
                  }
                  .contentdiv {
                    background-color: #093959;
                      width: 100%;
                     
                   
                      align-items: center;
                     
                      padding: 1rem;
                  }
                  .contentdiv h1 {
                    color: white;
                    font-size: 17px;
                    text-align: center;
                    margin-bottom: 1rem;
                  }
                  .contentdiv img {
                    width: 10rem;
                  }
                  .contentdiv p {
                    color: white;
                    margin-bottom: 1rem;
                    text-align: center;
                  }
                </style>
              </head>
              <body>
                <div class="maindiv">
                  <div class="contentdiv">
                    <h1>Wellcome To AbTechZone !</h1>
                     <p>Thank you for choosing us</p>
                    <p>Your Email Verification code is : ${val}</p>
                  </div>
                </div>
              </body>
            </html>
            `;
            await sendEmail({
              email: email,
              subject: "Verify email for account creation",
              message,
            });

            return respHandler.success(res, {
              status: true,
              msg: "Opt Sent On Your Email Successfully !!",
              data: [{ User: client }],
            });
          } catch (err) {
            return respHandler.error(res, {
              status: false,
              msg: "Something Went Wrong!!",
              error: [err.message],
            });
          }
        }
      }
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Email Id Required!!",
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

const VerifyPhone = async (req, res) => {
  try {
    const { otp, email, phone } = req.body;

    let client = await Client.findOne({
      where: {
        phoneOtp: otp,
      },
    });

    if (client) {
      let status = await Client.update(
        {
          phoneOtp: null,
          phoneOtpStatus: true,
        },
        {
          where: {
            phoneOtp: otp,
          },
        }
      );

      if (status) {
        return respHandler.success(res, {
          status: true,
          msg: "Phone Number Verified successfully!!",
          data: [client],
        });
      }
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Please Use Correct Otp Wrong!!",
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

const VerifyEmail = async (req, res) => {
  try {
    const { otp, email, phone } = req.body;

    let client = await Client.findOne({
      where: {
        emailOtp: otp,
        phoneno1: phone,
        email: email,
      },
    });

    if (client) {
      let status = await Client.update(
        {
          emailOtp: null,
          emailOtpStatus: true,
        },
        {
          where: {
            emailOtp: otp,
            phoneno1: phone,
            email: email,
          },
        }
      );

      if (status) {
        return respHandler.success(res, {
          status: true,
          msg: "Email Verified successfully!!",
          data: [client],
        });
      }
    } else {
      let client = await Client.findOne({
        where: {
          phoneno1: phone,
          email: email,
        },
      });
      if (client) {
        return respHandler.error(res, {
          status: false,
          msg: "You Have AllReady Account With This Email !!",
          error: [""],
        });
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Please Use Correct Otp Wrong!!",
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

const GetforgetOtpPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    console.log("mobile no is ", req.body);
    if (phone) {
      let client = await Client.findOne({
        where: { phoneno1: phone },
      });
      if (!client) {
        return respHandler.error(res, {
          status: false,
          msg: "Mobile no is wrong!!",
          error: [],
        });
      }
      if (client) {
        var val = Math.floor(1000 + Math.random() * 900000);

        let status = await Client.update(
          {
            ForgetOtp: val,
          },
          {
            where: {
              id: client?.id,
              phoneno1: phone,
            },
          }
        );

        if (status) {
          let mess = `Thankyou for registering in abtechzone \n Your OTP is: ${val}`;
          const MsgUrl = `https://www.fast2sms.com/dev/bulkV2?authorization= ${process.env.FASTSMSAPI} &route=v3&sender_id=Cghpet&message=${mess}&language=english&flash=0&numbers=${phone}`;
          axios
            .get(MsgUrl)
            .then(function (response) {
              // handle success
              return respHandler.success(res, {
                status: true,
                msg: "Opt Sent Successfully !!",
                data: [{ User: client }],
              });
            })
            .catch(function (error) {
              return respHandler.error(res, {
                status: false,
                msg: error.message,
                error: [error.message],
              });
            });
        }
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Mobile is wrong!!",
          error: [""],
        });
      }
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Mobile is required!!",
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

const GetforgetOtpEmail = async (req, res) => {
  try {
    const { mobileNo } = req.body;
    if (mobileNo) {
      let client = await Client.findOne({
        where: { email: mobileNo },
      });

      if (!client) {
        return respHandler.error(res, {
          status: false,
          msg: "Email is wrong!!",
          error: [],
        });
      }

      if (client) {
        var val = Math.floor(1000 + Math.random() * 900000);

        let status = await Client.update(
          {
            ForgetOtp: val,
          },
          {
            where: {
              id: client?.id,
              email: mobileNo,
            },
          }
        );

        if (status) {
          let message = `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Document</title>
              <style>
                * {
                  padding: 0px;
                  margin: 0px;
                }
                .header {
                  width: 100%;
                  background-color: #ff6900;
                  height: 8rem;
                }
                .maindiv {
                  position: relative;
                }
                .contentdiv {
                  background-color: #093959;
                    width: 100%;
                   
                 
                    align-items: center;
                   
                    padding: 1rem;
                }
                .contentdiv h1 {
                  color: white;
                  font-size: 17px;
                  text-align: center;
                  margin-bottom: 1rem;
                }
                .contentdiv img {
                  width: 10rem;
                }
                .contentdiv p {
                  color: white;
                  margin-bottom: 1rem;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="maindiv">
                <div class="contentdiv">
                  <p>Your password forgot code is : ${val}</p>
                </div>
              </div>
            </body>
          </html>
          `;

          await sendEmail({
            email: mobileNo,
            subject: "Veriying code for password forgot",
            message,
          });

          return respHandler.success(res, {
            status: true,
            msg: "Opt Sent On Your Email Successfully !!",
            data: [],
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

const Changepassword = async (req, res) => {
  try {
    const { otp, newpassword, confirmnewpassword, emailOrphone } = req.body;

    if (otp === "") {
      return respHandler.error(res, {
        status: false,
        msg: "Otp is required!!",
        error: [""],
      });
    }
    if (newpassword === "") {
      return respHandler.error(res, {
        status: false,
        msg: "new password is required!!",
        error: [""],
      });
    }
    if (confirmnewpassword === "") {
      return respHandler.error(res, {
        status: false,
        msg: "confirm new password is required!!",
        error: [""],
      });
    }
    // if (newpassword != confirmnewpassword) {
    //   return respHandler.error(res, {
    //     status: false,
    //     msg: "new and confirm password not matched!!",
    //     error: [""],
    //   });
    // }
    let user = await Client.findOne({
      where: {
        [Op.or]: [{ email: emailOrphone }, { phoneno1: emailOrphone }],
        ForgetOtp: otp,
      },
    });
    if (!user) {
      return respHandler.error(res, {
        status: false,
        msg: "Otp Is Incorrect!!",
      });
    } else {
      const hash = await bcrypt.hash(newpassword, genSalt);
      let status = await Client.update(
        {
          password: hash,
          ForgetOtp: "",
        },
        {
          where: {
            id: user?.id,
            ClientCode: user?.ClientCode,
          },
        }
      );
      if (status) {
        return respHandler.success(res, {
          status: true,
          data: [user],
          msg: "Password Changed Successfully!!",
        });
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Something Went Wrong!!",
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

module.exports = {
  getotponPhone,
  getotponEmail,
  VerifyEmail,
  VerifyPhone,
  GetforgetOtpPhone,
  GetforgetOtpEmail,
  Changepassword,
};
