import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose?.connection?.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/chai");
  } catch (err) {
  }
};

export default connectDB;
export const runtime = "nodejs"; // optional but okay
export const dynamic = "force-dynamic"; // optional but okay, ensures no caching
