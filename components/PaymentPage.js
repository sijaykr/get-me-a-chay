"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchuser, fetchpayments, initiate } from "@/actions/userserveraction";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from "react-toastify";

const PaymentPage = ({ username }) => {
  const [sdkLoaded, setSdkLoaded] = useState(false); // ✅ added Razorpay SDK loaded flag

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("✅ Razorpay SDK loaded");
      setSdkLoaded(true);
    };
    script.onerror = () => {
      console.error("❌ Razorpay SDK failed to load");
    };
    document.body.appendChild(script);
  }, []);

  const [paymentform, setPaymentForm] = useState({
    name: "",
    message: "",
    amount: "",
  });

  const [currentUser, setCurrentUser] = useState({});
  const [payments, setPayments] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (searchParams.get("paymentdone") === "true") {
      toast('Thanks for your donation!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      router.push(`/${username}`);
    }
  }, [searchParams, router, username]);

  const getData = async () => {
    try {
      const user = await fetchuser(username);
      setCurrentUser(user);
      const dbPayments = await fetchpayments(username);
      setPayments(dbPayments);
    } catch (err) {
      console.error("❌ Failed fetching user/payments", err);
    }
  };

  const handleChange = (e) => {
    setPaymentForm({ ...paymentform, [e.target.name]: e.target.value });
  };

  const pay = async (amtInPaise) => {
    if (!paymentform.name || !paymentform.message || !amtInPaise) {
      alert("Please fill in all fields before paying.");
      return;
    }

    try {
      const res = await initiate(amtInPaise, username, paymentform);
      const orderId = res?.id;

      const options = {
key: currentUser.razorpayid || process.env.NEXT_PUBLIC_KEY_ID,
  amount: amtInPaise,
  currency: "INR",
  name: "Buy Me a Chai",
  description: "Support your favorite creator",
  image: "https://example.com/your_logo",
  order_id: orderId,
  callback_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/razorpay`,
  prefill: {
    name: paymentform.name,
    email: "email@example.com",
    contact: "9999999999",
  },
  notes: {
    name: paymentform.name,
    message: paymentform.message,
    amount: amtInPaise / 100, // in rupees
    to_username: username,    // ✅ this is crucial
  },
  theme: {
    color: "#3399cc",
  },
};


      // ✅ Only open Razorpay if SDK is fully loaded
      if (sdkLoaded && typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        console.error("⚠ Razorpay SDK not loaded");
      }
    } catch (err) {
toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen">
        {/* Header Cover Image Section */}
        <div className="relative">
          <img
            className="object-cover w-full h-[350px]"
            src={currentUser.coverpic || "/default-cover.jpg"}
            alt="cover"
          />
          <div className="absolute bottom-[-75px] left-1/2 transform -translate-x-1/2 border-4 border-white rounded-full bg-gray-200 p-2">
            <img
              className="rounded-full w-[150px] h-[150px] object-cover"
src={currentUser.coverpic || "/default-cover.jpg"}
              alt="avatar"
            />
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center gap-2 px-4">
          <div className="font-bold text-lg">@{username}</div>
          <div className="text-gray-500 text-sm">
            Lets help {username} with a cup of chai!
          </div>
          <div className="text-gray-500 text-sm">
            {payments.length} supporters, ₹{payments.reduce((a, b) => a + b.amount, 0)} raised
          </div>

          <div className="flex flex-col md:flex-row gap-4 my-10 w-full max-w-4xl">
            {/* Supporter List */}
            <div className="w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-6">
              <h2 className="text-3xl font-bold mb-4 text-center">Supporters</h2>
              <ul className="space-y-2 text-xl text-center">
                {payments.length === 0 ? (
                  <li>No payments yet</li>
                ) : (
                  payments.map((p, idx) => (
                    <li key={idx} className="my-2 flex gap-2 items-center">
                      <img src="/prop.gif" className="w-16 rounded-full" alt="" />
                      <span>
                        {p.name} donated <span className="font-bold">₹{p.amount}</span> with message "{p.message}"
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Payment Form */}
            <div className="w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-6 text-center">
              <h2 className="text-2xl font-bold my-5">Make a Payment</h2>
              <div className="flex flex-col gap-2">
                <input
                  onChange={handleChange}
                  value={paymentform.name}
                  name="name"
                  type="text"
                  className="w-full text-white font-bold p-3 rounded-lg bg-slate-600"
                  placeholder="Enter Name"
                />
                <input
                  onChange={handleChange}
                  value={paymentform.message}
                  name="message"
                  type="text"
                  className="w-full text-white font-bold p-3 rounded-lg bg-slate-600"
                  placeholder="Enter Message"
                />
                <input
                  onChange={handleChange}
                  value={paymentform.amount}
                  name="amount"
                  type="number"
                  className="w-full text-white font-bold p-3 rounded-lg bg-slate-600"
                  placeholder="Enter Amount"
                />
                <button
                  type="button"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg hover:cursor-pointer"
                  onClick={() => pay(Number(paymentform.amount) * 100)}
                  disabled={
                    paymentform.name.length < 3 ||
                    paymentform.message.length < 4 ||
                    paymentform.amount.length < 1
                  }
                >
                  Pay ₹{paymentform.amount || "0"}
                </button>
              </div>

              {/* Suggested Payments */}
              <div className="flex gap-2 mt-5">
                <button
                  className="bg-sky-600 p-3 rounded-lg"
                  onClick={() => pay(10000)}
                >
                  Pay ₹100
                </button>
                <button
                  className="bg-sky-600 p-3 rounded-lg"
                  onClick={() => pay(20000)}
                >
                  Pay ₹200
                </button>
                <button
                  className="bg-sky-600 p-3 rounded-lg"
                  onClick={() => pay(30000)}
                >
                  Pay ₹300
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
