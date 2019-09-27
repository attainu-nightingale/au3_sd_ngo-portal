const Joi = require("@hapi/joi");

const resetPassSchema = Joi.object().keys({
  password: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .min(6)
    .max(30)
    .required()
    .error(
      new Error(
        "password is required and must be greater than 6 and less than 30"
      )
    ),
  confPassword: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .min(6)
    .max(30)
    .required()
    .error(
      new Error(
        "password is required and must be greater than 6 and less than 30"
      )
    )
});
const loginSchema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .alphanum()
    .min(3)
    .max(20)
    .required()
    .error(
      new Error(
        "username is  required and must be greater than 3 and less than 20"
      )
    ),
  password: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .min(6)
    .max(30)
    .required()
    .error(
      new Error(
        "password is required and must be greater than 6 and less than 30"
      )
    )
});

const regSchema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .alphanum()
    .min(3)
    .max(20)
    .required()
    .error(
      new Error(
        "username is  required and must be greater than 3 and less than 20"
      )
    ),
  name: Joi.string()
    .min(3)
    .max(40)
    .required()
    .error(
      new Error("name is required and must be greater than 6 and less than 40")
    ),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
    .error(new Error("use valid email")),
  password: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .min(6)
    .max(30)
    .required()
    .error(
      new Error(
        "password is required and must be greater than 6 and less than 30"
      )
    ),
  dob: Joi.date()
    .greater("1-1-1961")
    .required()
    .raw()
    .error(
      new Error("date of birth is required and can't be lower than 1-1-1961")
    ),
  location: Joi.string()
    .required()
    .error(new Error("location is required")),
  gender: Joi.string().error(new Error("Must be string")),
  profile_pic: Joi.string().error(new Error("Must be string"))
});

const volSchema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .alphanum()
    .min(3)
    .max(20)
    .required()
    .error(
      new Error(
        "username is  required and must be greater than 3 and less than 20"
      )
    ),
  fullname: Joi.string()
    .min(3)
    .max(40)
    .required()
    .error(
      new Error("name is required and must be greater than 6 and less than 40")
    ),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
    .error(new Error("use valid email")),
  password: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .min(6)
    .max(30)
    .required()
    .error(
      new Error(
        "password is required and must be greater than 6 and less than 30"
      )
    ),
  dob: Joi.date()
    .greater("1-1-1961")
    .required()
    .raw()
    .error(
      new Error("date of birth is required and can't be lower than 1-1-1961")
    ),
  location: Joi.string()
    .required()
    .error(new Error("location is required")),
  occupation: Joi.string()
    .required()
    .error(new Error("occupation is required")),
  number: Joi.string()
    .min(9)
    .max(15)
    .error(new Error("number should be valid number")),
  preExperience: Joi.string().error(new Error("Must be string")),
  gender: Joi.string().error(new Error("Must be string")),
  profile_pic: Joi.string().error(new Error("Must be string"))
});

const contactSchema = Joi.object().keys({
  fullname: Joi.string()
    .min(6)
    .max(40)
    .required()
    .error(
      new Error("name is required and must be greater than 6 and less than 40")
    ),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
    .error(new Error("use valid email")),
  phone: Joi.string()
    .min(9)
    .max(12)
    .required()
    .error(new Error("Should be valid phone number")),
  message: Joi.string()
    .required()
    .error(new Error("Message field is required and string only"))
});

const reportSchema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
    .error(new Error("use valid email")),
  report: Joi.string()
    .required()
    .error(new Error("Message field is required and string only"))
});

module.exports = {
  Joi,
  loginSchema,
  regSchema,
  volSchema,
  contactSchema,
  reportSchema,
  resetPassSchema
};
