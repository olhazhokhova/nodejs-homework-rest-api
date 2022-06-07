const express = require('express');
const {register} = require('../../controllers/users');
const {validate} = require('../../middlewares/validate');
const {joiRegisterSchema, joiLoginSchema} = require('../../models/user');

const router = express.Router();

router.post("/signup", validate(joiRegisterSchema), register);

module.exports = router;