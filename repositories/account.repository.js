const { AccountModel } = require("../models");

module.exports = {
  create: async function (newAcc) {
    const user = await AccountModel.create(newAcc);
    if (!user) {
      return null;
    }
    return {
      _id: user.id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      enterprise: user.enterprise,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },

  findAll: async function () {
    const user = await AccountModel.find();
    if (!user) {
      return null;
    }
    return user;
  },

  update: async function (id, where) {
    try {
      await AccountModel.updateOne({ _id: id }, { $set: where });
      const user = await AccountModel.findOne({ _id: id });
      return user;
    } catch (error) {
      return error;
    }
  },

  deleteMany: async function (ids) {
    try {
      const user = await AccountModel.updateMany(
        { _id: { $in: ids }, isDeleted: { $ne: false } },
        { isDeleted: true },
        { new: true }
      );
      return user;
    } catch (error) {
      return error;
    }
  },

  findByPhoneOrUsername: async function (findParams) {
    const user = await AccountModel.findOne(findParams);
    if (!user) {
      return null;
    }
    return user;
  },

  findUserById: async function (findParams) {
    const user = await AccountModel.findOne(findParams);
    if (!user) {
      return null;
    }
    return user;
  },

  findByEmail: async function (email) {
    const user = await AccountModel.findOne({ email: email });
    if (!user) {
      return null;
    }
    return user;
  },

  findByPhoneNumber: async function (phoneNumber) {
    const user = await AccountModel.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      return null;
    }
    return user;
  },

  findByEmailAndOTP: async function (email, otp) {
    const user = await AccountModel.findOne({ email: email, otp: otp });
    if (!user) {
      return null;
    }
    return user;
  },

  findByUsernameOrPassword: async function (findParams) {
    const user = await AccountModel.findOne(findParams);
    if (!user) {
      return null;
    }
    return user;
  },
};
