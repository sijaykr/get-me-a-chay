import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  username: { type: String },
  profilepic: { type: String },
  coverpic: { type: String },
  razorpayid: { type: String },
  razorpaysecret: { type: String },
}, { timestamps: true });

const User = mongoose.models.User || model("User", UserSchema);

export default User;
