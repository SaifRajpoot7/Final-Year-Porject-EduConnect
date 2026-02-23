import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAppContext } from "../contexts/AppContext";

const CreateQuizForm = () => {
    const { backendUrl, courseId } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizStep, setQuizStep] = useState(1);

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            dueDate: "",
            totalQuestions: 1,
            questions: [],
        },
    });

    const totalQuestions = watch("totalQuestions");
    const questions = watch("questions");
    const title = watch("title");
    const dueDate = watch("dueDate");

    // Initialize questions array
    useEffect(() => {
        if (totalQuestions > 0) {
            const q = Array.from({ length: totalQuestions }, (_, i) => questions[i] || {
                questionText: "",
                options: ["", ""],
                correctOptionIndex: null,
            });
            setValue("questions", q);
        }
    }, [totalQuestions]);

    // Validate metadata before moving to questions
    const handleNextStep = () => {
        if (!title) {
            toast.error("Please enter quiz title.");
            return;
        }
        if (!dueDate) {
            toast.error("Please select a due date.");
            return;
        }
        if (!totalQuestions || totalQuestions < 1) {
            toast.error("Please enter a valid number of questions.");
            return;
        }
        setQuizStep(2);
    };

    // Handle Next Question with validation
    const handleNextQuestion = () => {
        const currentQ = questions[currentQuestionIndex];
        if (!currentQ.questionText || currentQ.options.some(opt => !opt) || currentQ.correctOptionIndex === null) {
            toast.error("Fill all fields before next question.");
            return;
        }
        if (currentQuestionIndex < totalQuestions - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const addOption = () => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].options.push("");
        setValue("questions", updatedQuestions);
    };

    const removeOption = (idx) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].options.splice(idx, 1);
        if (updatedQuestions[currentQuestionIndex].correctOptionIndex >= updatedQuestions[currentQuestionIndex].options.length) {
            updatedQuestions[currentQuestionIndex].correctOptionIndex = null;
        }
        setValue("questions", updatedQuestions);
    };

    const onSubmit = async (data) => {
        const quizData = {
            course: courseId,
            title: data.title,
            questions: data.questions,
            dueDate: data.dueDate,
            totalQuestions: data.totalQuestions
        }
        console.log(quizData)
        // You can uncomment below to call your API
        try {
            setIsSubmitting(true);
            const response = await axios.post(
                `${backendUrl}/api/quiz/create?courseId=${courseId}`,
                quizData,
                { withCredentials: true }
            );

            if (!response.data.success) {
                toast.error(response.data.message || "Failed to create quiz.");
            } else {
                toast.success("Quiz created successfully!");
                reset();
                setQuizStep(1);
                setCurrentQuestionIndex(0);
            }

            setIsSubmitting(false);
        } catch (error) {
            setIsSubmitting(false);
            toast.error(error.response?.data?.message || "Error creating quiz.");
        }

    };

    const currentQuestion = questions[currentQuestionIndex] || { questionText: "", options: ["", ""], correctOptionIndex: null };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {quizStep === 1 && (
                    <>
                        <div>
                            <label className="font-medium text-gray-700 mb-1 block">Quiz Title</label>
                            <input
                                {...register("title", { required: "Title is required" })}
                                type="text"
                                placeholder="Enter quiz title"
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="font-medium text-gray-700 mb-1 block">Due Date</label>
                            <input
                                {...register("dueDate", { required: "Due date is required" })}
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="font-medium text-gray-700 mb-1 block">Total Questions</label>
                            <input
                                {...register("totalQuestions", { required: true, min: 1, valueAsNumber: true })}
                                type="number"
                                placeholder="e.g. 5"
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition mt-4"
                        >
                            Next: Questions
                        </button>
                    </>
                )}

                {quizStep === 2 && (
                    <>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </h3>

                            <label className="block mb-1">Question Text</label>
                            <input
                                {...register(`questions.${currentQuestionIndex}.questionText`, { required: true })}
                                type="text"
                                placeholder="Enter question text"
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />

                            <div className="mt-2 space-y-2">
                                {currentQuestion.options.map((_, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input
                                            {...register(`questions.${currentQuestionIndex}.options.${idx}`, { required: true })}
                                            type="text"
                                            placeholder={`Option ${idx + 1}`}
                                            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                        {currentQuestion.options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOption(idx)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addOption}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded mt-2"
                                >
                                    Add Option
                                </button>
                            </div>

                            <div className="mt-2">
                                <label className="block mb-1">Correct Option</label>
                                <select
                                    {...register(`questions.${currentQuestionIndex}.correctOptionIndex`, { required: true, valueAsNumber: true })}
                                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="">Select correct option</option>
                                    {currentQuestion.options.map((opt, idx) => (
                                        <option key={idx} value={idx}>{opt || `Option ${idx + 1}`}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end mt-4">
                                {/* <button
                                    type="button"
                                    onClick={handlePrevQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-lg"
                                >
                                    Previous
                                </button> */}

                                {currentQuestionIndex < totalQuestions - 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextQuestion}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
                                    >
                                        {isSubmitting ? "Submitting Quiz..." : "Submit Quiz"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default CreateQuizForm;
