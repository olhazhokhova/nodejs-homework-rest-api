const express = require('express');
const {register, login, getCurrentUser, logout, updateAvatar, verifyEmail, resendVerifyEmail} = require('../../controllers/users');
const {validate} = require('../../middlewares/validate');
const {auth} = require("../../middlewares/auth");
const {upload} = require("../../middlewares/upload");
const {joiRegisterSchema, joiLoginSchema, joiConfirmEmailSchema} = require('../../models/user');

const router = express.Router();

router.post("/signup", validate(joiRegisterSchema), register);
router.post("/login", validate(joiLoginSchema), login);
router.get("/current", auth, getCurrentUser);
router.get("/logout", auth, logout);
router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify/", validate(joiConfirmEmailSchema), resendVerifyEmail);

module.exports = router;