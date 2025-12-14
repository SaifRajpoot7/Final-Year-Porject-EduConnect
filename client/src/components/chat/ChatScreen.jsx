// 

import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    useLayoutEffect
} from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Send, Paperclip, X, FileText, ArrowDown } from "lucide-react";
import { formatMessageTime } from '../../utils/formatMessageTime';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'react-toastify';
import assets from '../../chat-app-assets/assets';

// Helper: format date for date bar
const formatDateBar = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const ChatScreen = () => {
    const { backendUrl, courseId, userData, socket } = useAppContext();

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const messagesContainerRef = useRef(null);
    const [currentStickyDate, setCurrentStickyDate] = useState('');
    const [showNewMsgIndicator, setShowNewMsgIndicator] = useState(false);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: { message: '' }
    });

    const fetchMessages = useCallback(async (pageNum = 1) => {
        if (!courseId) return;
        setLoading(true);
        try {
            const res = await axios.get(`${backendUrl}/api/announcement/all`, {
                params: { courseId, page: pageNum, limit: 10 }
            });

            if (res.data.success) {
                const fetched = res.data.announcements.reverse();
                setMessages(prev =>
                    pageNum === 1 ? fetched : [...fetched, ...prev]
                );
                setHasMore(fetched.length === 10);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [backendUrl, courseId]);

    useEffect(() => {
        fetchMessages(1);
    }, [fetchMessages]);

    useEffect(() => {
        if (page > 1) fetchMessages(page);
    }, [page, fetchMessages]);

    useLayoutEffect(() => {
        if (!messagesContainerRef.current) return;
        requestAnimationFrame(() => {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        });
    }, [messages.length]);

    // =========================
    // Scroll & Sticky Date & New Msg Indicator
    // =========================
    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;

        // Infinite scroll
        if (container.scrollTop === 0 && hasMore && !loading) {
            setPage(prev => prev + 1);
        }

        // Sticky date
        const children = Array.from(container.children);
        for (let i = 0; i < children.length; i++) {
            const el = children[i];
            if (el.dataset.date) {
                const rect = el.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                if (rect.top - containerRect.top <= 0) {
                    setCurrentStickyDate(el.dataset.date);
                }
            }
        }

        // New message indicator
        const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        setShowNewMsgIndicator(!atBottom);
    };

    const scrollToBottom = () => {
        const container = messagesContainerRef.current;
        if (!container) return;
        container.scrollTop = container.scrollHeight;
        setShowNewMsgIndicator(false);
    };

    const onSendMessage = async ({ message }) => {
        if (!message && !file) return;

        const formData = new FormData();
        if (message) formData.append("content", message);
        if (file) formData.append("attachment", file);

        try {
            const res = await axios.post(
                `${backendUrl}/api/announcement/create`,
                formData,
                {
                    params: { courseId },
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            if (!res.data.success) {
                return toast.error(res.data.message || "Failed to send");
            }

            reset();
            setFile(null);
        } catch {
            toast.error("Failed to send announcement");
        }
    };

    // =========================
    // Socket: Real-time messages
    // =========================
    useEffect(() => {
        if (!socket || !courseId) return;

        socket.emit("joinCourse", courseId);

        const handleNewAnnouncement = (announcement) => {
            if (announcement.course !== courseId) return;

            setMessages(prev => {
                const exists = prev.some(m => m._id === announcement._id);
                if (exists) return prev;
                const container = messagesContainerRef.current;
                const atBottom = container && (container.scrollHeight - container.scrollTop - container.clientHeight < 50);
                if (!atBottom) setShowNewMsgIndicator(true);
                return [...prev, announcement];
            });
        };

        socket.on("newAnnouncement", handleNewAnnouncement);

        return () => {
            socket.off("newAnnouncement", handleNewAnnouncement);
        };
    }, [socket, courseId]);

    // =========================
    // Render Messages with Date Bar
    // =========================
    const renderMessagesWithDate = () => {
        let lastDate = null;
        return messages.map((msg) => {
            const msgDateStr = formatDateBar(msg.createdAt);
            const showDateBar = lastDate !== msgDateStr;
            lastDate = msgDateStr;

            const senderId =
                msg.teacher?._id ||
                msg.teacher ||
                msg.sender?._id ||
                msg.sender;
            const isSender = String(senderId) === String(userData._id);

            return (
                <React.Fragment key={msg._id}>
                    {showDateBar && (
                        <div
                            className="flex justify-center mb-2"
                            data-date={msgDateStr}
                        >
                            <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">
                                {msgDateStr}
                            </span>
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`flex items-end gap-2 ${
                            isSender ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`p-2 max-w-[230px] rounded-lg text-white ${
                                isSender
                                    ? 'bg-blue-600 rounded-br-none'
                                    : 'bg-gray-500 rounded-bl-none'
                            }`}
                        >
                            {msg.attachment && (
                                <img
                                    src={msg.attachment}
                                    className="max-h-40 rounded-lg mb-2"
                                />
                            )}
                            {msg.content && <p>{msg.content}</p>}
                        </div>

                        <div className="text-xs text-center">
                            <img
                                src={msg.avatar || assets.avatar_icon}
                                className="w-7 rounded-full mx-auto"
                            />
                            <p className="text-gray-500">
                                {formatMessageTime(msg.createdAt)}
                            </p>
                        </div>
                    </motion.div>
                </React.Fragment>
            );
        });
    };

    return (
        <div className="flex flex-col h-[500px] bg-white border border-gray-200 rounded-xl shadow-sm relative">

            <div className="h-16 border-b px-4 flex items-center">
                <p className="font-semibold text-gray-800">Announcements</p>
            </div>

            {/* Sticky Date Bar */}
            {currentStickyDate && (
                <div className="absolute top-16 left-0 right-0 flex justify-center z-10 pointer-events-none">
                    <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">
                        {currentStickyDate}
                    </span>
                </div>
            )}

            {/* New Messages Indicator */}
            {showNewMsgIndicator && (
                <div
                    onClick={scrollToBottom}
                    className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg"
                >
                    <ArrowDown size={24} color="white" />
                </div>
            )}

            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
                {renderMessagesWithDate()}
            </div>

            {file && (
                <div className="px-4 py-2 border-t bg-gray-50">
                    {file.type.startsWith("image/") ? (
                        <div className="relative w-fit">
                            <img
                                src={URL.createObjectURL(file)}
                                className="max-h-32 rounded-lg"
                            />
                            <X
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1 h-6 w-6 cursor-pointer"
                                onClick={() => setFile(null)}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow w-fit">
                            <FileText className="h-5 w-5" />
                            <span className="truncate max-w-xs">{file.name}</span>
                            <X
                                className="h-4 w-4 cursor-pointer"
                                onClick={() => setFile(null)}
                            />
                        </div>
                    )}
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSendMessage)}
                className="h-16 border-t px-4 flex items-center gap-3"
            >
                <label className="cursor-pointer">
                    <Paperclip className="h-6 w-6 text-gray-600" />
                    <input
                        type="file"
                        className="hidden"
                        onChange={e => setFile(e.target.files?.[0])}
                    />
                </label>

                <input
                    type="text"
                    placeholder="Type a message..."
                    {...register("message")}
                    className="flex-1 border rounded-full px-4 py-2"
                />

                <button className="bg-blue-600 text-white p-3 rounded-full">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatScreen;
