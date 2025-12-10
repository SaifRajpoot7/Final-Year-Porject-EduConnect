import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AnnouncementCreate = ({ backendUrl, courseId, onSuccess }) => {
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]);

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleSubmit = async () => {
        if (!text && files.length === 0) {
            toast.error("Please enter text or attach a file");
            return;
        }

        try {
            // Upload files first
            const formData = new FormData();
            files.forEach((file) => formData.append("files", file));

            const uploadRes = await axios.post(`${backendUrl}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const attachmentData = uploadRes.data.files || [];

            // Create announcement
            await axios.post(`${backendUrl}/api/announcements?courseId=${courseId}`, {
                text,
                attachments: attachmentData,
                courseId,
            });

            toast.success("Announcement posted!");

            setText("");
            setFiles([]);

            if (onSuccess) onSuccess(); // refresh list
        } catch (error) {
            console.log(error);
            toast.error("Failed to post announcement");
        }
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow border">
            <h2 className="text-xl font-semibold mb-3">Create Announcement</h2>

            <textarea
                className="w-full p-3 border rounded-lg outline-none focus:ring"
                rows={3}
                placeholder="Write something..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="mt-3"
            />

            {/* Preview selected files */}
            {files.length > 0 && (
                <ul className="mt-2 text-sm">
                    {files.map((file, i) => (
                        <li key={i} className="text-gray-600">
                            • {file.name}
                        </li>
                    ))}
                </ul>
            )}

            <button
                onClick={handleSubmit}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Post Announcement
            </button>
        </div>
    );
};

export default AnnouncementCreate;
