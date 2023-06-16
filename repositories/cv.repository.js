const { CurriculumVitae } = require("../models");

module.exports = {
  create: async function (newCV) {
    const cv = await CurriculumVitae.create(newCV);
    if (!cv) {
      return null;
    }
    return {
      status: "CV Được khởi tạo",
    };
  },

  findAllCV: async function () {
    const cv = await CurriculumVitae.find();
    if (!cv) {
      return null;
    }
    return cv;
  },

  findOneCVById: async function (id) {
    const cv = await CurriculumVitae.findOne({ _id: id });
    if (!cv) {
      return null;
    }
    return cv;
  },

  deleteOneCVById: async function (id) {
    try {
      const cv = await CurriculumVitae.deleteOne(
        { _id: id, isDeleted: { $ne: false } },
        { isDeleted: true },
        { new: true }
      );
      return cv;
    } catch (error) {
      return error;
    }
  },

  updateById: async function (id, where) {
    try {
      await CurriculumVitae.updateOne({ _id: id }, { $set: where });
      const user = await CurriculumVitae.findOne({ _id: id });
      return user;
    } catch (error) {
      return error;
    }
  },
};
