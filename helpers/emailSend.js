const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const {SENDGRID_API_KEY} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const emailSend = async (data) => {
    const email = {...data, from: "zhokhova.olha@gmail.com"};
    try {
        await sgMail.send(email);
        return true;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    emailSend
};