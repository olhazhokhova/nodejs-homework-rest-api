const { Schema, model } = require("mongoose");
const Joi = require('joi');
const bcrypt = require("bcryptjs");

const userSchema = Schema({
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
}, { versionKey: false, timestamps: true })

userSchema.methods.comparePass = function(password){
  return bcrypt.compareSync(password, this.password);
}

const joiRegisterSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    subscription: Joi.string().valid("starter", "pro", "business").required(),
    token: Joi.string(),
})

const joiLoginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
})

const joiConfirmEmailSchema = Joi.object({
  email: Joi.string().required(),
})

const User = model("user", userSchema);

module.exports = {
    User,
    joiRegisterSchema,
    joiLoginSchema,
    joiConfirmEmailSchema
};