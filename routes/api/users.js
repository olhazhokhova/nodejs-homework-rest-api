const express = require('express');
const {register, login, getCurrentUser, logout} = require('../../controllers/users');
const {validate} = require('../../middlewares/validate');
const {auth} = require("../../middlewares/auth");
const {joiRegisterSchema, joiLoginSchema} = require('../../models/user');

const router = express.Router();

router.post("/signup", validate(joiRegisterSchema), register);
router.post("/login", validate(joiLoginSchema), login);
router.get("/current", auth, getCurrentUser);
router.get("/logout", auth, logout);

module.exports = router;