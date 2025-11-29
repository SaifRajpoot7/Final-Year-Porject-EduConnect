import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAppContext } from "../../contexts/AppContext";
import axios from "axios";
import { useNavigate } from "react-router";


const EmailVerificationPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false)
  const { backendUrl, checkIsLoggedIn } = useAppContext();
  const navigate = useNavigate();

  const onSubmit = async (otpData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(backendUrl + '/api/user/verifyaccount', otpData);
      if (response.data.success) {
        toast.success("Email verified successfully.");
        setIsSubmitting(false);
        await checkIsLoggedIn();
        navigate('/dashboard')
      } else {
        toast.error(response.data.message || "Invalid Otp.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while verifing email.");
    }
  };

  const handleResend = async () => {

    if (resendCooldown > 0) return;
    try {
      const response = await axios.post(backendUrl + '/api/user/generateotp');
      if (response.data.success) {
        toast.success("Otp sent successfully.");
      } else {
        toast.error(response.data.message || "Failed to send Otp.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while sending Otp.");
    }

    if (setResendSuccess) { setResendCooldown(30); }// 30-second cooldown
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center text-gray-800 mb-6">
          Email Verification
        </motion.h2>
        <motion.p variants={itemVariants} className="text-center text-gray-500 mb-6">
          Enter the verification code sent to your email
        </motion.p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 mb-2">Verification Code</label>
            <input
              type="text"
              placeholder="Enter code"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              {...register("otp", { required: "Verification code is required" })}
            />
            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-green-500 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>

        <motion.div variants={itemVariants} className="text-center mt-4">
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`text-blue-500 hover:underline font-semibold disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : "Resend Code"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
