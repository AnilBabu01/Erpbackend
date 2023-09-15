const { check, body } = require("express-validator");
const { Validate } = require("./Validation");
const joi = require("joi");
const Validation = async (req, res, next) => {
  const schema = joi.object().keys({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  Validation,
};
