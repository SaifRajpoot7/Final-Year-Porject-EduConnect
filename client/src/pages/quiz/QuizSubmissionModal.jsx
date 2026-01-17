// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { X } from "lucide-react";
// import { toast } from "react-toastify";
// import { useAppContext } from "../../contexts/AppContext";
// import { motion } from "framer-motion";

// const QuizSubmissionModal = ({ open, onClose, quizId, questions, courseId }) => {
//     const { backendUrl } = useAppContext();

//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [timer, setTimer] = useState(60);
//     const [answers, setAnswers] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const currentQuestion = questions[currentIndex];

//     useEffect(() => {
//         if (!open) return;

//         setTimer(60);

//         const countdown = setInterval(() => {
//             setTimer((prev) => {
//                 if (prev <= 1) {
//                     clearInterval(countdown);
//                     handleSkip();
//                 }
//                 return prev - 1;
//             });
//         }, 1000);

//         return () => clearInterval(countdown);
//     }, [currentIndex, open]);

//     const handleAnswer = (optionIndex) => {
//         addAnswer(optionIndex);
//     };

//     const handleSkip = () => {
//         addAnswer(-1);
//     };

//     const addAnswer = (selectedOptionIndex) => {
//         const newAnswer = {
//             questionIndex: currentIndex,
//             selectedOptionIndex,
//         };

//         setAnswers((prev) => [...prev, newAnswer]);

//         if (currentIndex + 1 < questions.length) {
//             setCurrentIndex((prev) => prev + 1);
//         } else {
//             submitQuiz([...answers, newAnswer]);
//         }
//     };

//     const submitQuiz = async (finalAnswers) => {
//         try {
//           setIsSubmitting(true);
//           const response = await axios.post(
//             `${backendUrl}/api/quiz/submit/${quizId}?courseId=${courseId}`,
//             { answers: finalAnswers },
//             { withCredentials: true }
//           );

//           if (!response.data.success) {
//             toast.error(response.data.message || "Failed to submit quiz.");
//           } else {
//             toast.success("Quiz submitted successfully!");
//           }

//           setIsSubmitting(false);
//           onClose();
//         } catch (err) {
//           setIsSubmitting(false);
//           toast.error(err.response?.data?.message || "Error submitting quiz");
//         }
//     };

//     if (!open || !currentQuestion) return null;

//     return (
//         <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//             <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl relative">
//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
//                 >
//                     <X size={22} />
//                 </button>

//                 {/* Timer */}
//                 <motion.div
//                     className="text-right text-lg font-semibold text-red-600 mb-3 mt-4"
//                     animate={{ opacity: [1, 0, 1] }}
//                     transition={{
//                         duration: 1,
//                         repeat: Infinity,
//                         ease: "linear",
//                     }}
//                 >
//                     Time Left: {timer}s
//                 </motion.div>

//                 {/* Question */}
//                 <h2 className="text-xl font-semibold mb-4">
//                     Question {currentIndex + 1} of {questions.length}
//                 </h2>

//                 <p className="text-gray-800 mb-6">{currentQuestion.questionText}</p>

//                 {/* Options */}
//                 <div className="space-y-3">
//                     {currentQuestion.options.map((opt, idx) => (
//                         <button
//                             key={idx}
//                             onClick={() => handleAnswer(idx)}
//                             className="w-full text-left border border-gray-300 rounded-lg p-3 hover:bg-blue-50"
//                         >
//                             {opt}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Skip */}
//                 <div className="flex justify-end mt-6">
//                     <button
//                         onClick={handleSkip}
//                         className="text-gray-600 hover:text-gray-800 underline"
//                     >
//                         Skip Question
//                     </button>
//                 </div>

//                 {/* Submitting Loader */}
//                 {isSubmitting && (
//                     <p className="text-center mt-4 text-blue-600 font-medium">
//                         Submitting...
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default QuizSubmissionModal;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../contexts/AppContext";
import { motion } from "framer-motion";

const QuizSubmissionModal = ({ open, onClose, quizId, questions, courseId }) => {
    const { backendUrl } = useAppContext();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [timer, setTimer] = useState(60);
    const [answers, setAnswers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // New state to track the currently selected option before moving next
    const [selectedOption, setSelectedOption] = useState(null);

    const currentQuestion = questions[currentIndex];

    // Reset Timer and Selection when Question Changes or Modal Opens
    useEffect(() => {
        if (open) {
            setTimer(60);
            setSelectedOption(null);
        }
    }, [currentIndex, open]);

    // Timer Countdown Logic
    useEffect(() => {
        if (!open) return;

        const countdown = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(countdown);
    }, [open, currentIndex]); // Re-create interval on index change to ensure clean slate

    // Auto-advance logic when Timer hits 0
    useEffect(() => {
        if (timer === 0) {
            // If time is up:
            // If user selected an option, submit that. 
            // If not, submit -1 (empty/skip).
            const answerToSubmit = selectedOption !== null ? selectedOption : -1;
            moveToNextQuestion(answerToSubmit);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer]); 

    // Handle clicking an option (Visual Selection Only)
    const handleOptionSelect = (optionIndex) => {
        setSelectedOption(optionIndex);
    };

    // Shared logic to push answer and move index
    const moveToNextQuestion = (finalOptionIndex) => {
        const newAnswer = {
            questionIndex: currentIndex,
            selectedOptionIndex: finalOptionIndex,
        };

        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            submitQuiz(updatedAnswers);
        }
    };

    // Manual "Next" button click
    const handleNextClick = () => {
        if (selectedOption !== null) {
            moveToNextQuestion(selectedOption);
        }
    };

    // Manual "Skip" button click
    const handleSkip = () => {
        moveToNextQuestion(-1);
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
                {/* Close Button */}
                {/* <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X size={22} />
                </button> */}

                {/* Header Section: Timer & Progress */}
                <div className="flex justify-between items-center mb-6 mt-2">
                    <span className="text-sm font-medium text-gray-500">
                        Question {currentIndex + 1} / {questions.length}
                    </span>
                    
                    <motion.div
                        className={`text-lg font-bold px-3 py-1 rounded-md ${
                            timer <= 20 ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"
                        }`}
                        animate={timer <= 20 ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.7, repeat: timer <= 20 ? Infinity : 0 }}
                    >
                        Time Left: {timer}s
                    </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
                    <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>

                {/* Question Text */}
                <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
                    {currentQuestion.questionText}
                </h2>

                {/* Options List */}
                <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((opt, idx) => {
                        const isSelected = selectedOption === idx;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                className={`w-full text-left border rounded-xl p-4 transition-all duration-200 flex items-center justify-between group
                                    ${isSelected 
                                        ? "border-blue-500 bg-blue-50 text-blue-800 shadow-sm" 
                                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700"
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs
                                        ${isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-gray-400 text-gray-500 group-hover:border-blue-400"}
                                    `}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    {opt}
                                </span>
                                {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                            </button>
                        );
                    })}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                        onClick={handleSkip}
                        className="text-gray-500 hover:text-gray-800 font-medium text-sm px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Skip Question
                    </button>

                    <button
                        onClick={handleNextClick}
                        disabled={selectedOption === null || isSubmitting}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white transition-all
                            ${selectedOption === null 
                                ? "bg-gray-300 cursor-not-allowed" 
                                : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30"
                            }`}
                    >
                        {isSubmitting ? (
                            "Submitting..."
                        ) : (
                            <>
                                {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next"}
                                <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizSubmissionModal;