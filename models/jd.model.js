const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JDSchema = new Schema(
  {
    _id: {
      type: Number,
      default: null,
    },

    customerID: {
      type: Number,
      require: true,
    },

    jobName: {
      type: String,
      require: true,
      trim: true,
    },

    experimence: {
      type: String,
      require: true,
      trim: true,
    },

    companyName: {
      type: String,
      require: true,
      trim: true,
    },

    location: {
      type: String,
      require: true,
      trim: true,
    },

    salary: {
      type: Number,
      require: true,
      trim: true,
    },

    description: {
      type: [],
      require: true,
      default: [{ abc: "xyz" }, { def: "klm" }],
    },

    requiremences: {
      type: [],
      require: true,
      default: [{ experimence: "2 years" }, { language: "JS, python, C++" }],
    },

    CVMatched: {
      type: [],
      require: true,
      default: null,
    },

    status: {
      type: String,
      // require: true,
      trim: true,
      default: "Ready to work",
    },

    guarantee: {
      type: [],
      startTime: Date,
      endTime: Date,
      require: true,
      default: "Fulltime",
    },

    benefits: {
      type: [],
      require: true,
      default: [{ insurance: "abcdefgh" }, { environment: "dynamic" }],
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

module.exports = mongoose.model("JD", JDSchema);
