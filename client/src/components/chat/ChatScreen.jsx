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
import { Send, Paperclip, X, FileText, ArrowDown, Download, File, Megaphone } from "lucide-react";
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

// Helper: Determine if URL is an image
const isImageFile = (url) => {
    if (!url) return false;
    const cleanUrl = url.split('?')[0]; // Remove query params if any
    const extension = cleanUrl.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension);
};

// Helper: Get filename from URL
const getFileName = (url) => {
    if (!url) return "File";
    const cleanUrl = url.split('?')[0];
    return decodeURIComponent(cleanUrl.split('/').pop());
};

const AnnouncementScreen = () => {
    const { backendUrl, courseId, userData, socket, isCourseAdmin } = useAppContext();

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
        // Only scroll to bottom on initial load
        if (page === 1) {
            requestAnimationFrame(() => {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            });
        }
    }, [messages.length, page]);

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

        // Sticky date logic
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

        // New message indicator logic
        const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        setShowNewMsgIndicator(!atBottom);
    };

    const scrollToBottom = () => {
        const container = messagesContainerRef.current;
        if (!container) return;
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
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
            scrollToBottom();
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
                const atBottom = container && (container.scrollHeight - container.scrollTop - container.clientHeight < 100);
                
                if (atBottom) {
                    // Slight delay to ensure DOM updates before scrolling
                    setTimeout(scrollToBottom, 100);
                } else {
                    setShowNewMsgIndicator(true);
                }
                
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
                    {/* Date Divider */}
                    {showDateBar && (
                        <div
                            className="flex justify-center mb-4 mt-2 sticky top-0 z-10"
                            data-date={msgDateStr}
                        >
                            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm font-medium">
                                {msgDateStr}
                            </span>
                        </div>
                    )}

                    {/* Message Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex w-full mb-3 ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[80%] md:max-w-[60%] gap-2 ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
                            
                            {/* Avatar */}
                            <div className="flex-shrink-0 flex flex-col justify-end">
                                <img
                                    src={msg.avatar || assets.avatar_icon}
                                    alt="User"
                                    className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                                />
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex flex-col relative p-2 shadow-sm
                                ${isSender 
                                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' 
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-none'
                                }`}>
                                
                                {/* Attachment Handling */}
                                {msg.attachment && (
                                    <div className="mb-2">
                                        {isImageFile(msg.attachment) ? (
                                            // Image Viewer
                                            <a href={msg.attachment} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={msg.attachment}
                                                    alt="attachment"
                                                    className="max-h-60 rounded-lg object-cover w-full cursor-pointer hover:opacity-95 transition-opacity"
                                                />
                                            </a>
                                        ) : (
                                            // Document / File Viewer (WhatsApp Style Box)
                                            <div className={`flex items-center gap-3 p-3 rounded-lg border backdrop-blur-sm
                                                ${isSender ? 'bg-white/10 border-white/20' : 'bg-gray-50 border-gray-200'}
                                            `}>
                                                <div className={`p-2 rounded-full ${isSender ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}>
                                                    <File size={24} />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-medium truncate w-full" title={getFileName(msg.attachment)}>
                                                        {getFileName(msg.attachment)}
                                                    </p>
                                                    <p className={`text-xs ${isSender ? 'text-blue-100' : 'text-gray-500'}`}>
                                                        Document
                                                    </p>
                                                </div>
                                                <a 
                                                    href={msg.attachment} 
                                                    download 
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`p-2 rounded-full transition-colors ${
                                                        isSender 
                                                            ? 'hover:bg-white/20 text-white' 
                                                            : 'hover:bg-gray-200 text-gray-600'
                                                    }`}
                                                >
                                                    <Download size={20} />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Text Content */}
                                {msg.content && (
                                    <p className={`text-sm whitespace-pre-wrap leading-relaxed px-1 ${!msg.attachment ? 'pt-1' : ''}`}>
                                        {msg.content}
                                    </p>
                                )}

                                {/* Time Stamp */}
                                <div className={`text-[10px] text-right mt-1 px-1 
                                    ${isSender ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {formatMessageTime(msg.createdAt)}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </React.Fragment>
            );
        });
    };

    return (
        <div className="flex flex-col h-[480px] bg-[#F0F2F5] border border-gray-300 rounded-xl shadow-lg relative overflow-hidden">

            {/* Header */}
            <div className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <Megaphone size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">Course Announcements</p>
                        {/* <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                        </p> */}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent bg-[#e5ddd5]/30"
            >
                {/* Loader for older messages */}
                {loading && page > 1 && (
                    <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                
                {renderMessagesWithDate()}
                <div className="h-2" /> {/* Bottom Spacer */}
            </div>

            {/* Floating New Message Button */}
            {showNewMsgIndicator && (
                <div
                    onClick={scrollToBottom}
                    className="absolute bottom-20 right-6 z-20 cursor-pointer bg-white text-blue-600 p-2 rounded-full shadow-lg border border-gray-100 hover:scale-110 transition-transform"
                >
                    <ArrowDown size={20} />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </div>
            )}

            {/* Attachment Preview (Before Sending) */}
            {isCourseAdmin && file && (
                <div className="px-4 py-3 border-t bg-gray-50 flex items-center gap-4 animate-in slide-in-from-bottom-2">
                    <div className="relative group">
                        {file.type.startsWith("image/") ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="h-16 w-16 object-cover rounded-lg border border-gray-300 shadow-sm"
                            />
                        ) : (
                            <div className="h-16 w-16 flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-sm">
                                <FileText className="text-gray-500" />
                            </div>
                        )}
                        <button
                            onClick={() => setFile(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                </div>
            )}

            {/* Input Area */}
            {isCourseAdmin && (
                <form
                    onSubmit={handleSubmit(onSendMessage)}
                    className="min-h-[70px] bg-white border-t px-4 py-3 flex items-end gap-3 z-20"
                >
                    <label className="cursor-pointer p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors mb-1">
                        <Paperclip className="h-6 w-6" />
                        <input
                            type="file"
                            className="hidden"
                            onChange={e => setFile(e.target.files?.[0])}
                        />
                    </label>

                    <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-100 transition-all border border-transparent focus-within:border-blue-200">
                        <textarea
                            {...register("message")}
                            placeholder="Type an announcement..."
                            className="w-full bg-transparent outline-none text-gray-700 resize-none max-h-24 py-1"
                            rows="1"
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed mb-1"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} className="ml-0.5" />}
                    </button>
                </form>
            )}
        </div>
    );
};

export default AnnouncementScreen;