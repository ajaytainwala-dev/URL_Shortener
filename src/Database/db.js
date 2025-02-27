import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    await mongoose.set("strictQuery", false);
    await mongoose.connect(mongoURI);
    console.log("Mongo connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

export default connectToMongo;