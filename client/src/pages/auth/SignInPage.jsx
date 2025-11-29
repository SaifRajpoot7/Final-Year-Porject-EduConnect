import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAppContext } from "../../contexts/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";

const SignInPage = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const { backendUrl, getUserData, checkIsLoggedIn } = useAppContext();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const signInData = {
      email: data.email,
      password: data.password
    }

    try {
      axios.defaults.withCredentials = true
      const response = await axios.post(backendUrl + '/api/user/signin', signInData);
      if (response.data.success) {
        toast.success("Signed in successfully!");
        await checkIsLoggedIn();
        navigate('/')
      } else {
        toast.error(response.data.message || "Failed to sign in.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while sign in to account.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80ch] flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8"
      >
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-gray-800 mb-6"
        >
          Sign In
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-500 mt-4"
        >
          Don't have an account? <span className="text-blue-500 cursor-pointer">Sign Up</span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SignInPage;
