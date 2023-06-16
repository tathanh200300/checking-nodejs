const { JobDescription } = require("../models");

module.exports = {
  create: async function (newJD) {
    const jd = await JobDescription.create(newJD);
    if (!jd) {
      return null;
    }
    return {
      status: "JD Được khởi tạo",
    };
  },

  findAllJD: async function () {
    const jd = await JobDescription.find();
    if (!jd) {
      return null;
    }
    return jd;
  },

  findOneJDById: async function (id) {
    const jd = await JobDescription.findOne({ _id: id });
    if (!jd) {
      return null;
    }
    return jd;
  },

  deleteOneJD: async function (id) {
    try {
      const jd = await JobDescription.deleteOne(
        { _id: id, isDeleted: { $ne: false } },
        { isDeleted: true },
        { new: true }
      );
      return jd;
    } catch (error) {
      return error;
    }
  },

  updateById: async function (id, where) {
    try {
      await JobDescription.updateOne({ _id: id }, { $set: where });
      const user = await JobDescription.findOne({ _id: id });
      return user;
    } catch (error) {
      return error;
    }
  },
};
