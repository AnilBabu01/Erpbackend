const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const Client = require("../Models/client.model");
const Studentclass = require("../Models/studentclass.model");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
const removefile = require("../Middleware/removefile");
const axios = require("axios");
const sendEmail = require("../Middleware/sendEmail");

config();
const SECRET = process.env.SECRET;
const getotponPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    if (phone) {
      let client = await Client.findOne({
        where: { phoneno1: phone },
      });
      if (client) {
        if (
          client?.phoneOtpStatus === true &&
          client?.emailOtpStatus === true &&
          client?.ClientCode != ""
        ) {
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
            const MsgUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=CgS6KLa6FZIWC4rGhHqjXUuBqaxaPbHxxgM8NItmRKFtJx1ncwGkmM1NqPEV&route=v3&sender_id=Cghpet&message=${mess}&language=english&flash=0&numbers=${phone}`;
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
          const MsgUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=CgS6KLa6FZIWC4rGhHqjXUuBqaxaPbHxxgM8NItmRKFtJx1ncwGkmM1NqPEV&route=v3&sender_id=Cghpet&message=${mess}&language=english&flash=0&numbers=${phone}`;
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
        if (client?.emailOtpStatus === true) {
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

module.exports = {
  getotponPhone,
  getotponEmail,
  VerifyEmail,
  VerifyPhone,
};
