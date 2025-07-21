import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/Payment";
import connectDB from "@/db/connectDB";
import User from "@/models/User";

export const POST = async (req) => {
  await connectDB();

  const formData = await req.formData();
  const body = Object.fromEntries(formData.entries());

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  const payment = await Payment.findOne({ oid: razorpay_order_id });
  if (!payment) {
    return NextResponse.json(
      { success: false, message: "Order Id not found" },
      { status: 404 }
    );
  }

  const user = await User.findOne({ username: payment.to_username });
  if (!user || !user.razorpaysecret) {
    return NextResponse.json(
      { success: false, message: "User or Razorpay secret not found" },
      { status: 500 }
    );
  }

  const isValid = validatePaymentVerification(
    { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
    razorpay_signature,
    user.razorpaysecret
  );

  if (!isValid) {
    return NextResponse.json(
      { success: false, message: "Payment Verification Failed" },
      { status: 400 }
    );
  }

  // ✅ Just mark as done, because name, message, amount already saved in DB
  const updated = await Payment.findOneAndUpdate(
    { oid: razorpay_order_id },
    { done: true },
    { new: true }
  );

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_URL}/${updated.to_username}?paymentdone=true`
  );
};
