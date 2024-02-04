import mongoose from "mongoose";
import { DATABASE_URL, NODE_ENV } from "./env";

async function connectDB() {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log(`Connected to the ${NODE_ENV} database...`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default connectDB;
