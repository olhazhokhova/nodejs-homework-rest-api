const { Conflict, Unauthorized } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs/promises');
const { User } = require("../models/user");

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
        await User.create({ password: hashPass, email, subscription, token, avatarURL });
        res.status(201).json({
            status: "success",
            code: 201,
            data: {
                user: {
                    email, 
                    subscription,
                    avatarURL
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
        if(!user || !user.comparePass(password)){
            throw new Unauthorized('Email or password is wrong');
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

module.exports = {
    register,
    login,
    getCurrentUser,
    logout,
    updateAvatar
};