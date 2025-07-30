import mongoose from "mongoose"; 
import { Schema,model } from "mongoose";
const PaymentSchema = new mongoose.Schema({
  name: String,
  message: String,
  amount: Number,
  to_username: String,
  oid: String,
  done: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.models?.Payment || mongoose.model("Payment", PaymentSchema);
