import Feedback from "../models/feedback.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const submitFeedback = async (req, res) => {
    try {
        // 1. Get data from body (Frontend sent 'description' in formData)
        const { title, description, rating } = req.body;

        // 2. Validate required fields
        if (!title || !description || !rating) {
            return res.status(400).json({ success: false, message: 'Title, description, and rating are required' });
        }

        // 3. Prepare the feedback object
        let feedbackData = {
            userId: req.user._id,
            title: title.trim(),
            description: description.trim(),
            rating,
            imageUrl: "" // Default empty or null
        };

        // 4. Handle Image Upload (Using your uploadOnCloudinary pattern)
        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            if (result) {
                feedbackData.imageUrl = result.secure_url; // Save the Cloudinary URL
            }
        }

        // 5. Create Feedback
        await Feedback.create(feedbackData);

        res.status(201).json({ success: true, message: "Feedback submitted successfully!" });

    } catch (error) {
        console.error('Submit Feedback Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getAllFeedbacks = async (req, res) => {
    try {
        // 1. Fetch all feedbacks
        // 2. Populate 'userId' to get name & email (exclude password)
        // 3. Sort by newest first
        const feedbacks = await Feedback.find()
            .populate("userId", "fullName email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedbacks.length,
            feedbacks
        });

    } catch (error) {
        console.error("Get All Feedbacks Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const feedbackController = {
    submitFeedback,
    getAllFeedbacks
};

export default feedbackController;