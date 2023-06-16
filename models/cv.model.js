const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

/**
 * Curriculum Vitae Schema
 * @params: fileName, status, owner, classification, skillScore, personalityScore,
 * 					summary, jobAppoveStatus, roleApprove, salaryApprove, durationApprove,
 * 					guaranteeTime, guaranteeNote, major
 *
 */
const CVSchema = new Schema(
  {
    _id: {
      type: Number,
      default: null,
    },

    fileName: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      trim: true,
      default: null,
    },

    owner: {
      type: Number,
      require: true,
    },

    classification: {
      type: String,
      trim: true,
      default: null,
    },

    skillScore: {
      type: Number,
      default: null,
    },

    personalityScore: {
      type: Number,
      default: null,
    },

    summary: {
      type: String,
      default: null,
    },

    jobApproveStatus: {
      type: [],
      default: null,
    },

    roleApprove: {
      type: String,
      trim: true,
      default: null,
    },

    salaryApprove: {
      type: String,
      default: null,
    },

    durationApprove: {
      type: String,
      default: null,
    },

    guaranteeTime: {
      type: [],
      startTime: Date,
      endTime: Date,
      default: null,
    },

    guaranteeNote: {
      type: String,
      trim: true,
      default: null,
    },

    major: {
      type: String,
      require: true,
      trim: true,
      default: "Freelancer",
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

module.exports = mongoose.model("CV", CVSchema);
