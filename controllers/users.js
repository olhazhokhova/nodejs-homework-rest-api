const { Conflict, Unauthorized } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
    try {
        const { password, email, subscription, token } = req.body;
        const user = await User.findOne({email});
        if(user){
            throw new Conflict('Email in use');
        }
        const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        await User.create({ password: hashPass, email, subscription, token });
        res.status(201).json({
            status: "success",
            code: 201,
            data: {
                user: {
                    email, 
                    subscription
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

module.exports = {
    register,
    login,
    getCurrentUser,
    logout
};