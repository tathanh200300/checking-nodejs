const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { tokenTypes } = require("../configs");

const TokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    token: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [tokenTypes.ACCESSS, tokenTypes.REFRESH],
    },

    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "createAt",
      updatedAt: "updateAt",
    },
  }
);

module.exports = mongoose.model("tokens", TokenSchema);
