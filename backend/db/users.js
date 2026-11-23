import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    role:{
      type: String,
      required: true,
    },
      status:{
      type: String,
      required: true,
    },
      failedAttempts:{
      type: Number,
      default: 0,
    },
      lockUntil:{
      type: String,
      default: null,
    }
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
