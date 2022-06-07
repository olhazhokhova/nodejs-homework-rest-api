const { Conflict } = require("http-errors");
const { User } = require("../models/user");

const register = async (req, res, next) => {
    try {
        const { password, email, subscription, token } = req.body;
        const user = await User.findOne({email});
        if(user){
            throw new Conflict('Email in use');
        }
        await User.create({ password, email, subscription, token });
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

module.exports = {
    register
};