import { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';

// ACCEPT 'call' AS A PARAMETER
export const useLectureJoinController = ({ lectureId, isAdmin, call }) => {
    const { backendUrl } = useAppContext();
    const [joinError, setJoinError] = useState(null);

    const joinLecture = async () => {
        setJoinError(null);
        if (!call) {
            setJoinError("Call not initialized");
            return;
        }

        try {
            // 1. Call Backend to register attendance / check locks
            const { data } = await axios.post(
                `${backendUrl}/api/lectures/${lectureId}/join`,
                {},
                { withCredentials: true }
            );

            if (!data.success) {
                throw new Error(data.message || 'Failed to join lecture');
            }

            // 2. If Backend OK, Connect to Stream using the PROVIDED call object
            if (isAdmin) {
                // Admin logic
                await call.getOrCreate({
                    data: {
                        starts_at: new Date().toISOString(),
                        custom: {
                            title: data.lecture.title
                        }
                    }
                });
            } else {
                // Student logic
                await call.join();
            }

        } catch (error) {
            console.error("Join Error:", error);
            const msg = error.response?.data?.message || error.message;
            setJoinError(msg);
            throw error; // Re-throw to stop setup completion
        }
    };

    return { joinLecture, joinError };
};