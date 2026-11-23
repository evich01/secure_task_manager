import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected succesfully");
  } catch (error) {
    console.error("error:", error);
  }
};

export default connectDB;
