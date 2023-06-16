const mongoose = require("mongoose"); // Import thư viện MongoDB
const bcrypt = require("bcryptjs"); // Thư viện mã hóa và giải mã mật khẩu
const { isNull } = require("lodash");
const roles = require("../configs/roles.config");
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

/**
 * UserSchema
 * @params: email, firstName, lastName, password, role, phoneNumber, dateOfBirth, address
 *          enterprise, otp, createdAt, updatedAt
 * @accessToken: xác thực người dùng
 * @refreshToken: khởi tạo lại accessToken khi nó hết hạn
 */

const UserSchema = new Schema(
  {
    _id: {
      type: Number,
      default: null,
    },

    logo: {
      type: String,
      default: null,
    },

    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      // enum: roles,
      default: "user",
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    address: {
      type: String,
      trim: true,
      default: null,
    },

    enterprise: {
      type: String,
      trim: true,
    },

    otp: {
      type: {
        value: String,
        expire: Date,
      },
      require: true,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },

    access_token: {
      type: String,
      required: false,
      trim: true,
    },

    refresh_token: {
      type: String,
      required: false,
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },

    deviceToken: {
      type: [],
    },

    fileId: {
      type: String([]),
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "createAt",
      updatedAt: "updateAt",
    },
    toJSON: {
      virtuals: true,
    },
    autoIndex: true,
  }
);

/**
 * Presave mongodb middleware
 * @return: Mật khẩu đã được mã hóa
 */
UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**So sánh mật khẩu nhập vào và mật khẩu được mã hóa
 * @return: kết quả so sánh
 */
UserSchema.methods.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password).then((data) => {
      return resolve(data);
    });
  });
};

module.exports = mongoose.model("User", UserSchema);
