"use server";

import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import connectDB from "@/db/connectDB";
import User from "@/models/User";
import mongoose from "mongoose";

export const initiate = async (amount, to_username, paymentform) => {
  console.log("🔍 to_username received in initiate:", to_username);

  await connectDB();

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("✅ Collections in DB:", collections.map(c => c.name));

  const user = await User.findOne({ username: to_username });
  console.log("🎯 User fetched:", user);

  if (!user) {
    throw new Error(`User not found: ${to_username}`);
  }

  const mode = process.env.RAZORPAY_ENV || "test"; // fallback to "test"

  const razorpayId =
    mode === "live"
      ? user.razorpayid || process.env.RAZORPAY_LIVE_KEY_ID
      : process.env.RAZORPAY_TEST_KEY_ID;

  const razorpaySecret =
    mode === "live"
      ? user.razorpaysecret || process.env.RAZORPAY_LIVE_KEY_SECRET
      : process.env.RAZORPAY_TEST_KEY_SECRET;

  console.log("🔁 Razorpay Mode:", mode);
  console.log("✅ Razorpay ID:", razorpayId);
  console.log("🔐 Razorpay Secret present?", !!razorpaySecret);

  if (!razorpayId || !razorpaySecret) {
    throw new Error(`Razorpay credentials not found for user: ${to_username}`);
  }

  const razorpay = new Razorpay({
    key_id: razorpayId,
    key_secret: razorpaySecret,
  });

  const options = {
    amount: Number(amount),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  await Payment.create({
    oid: order.id,
    amount: amount / 100,
    to_username,
    name: paymentform.name,
    message: paymentform.message,
  });

  return order;
};

export const fetchuser = async (username) => {
  console.log("📌 fetching user:", username);
  await connectDB();

  const user = await User.findOne({ username }).lean();

  console.log("🎯 User fetched:", user);

  if (!user) throw new Error("User not found");

  return JSON.parse(JSON.stringify(user));
};

export const fetchpayments = async (username) => {
  await connectDB();

  const payments = await Payment.find({ to_username: username, done: true })
    .sort({ amount: -1 })
    .limit(10)
    .lean();

  return JSON.parse(JSON.stringify(payments));
};

export const updateProfile = async (data, oldusername) => {
  await connectDB();
  const ndata = Object.fromEntries(data);

  if (oldusername !== ndata.username) {
    const existingUser = await User.findOne({ username: ndata.username });
    if (existingUser) {
      return { error: "Username already exists" };
    }
    await User.updateOne({ email: ndata.email }, ndata);
await Payment.updateMany({ to_username: oldusername }, { to_username: ndata.username });
  } else {
    await User.updateOne({ email: ndata.email }, ndata);
  }
};
