import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    post: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const postModel = mongoose.model("post", postSchema);

export default postModel;
