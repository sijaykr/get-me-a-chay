"use server";

import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import connectDB from "@/db/connectDB";
import User from "@/models/User";
import mongoose from "mongoose";

// Initiate Razorpay payment
export const initiate = async (amount, to_username, paymentform) => {
  await connectDB();

  const user = await User.findOne({ username: to_username });
  if (!user) throw new Error(`User not found: ${to_username}`);

  const mode = process.env.RAZORPAY_ENV || "test";

  const razorpayId =
    mode === "live"
      ? user.razorpayid || process.env.RAZORPAY_LIVE_KEY_ID
      : process.env.RAZORPAY_TEST_KEY_ID;

  const razorpaySecret =
    mode === "live"
      ? user.razorpaysecret || process.env.RAZORPAY_LIVE_KEY_SECRET
      : process.env.RAZORPAY_TEST_KEY_SECRET;

  if (!razorpayId || !razorpaySecret)
    throw new Error(`Razorpay credentials not found for user: ${to_username}`);

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

// Fetch user with profilepic, coverpic, and Razorpay keys
export const fetchuser = async (username) => {
  await connectDB();

  let user = await User.findOne({ username }).lean();
  if (!user) throw new Error("User not found");

  // Auto-fill profilepic/coverpic from GitHub if missing or empty
  if (!user.profilepic?.trim() || !user.coverpic?.trim()) {
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (res.ok) {
        const data = await res.json();
        user.profilepic = data.avatar_url;
        user.coverpic = `https://opengraph.githubassets.com/1/${username}`;
        await User.updateOne(
          { username },
          { profilepic: user.profilepic, coverpic: user.coverpic }
        );
      }
    } catch (err) {
      console.error("GitHub fetch failed:", err);
      user.profilepic = user.profilepic || "/avatar.gif";
      user.coverpic = user.coverpic || "/default-cover.jpg";
    }
  }

  // Auto-fill Razorpay keys if missing
  user.razorpayid =
    user.razorpayid ||
    (process.env.RAZORPAY_ENV === "live"
      ? process.env.RAZORPAY_LIVE_KEY_ID
      : process.env.RAZORPAY_TEST_KEY_ID);

  user.razorpaysecret =
    user.razorpaysecret ||
    (process.env.RAZORPAY_ENV === "live"
      ? process.env.RAZORPAY_LIVE_KEY_SECRET
      : process.env.RAZORPAY_TEST_KEY_SECRET);

  await User.updateOne(
    { username },
    { razorpayid: user.razorpayid, razorpaysecret: user.razorpaysecret }
  );

  return JSON.parse(JSON.stringify(user));
};

// Fetch last 10 successful payments
export const fetchpayments = async (username) => {
  await connectDB();

  const payments = await Payment.find({ to_username: username, done: true })
    .sort({ amount: -1 })
    .limit(10)
    .lean();

  return JSON.parse(JSON.stringify(payments));
};

// Update user profile and payments if username changed
export const updateProfile = async (data, oldusername) => {
  await connectDB();
  const ndata = Object.fromEntries(data);

  if (oldusername !== ndata.username) {
    const existingUser = await User.findOne({ username: ndata.username });
    if (existingUser) return { error: "Username already exists" };

    await User.updateOne({ email: ndata.email }, ndata);
    await Payment.updateMany(
      { to_username: oldusername },
      { to_username: ndata.username }
    );
  } else {
    await User.updateOne({ email: ndata.email }, ndata);
  }
};
