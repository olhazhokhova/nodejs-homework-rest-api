const { Conflict, Unauthorized, NotFound } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require('jimp');
const { v4: uuidv4} = require('uuid');
const path = require('path');
const fs = require('fs/promises');
const { User } = require("../models/user");
const { emailSend } = require("../helpers/emailSend");

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
    try {
        const { password, email, subscription, token } = req.body;
        const user = await User.findOne({email});
        if(user){
            throw new Conflict('Email in use');
        }
        const avatarURL = gravatar.url(email, {}, true);
        const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const verificationToken = uuidv4();

        await User.create({ password: hashPass, email, subscription, token, avatarURL, verificationToken });

        const mail = {
            to: email,
            subject: "Email verification",
            html: `<a href='http://localhost:3000/api/users/verify/${verificationToken}' target='_blank'>Confirm your email</a>`
        }

        await emailSend(mail);

        res.status(201).json({
            status: "success",
            code: 201,
            data: {
                user: {
                    email, 
                    subscription,
                    avatarURL,
                    verificationToken
                }
            }
        })
    } catch (e) {
        next(e);
    }
};

const login = async (req, res, next) => {
    try {
        const { password, email } = req.body;
        const user = await User.findOne({email});
        if(!user || !user.verify || !user.comparePass(password)){
            throw new Unauthorized('Email is wrong or not verified, or password is wrong');
        }
        const token = jwt.sign({ id: user._id }, SECRET_KEY, {expiresIn: "1h"});
        await User.findByIdAndUpdate(user._id, {token});
        res.json({
            status: "success",
            code: 200,
            data: {
                token
            }
        })
    } catch (e) {
        next(e);
    }
};

const getCurrentUser = async (req, res) => {
   res.json({
    status: "success",
    data: {
        user: req.user
    }
   })
};

const logout = async (req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: null});
    res.status(204).json();
};

const updateAvatar = async (req, res) => {
    const {path: pathTmp, originalname} = req.file;
    const {_id: id} = req.user;
    const avatarName = `${id}_${originalname}`;
    const avatarURL = path.join('public/avatars', avatarName);
    try {
        Jimp.read(pathTmp, (err, img) => {
            if (err) throw err;
            img
              .resize(250, 250)
              .quality(60)
              .write(avatarURL);
          });
        await User.findByIdAndUpdate(req.user._id, {avatarURL});
        res.json({avatarURL});
    } catch (e) {
        console.log(e);
        throw e;
    } finally {
        await fs.unlink(pathTmp);
    }
};

const verifyEmail = async (req, res) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user){
        throw new NotFound("User not found"); 
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null});

    res.json({
        message: "Verification successful"
    })
};

const resendVerifyEmail = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            throw new NotFound("User not found"); 
        }
        if(!user.verify){
            const mail = {
                to: email,
                subject: "Email verification",
                html: `<a href='http://localhost:3000/api/users/verify/${user.verificationToken}' target='_blank'>Confirm your email</a>`
            }
            await emailSend(mail);
            res.json({
                code: 400,
                message: "Verification email sent"
            })
        } else {
            res.json({
                code: 400,
                message: "Verification has already been passed"
            })
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    logout,
    updateAvatar,
    verifyEmail,
    resendVerifyEmail
};