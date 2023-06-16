const express = require("express");
const router = express.Router();

const userAccountController = require("../controllers/account/account.controller");
const validateUser = require("../requests/validate.user");
const isAuth = require("../utils/validatetoken.util");

//Admin Apis

router.post("/login", validateUser.login(), userAccountController.login);

router.put(
  "/forgot-password",
  validateUser.forgotPassword(),
  userAccountController.forgotPassword
);

router.put(
  "/update-password",
  validateUser.updatePassword(),
  userAccountController.updatePasswordByOTP
);

module.exports = router;
