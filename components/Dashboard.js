"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchuser, updateProfile } from "@/actions/userserveraction";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Memoized getData to satisfy useEffect dependencies
  const getData = useCallback(async () => {
    try {
      const user = await fetchuser(session.user.name);
      setForm(user);
    } catch (err) {
      const newUser = {
        name: session.user.name || "",
        username: session.user.name,
        email: session.user.email || "",
        profilepic: "",
        coverpic: "",
        razorpayid: "",
        razorpaysecret: "",
      };
      await updateProfile(new Map(Object.entries(newUser)), session.user.name);
      const user = await fetchuser(session.user.name);
      setForm(user);
    }
  }, [session?.user?.name, session?.user?.email]);


  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else {
      getData();
    }
  }, [session, router, getData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);

    const oldUsername = session.user.name;
    const formData = new Map(Object.entries(form));
    const res = await updateProfile(formData, oldUsername);

    setLoading(false);

    if (res?.error) {
      toast.error(res.error, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
    } else {
      toast.success("Profile Updated", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });

      if (oldUsername !== form.username) {
        toast("🔁 Logging out to refresh session...");
        await signOut({ callbackUrl: "/Login" });
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto py-5 px-6">
        <h1 className="text-center my-5 text-3xl font-bold">Welcome to your Dashboard</h1>

        <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="my-2">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
            <input
              value={form.name || ""}
              onChange={handleChange}
              type="text"
              name="name"
              id="name"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
            />
          </div>

          {/* Email */}
          <div className="my-2">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input
              value={form.email || ""}
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
            />
          </div>

          {/* Username */}
          <div className="my-2">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
            <input
              value={form.username || ""}
              onChange={handleChange}
              type="text"
              name="username"
              id="username"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
            />
          </div>

          {/* Profile Pic */}
          <div className="my-2">
            <label htmlFor="profilepic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Picture</label>
            <input
              value={form.profilepic || ""}
              onChange={handleChange}
              type="text"
              name="profilepic"
              id="profilepic"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
            />
          </div>

          {/* Cover Pic */}
          <div className="my-2">
            <label htmlFor="coverpic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cover Picture</label>
            <input
              value={form.coverpic || ""}
              onChange={handleChange}
              type="text"
              name="coverpic"
              id="coverpic"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
            />
          </div>

          {/* Razorpay ID */}
          <div className="my-2">
            <label htmlFor="razorpayid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razorpay Id</label>
            <input
              value={form.razorpayid || ""}
              onChange={handleChange}
              type="text"
              name="razorpayid"
              id="razorpayid"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
            />
          </div>

          {/* Razorpay Secret */}
          <div className="my-2">
            <label htmlFor="razorpaysecret" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razorpay Secret</label>
            <input
              value={form.razorpaysecret || ""}
              onChange={handleChange}
              type="text"
              name="razorpaysecret"
              id="razorpaysecret"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
            />
          </div>

          {/* Submit */}
          <div className="my-6">
            <button
              type="submit"
              disabled={loading}
              className="block w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 font-medium text-sm"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Dashboard;
