const { body } = require("express-validator");
const accountRepository = require("../repositories/account.repository");
const {
  handlerSuccess,
  handlerBadRequestError,
  handlerNotFoundError,
  handlerPermissionDeniedError,
} = require("../utils/handler.response.util");
module.exports = {
  classname: "ValidateUser",

  register: () => {
    return [
      body("email").not().isEmpty().withMessage("Email không được bỏ trống"),
      body("email").isEmail().withMessage("Email không đúng định dạng"),
      body("phoneNumber")
        .not()
        .isEmpty()
        .withMessage("Số điện thoại không được bỏ trống"),
      body("password")
        .not()
        .isEmpty()
        .withMessage("Mật khẩu không được bỏ trống"),
      body("password")
        .custom((value) => {
          if (!value) {
            return false;
          }
          const regex = /^(?=.*[a-z])(?=.*\d)[A-Za-z0-9\d-]{6,14}$/;
          const isCorrect = regex.test(value);
          if (!isCorrect) {
            return false;
          }
          return true;
        })
        .withMessage("Mật khẩu phải chứa ít nhất một chữ in hoa và số"),
      body("password")
        .custom((value) => {
          if (value.length < 6 || value.length > 14) {
            return false;
          }
          return true;
        })
        .withMessage("Mật khẩu phải có độ dài từ 6-14 kí tự"),
    ];
  },

  login: () => {
    return [
      body("email").not().isEmpty().withMessage("Tài khoản không được bỏ rỗng"),
      body("password")
        .custom((value) => {
          if (!value) {
            return false;
          }
          const regex = /^(?=.*[a-z])(?=.*\d)[A-Za-z0-9\d-]{6,14}$/;
          const isCorrect = regex.test(value);
          if (!isCorrect) {
            return false;
          }
          return true;
        })
        .withMessage("Mật khẩu phải chứa ít nhất một chữ in hoa và số"),
      body("password")
        .custom((value) => {
          if (value.length < 6 || value.length > 14) {
            return false;
          }
          return true;
        })
        .withMessage("Mật khẩu phải có độ dài từ 6-14 kí tự"),
    ];
  },

  forgotPassword: () => {
    return [
      body("email").not().isEmpty().withMessage("Email không được bỏ trống"),
      body("email").isEmail().withMessage("Email không đúng định dạng"),
    ];
  },

  updatePassword: () => {
    return [
      body("email").not().isEmpty().withMessage("Email không được bỏ trống"),
      body("email").isEmail().withMessage("Email không đúng định dạng"),
      body("otp").not().isEmpty().withMessage("Số OTP không được bỏ trống"),
    ];
  },

  checkAccessToken: async (req, res, next) => {
    const user = await accountRepository.findByPhoneNumber(
      req.decoded.phoneNumber
    );
    if (!user) {
      return handlerNotFoundError(req, res, "Không tìm thấy tài khoản này");
    }

    if (user.access_token !== req.headers.authorization) {
      return handlerBadRequestError(
        req,
        res,
        "Đã đăng nhập trên thiết bị khác!!"
      );
    }
    next();
  },
};
