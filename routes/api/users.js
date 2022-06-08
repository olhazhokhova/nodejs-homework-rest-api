const express = require('express');
const {register, login} = require('../../controllers/users');
const {validate} = require('../../middlewares/validate');
const {joiRegisterSchema, joiLoginSchema} = require('../../models/user');

const router = express.Router();

router.post("/signup", validate(joiRegisterSchema), register);
router.post("/login", validate(joiLoginSchema), login);

module.exports = router;