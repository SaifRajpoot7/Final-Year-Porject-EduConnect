import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../contexts/AppContext";
import { motion } from "framer-motion";

const QuizSubmissionModal = ({ open, onClose, quizId, questions }) => {
    const { backendUrl, courseId } = useAppContext();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [timer, setTimer] = useState(60);
    const [answers, setAnswers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = questions[currentIndex];

    useEffect(() => {
        if (!open) return;

        setTimer(60);

        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    handleSkip();
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [currentIndex, open]);

    const handleAnswer = (optionIndex) => {
        addAnswer(optionIndex);
    };

    const handleSkip = () => {
        addAnswer(-1);
    };

    const addAnswer = (selectedOptionIndex) => {
        const newAnswer = {
            questionIndex: currentIndex,
            selectedOptionIndex,
        };

        setAnswers((prev) => [...prev, newAnswer]);

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            submitQuiz([...answers, newAnswer]);
        }
    };

    const submitQuiz = async (finalAnswers) => {
        try {
          setIsSubmitting(true);
          const response = await axios.post(
            `${backendUrl}/api/quiz/submit/${quizId}?courseId=${courseId}`,
            { answers: finalAnswers },
            { withCredentials: true }
          );

          if (!response.data.success) {
            toast.error(response.data.message || "Failed to submit quiz.");
          } else {
            toast.success("Quiz submitted successfully!");
          }

          setIsSubmitting(false);
          onClose();
        } catch (err) {
          setIsSubmitting(false);
          toast.error(err.response?.data?.message || "Error submitting quiz");
        }
    };

    if (!open || !currentQuestion) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={22} />
                </button>

                {/* Timer */}
                <motion.div
                    className="text-right text-lg font-semibold text-red-600 mb-3 mt-4"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    Time Left: {timer}s
                </motion.div>

                {/* Question */}
                <h2 className="text-xl font-semibold mb-4">
                    Question {currentIndex + 1} of {questions.length}
                </h2>

                <p className="text-gray-800 mb-6">{currentQuestion.questionText}</p>

                {/* Options */}
                <div className="space-y-3">
                    {currentQuestion.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className="w-full text-left border border-gray-300 rounded-lg p-3 hover:bg-blue-50"
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {/* Skip */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSkip}
                        className="text-gray-600 hover:text-gray-800 underline"
                    >
                        Skip Question
                    </button>
                </div>

                {/* Submitting Loader */}
                {isSubmitting && (
                    <p className="text-center mt-4 text-blue-600 font-medium">
                        Submitting...
                    </p>
                )}
            </div>
        </div>
    );
};

export default QuizSubmissionModal;
