const { Schema, model } = require("mongoose");
const Joi = require('joi');

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
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
}, { versionKey: false, timestamps: true })

const joiRegisterSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    subscription: Joi.string().valid("starter", "pro", "business").required(),
    token: Joi.string(),
})

const joiLoginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    subscription: Joi.string().valid("starter", "pro", "business").required(),
    token: Joi.string(),
})

const User = model("user", userSchema);

module.exports = {
    User,
    joiRegisterSchema,
    joiLoginSchema
};