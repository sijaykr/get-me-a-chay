import mongoose from "mongoose";

const connectDB = async () => {
  // If already connected, reuse connection
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "chai",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
  }
};

export default connectDB;

// Optional Vercel hints
export const runtime = "nodejs"; 
export const dynamic = "force-dynamic"; 
