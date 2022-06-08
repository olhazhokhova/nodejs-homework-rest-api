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
        const token = jwt.sign({ id: user._id }, SECRET_KEY);
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

module.exports = {
    register,
    login
};