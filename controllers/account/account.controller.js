const accountRepository = require("../../repositories/account.repository");
const { validationResult } = require("express-validator");
const { _errorFormatter } = require("../../utils/helper.util");
const logger = require("../../utils/logger.util");
const auth = require("../../utils/validatetoken.util");
const bcrypt = require("bcryptjs"); // Thư viện mã hóa mật khẩu
const nodemailer = require("nodemailer"); // Thư viện gửi otp cho email
const moment = require("moment"); // Thư viện datetime
const otpGenerator = require("otp-generator"); // Thư viện auto khởi tạo OTP
const {
  handlerSuccess,
  handlerBadRequestError,
  handlerNotFoundError,
  handlerPermissionDeniedError,
} = require("../../utils/handler.response.util");
const { token } = require("morgan");

function generateUserId() {
  const moment = require("moment");
  return moment().format("YYYYMMDDHHmmss");
}

const SALT_WORK_FACTOR = 10;

module.exports = {
  classname: "AccountController",

  /**
   * Đăng ký tài khoản
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns: Thông tin user được khởi tạo
   */
  register: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = _errorFormatter(errors.array());
      return handlerBadRequestError(req, res, errorMsg);
    }

    try {
      const newAccount = {
        // logo: req.body.logo,
        _id: generateUserId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        otp: {
          value: req.body.otp.toString(),
          expires: "2p",
        },
        role: req.body.role,
        enterprise: req.body.enterprise,
        isDeleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }; // Thông tin form đăng ký

      const findParams = {
        $or: [
          { firstName: req.body.firstName },
          { lastName: req.body.lastNameName },
          { phoneNumber: req.body.phoneNumber },
        ],
      }; // Khởi tạo đối số truy vấn

      const user = await accountRepository.findByPhoneOrUsername(findParams);
      if (user) {
        return handlerBadRequestError(
          req,
          res,
          "Tên tài khoản hoặc số điện thoại đăng ký đã tồn tại!"
        );
      }

      const createAccount = await accountRepository.create(newAccount);
      return handlerSuccess(req, res, createAccount);
    } catch (error) {
      logger.error(new Error(error));
      next(error);
    }
  },

  // readUserData: async (req, res, next) => {

  // }

  /**
   * Đăng nhập
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns: Các trường hợp nhập sai mật khẩu, email, thông tin tài khoản, accessToken, refreshToken
   */
  login: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = _errorFormatter(errors.array());
      return handlerBadRequestError(req, res, errorMsg);
    }

    try {
      const account = {
        email: req.body.email,
        password: req.body.password,
      };

      let comparePassword;
      const findParams = {
        $or: [{ email: account.email }, { password: account.password }],
      };

      const user = await accountRepository.findByUsernameOrPassword(findParams);
      if (!user) {
        return handlerBadRequestError(
          req,
          res,
          "Tài khoản hoặc mật khẩu bị sai!"
        );
      }

      if (user.isDeleted === true) {
        return handlerBadRequestError(req, res, "Tài khoản đã bị xóa!");
      }

      await user.comparePassword(account.password).then((data) => {
        comparePassword = data;
      });

      if (!comparePassword) {
        return handlerBadRequestError(
          req,
          res,
          "Tài khoản hoặc mật khẩu bị sai!"
        );
      }

      const accountInfo = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      };

      const accessToken = auth.generateAccessToken(accountInfo);
      const refreshToken = auth.generateRefreshToken({ id: user._id });

      //update user

      await accountRepository.update(user._id, {
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      res.cookie("token", accessToken);

      return handlerSuccess(req, res, {
        info: accountInfo,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      logger.error(new Error(error));
      next(error);
    }
  },

  /**
   * Quên mật khẩu
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns: Trạng thái gửi OTP (success, fail)
   */
  async forgotPassword(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = _errorFormatter(errors.array());
      return handlerBadRequestError(req, res, errorMsg);
    }
    try {
      const user = await accountRepository.findByEmail(req.body.email);
      if (!user) {
        return handlerNotFoundError(req, res, "Không tìm thấy tài khoản này");
      } // Truy vấn theo email

      const otpCode = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false,
      }); // Khởi tạo OTP

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "autobankingamai@gmail.com",
          pass: "njxcxkajpcizwyel",
        },
      }); // Khởi tạo gmail nhận otp

      var mailOptions = {
        from: "autobankingamai@gmail.com",
        to: user.email,
        subject: "Sending OTP for reset password",
        text: `OTP: ${otpCode}`,
      }; // Cấu hình thông tin cần gửi

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      }); // Gửi mailOptions

      await accountRepository.update(user._id, {
        otp: otpCode,
        otpExpiredAt: moment().add(10, "minutes").toDate(),
      }); // Cập nhật otp và thời gian hết hạn

      return handlerSuccess(req, res, "SEND EMAIL SUCCESSFULLY !!");
    } catch (error) {
      logger.error(new Error(error));
      next(error);
    }
  },

  /**
   * Đổi mật khẩu
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns: Thông báo trạng thái thay đổi mật khẩu
   */
  async changePasswords(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = _errorFormatter(errors.array());
      return handlerBadRequestError(req, res, errorMsg);
    }
    try {
    } catch (error) {
      logger.error(new Error(error));
      next(error);
    }
  },

  /**
   * Cập nhật mật khẩu bằng OTP
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns: Trạng thái tìm kiếm và mật khẩu được cập nhật
   */
  async updatePasswordByOTP(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = _errorFormatter(errors.array());
      return handlerBadRequestError(req, res, errorMsg);
    }
    try {
      const account = await accountRepository.findByEmailAndOTP(
        req.body.email,
        req.body.otp
      ); // Tìm tài khoản bằng email và OTP
      if (!account) {
        return handlerNotFoundError(req, res, "Không tìm thấy tài khoản này");
      }

      if (moment(account.otpExpiredAt) < moment()) {
        return handlerBadRequestError(req, res, "OTP đã hết hạn");
      }
      const newPassword = req.body.newPassword;
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      const update = await accountRepository.update(account._id, {
        password: newPasswordHash,
      });
      if (!update) {
        return handlerNotFoundError(req, res, "Không tìm thấy tài khoản này");
      }
      return handlerSuccess(req, res, update);
    } catch (error) {
      logger.error(new Error(error));
      next(error);
    }
  },
};
