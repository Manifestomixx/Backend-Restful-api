const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxlength: 1200,
      trim: true,
    },
    imagePath: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
  },
  { timestamps: true }
);

const POST = mongoose.model("post", postSchema);
module.exports = POST;
