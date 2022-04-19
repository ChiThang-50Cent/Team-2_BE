const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const _ = require("lodash");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6, maxlength: 1024 },
    fullname: { type: String, required: true, trim: true },
    avatar: { type: String },
    phoneNumber: { type: String, trim: true, length: 10 },
    address: { type: String },
    isAdmin: { type: Boolean, default: false },
  },
  { versionKey: false }
);

userSchema.methods.generateAuthToken = () => {
  return jwt.sign(
    {
      ..._.pick(this, [
        "_id",
        "fullname",
        "email",
        "avatar",
        "phoneNumber",
        "address",
        "isAdmin",
      ]),
    },
    process.env.APP_SECRET_KEY
  );
};

const User = mongoose.model("User", userSchema);

const validateLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(user);
};

module.exports = { User, validateLogin };
