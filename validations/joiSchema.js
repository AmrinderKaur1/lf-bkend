const joi = require("joi");

const validations1 = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

const validations = {
  resetPassword: joi.object({
    email: joi
      .string()
      .required(),
      // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  }),
};


module.exports = validations;
