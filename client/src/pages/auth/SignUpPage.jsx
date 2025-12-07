import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAppContext } from "../../contexts/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";
import { Eye, EyeClosed } from "lucide-react";

const SignUpPage = () => {
  const navigate = useNavigate();

  const { backendUrl } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    const signupDetails = {
      fullName: data.fullName,
      email: data.email,
      password: data.password
    };

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        backendUrl + "/api/user/signup",
        signupDetails
      );

      if (response.data.success) {
        toast.success("Account created successfully!");
        navigate("/account-verification");
      } else {
        toast.error(response.data.message || "Failed to create account.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "An error occurred while creating account."
      );
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
          Create Account
        </motion.h2>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Full Name */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-gray-700 mb-2">Password</label>

            <div className="w-full p-3 rounded-lg border border-gray-300 flex">
              <input
                type={showPassword ? "password" : "text"}
                placeholder="Enter your password"
                className="w-full focus:outline-none"
                {...register("password", { required: "Password is required" })}
              />

              {showPassword ? (
                <Eye
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 cursor-pointer"
                />
              ) : (
                <EyeClosed
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 cursor-pointer"
                />
              )}
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <label className="block text-gray-700 mb-2">Confirm Password</label>

            <div className="w-full p-3 rounded-lg border border-gray-300 flex">
              <input
                type={showConfirmPassword ? "password" : "text"}
                placeholder="Confirm your password"
                className="w-full focus:outline-none"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === watch("password") ||
                    "Passwords do not match"
                })}
              />

              {showConfirmPassword ? (
                <Eye
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-500 cursor-pointer"
                />
              ) : (
                <EyeClosed
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="text-gray-500 cursor-pointer"
                />
              )}
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Link to Sign In */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-500 mt-4"
        >
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
