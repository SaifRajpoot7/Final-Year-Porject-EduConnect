import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";

const AddStudentsForm = () => {
    const { backendUrl, courseId } = useAppContext();

    const [emailInput, setEmailInput] = useState("");
    const [emailList, setEmailList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add email to list
    const handleAddEmail = () => {
        const email = emailInput.trim();

        // Basic email format validation
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!email) {
            toast.error("Email is required.");
            return;
        }
        if (!isValidEmail) {
            toast.error("Invalid email format.");
            return;
        }
        if (emailList.includes(email)) {
            toast.info("Email already added.");
            return;
        }

        setEmailList([...emailList, email]);
        setEmailInput("");
    };

    // Remove email
    const handleRemoveEmail = (index) => {
        const updatedList = [...emailList];
        updatedList.splice(index, 1);
        setEmailList(updatedList);
    };

    // Submit API call
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (emailList.length === 0) {
            toast.error("Please add at least one email.");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axios.post(
                `${backendUrl}/api/course/${courseId}/add-students?courseId=${courseId}`,
                { students: emailList },
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success("Students added successfully!");
                setEmailList([]);
            } else {
                toast.error(response.data.message || "Failed to add students.");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Error adding students.");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-4">Add Students</h2>

            <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="flex gap-2">
                    <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter student email"
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddEmail}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                    >
                        Add
                    </button>
                </div>

                {/* Email List */}
                {emailList.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {emailList.map((email, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"
                            >
                                <span>{email}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveEmail(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md"
                    >
                        {isSubmitting ? "Adding..." : "Add Students"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudentsForm;
