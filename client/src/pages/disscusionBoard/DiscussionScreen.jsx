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
import { Send, Paperclip, X, FileText, ArrowDown, Download, File, MessageCircle } from "lucide-react";
import { formatMessageTime } from '../../utils/formatMessageTime';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'react-toastify';

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
    const cleanUrl = url.split('?')[0];
    const extension = cleanUrl.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension);
};

// Helper: Get filename from URL
const getFileName = (url) => {
    if (!url) return "File";
    const cleanUrl = url.split('?')[0];
    return decodeURIComponent(cleanUrl.split('/').pop());
};

const DiscussionScreen = () => {
    // Note: We don't need isCourseAdmin here because everyone can chat
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

    // 1. Fetch Messages (Updated Endpoint)
    const fetchMessages = useCallback(async (pageNum = 1) => {
        if (!courseId) return;
        setLoading(true);
        try {
            // Changed endpoint to /api/discussion/all
            const res = await axios.get(`${backendUrl}/api/discussion/all`, {
                params: { courseId, page: pageNum, limit: 20 }, // Increased limit for chat feel
                withCredentials: true 
            });

            if (res.data.success) {
                // Backend returns "messages" array based on the controller provided
                const fetched = res.data.messages || []; 
                
                // If backend sends oldest first (chat style), we might need to reverse if we want pagination to work upwards
                // But usually for chat history, we prepend. 
                // Assuming controller returns oldest -> newest:
                // We reverse locally if we want to stack them bottom-up, 
                // but let's assume standard chat app behavior:
                
                // If this is page 1, we just set them. If page > 1, we prepend.
                setMessages(prev => 
                    pageNum === 1 ? fetched : [...fetched, ...prev] // Adjust based on your actual controller sort order
                );
                
                setHasMore(fetched.length === 20);
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

    useLayoutEffect(() => {
        if (!messagesContainerRef.current) return;
        if (page === 1) {
            requestAnimationFrame(() => {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            });
        }
    }, [messages.length, page]);

    // =========================
    // Scroll Logic
    // =========================
    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;

        if (container.scrollTop === 0 && hasMore && !loading) {
            // fetchMessages will handle the prepending
            // logic might need tweaking depending on exactly how controller sorts
        }

        // Sticky Date
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

        const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        setShowNewMsgIndicator(!atBottom);
    };

    const scrollToBottom = () => {
        const container = messagesContainerRef.current;
        if (!container) return;
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        setShowNewMsgIndicator(false);
    };

    // 2. Send Message (Updated Endpoint)
    const onSendMessage = async ({ message }) => {
        if (!message && !file) return;

        const formData = new FormData();
        if (message) formData.append("content", message);
        if (file) formData.append("attachment", file);
        formData.append("courseId", courseId); // Explicitly sending courseId in body if needed, though usually param/query

        try {
            // Changed endpoint to /api/discussion/send
            const res = await axios.post(
                `${backendUrl}/api/discussion/send`,
                formData,
                {
                    params: { courseId }, // Sending as param to match your route likely
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true
                }
            );

            if (!res.data.success) {
                return toast.error(res.data.message || "Failed to send");
            }

            reset();
            setFile(null);
            scrollToBottom();
        } catch (err) {
            console.error(err);
            toast.error("Failed to send message");
        }
    };

    // 3. Socket: Real-time (Updated Event Name)
    useEffect(() => {
        if (!socket || !courseId) return;

        socket.emit("joinCourse", courseId);

        // Event name changed to "newDiscussionMessage"
        const handleNewMessage = (newMessage) => {
            // Ensure message belongs to this course
            if (newMessage.course !== courseId && newMessage.course?._id !== courseId) return;

            setMessages(prev => {
                const exists = prev.some(m => m._id === newMessage._id);
                if (exists) return prev;
                
                const container = messagesContainerRef.current;
                const atBottom = container && (container.scrollHeight - container.scrollTop - container.clientHeight < 100);
                
                if (atBottom) {
                    setTimeout(scrollToBottom, 100);
                } else {
                    setShowNewMsgIndicator(true);
                }
                
                return [...prev, newMessage];
            });
        };

        socket.on("newDiscussionMessage", handleNewMessage);

        return () => {
            socket.off("newDiscussionMessage", handleNewMessage);
        };
    }, [socket, courseId]);

    // =========================
    // Render
    // =========================
    const renderMessagesWithDate = () => {
        let lastDate = null;
        return messages.map((msg) => {
            const msgDateStr = formatDateBar(msg.createdAt);
            const showDateBar = lastDate !== msgDateStr;
            lastDate = msgDateStr;

            // Check if sender is current user
            // Handle populated object or direct ID
            const senderId = msg.sender?._id || msg.sender; 
            const isSender = String(senderId) === String(userData._id);

            return (
                <React.Fragment key={msg._id}>
                    {showDateBar && (
                        <div className="flex justify-center mb-4 mt-2 sticky top-0 z-10" data-date={msgDateStr}>
                            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm font-medium">
                                {msgDateStr}
                            </span>
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex w-full mb-3 ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[85%] md:max-w-[70%] gap-2 ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
                            
                            {/* Avatar */}
                            <div className="flex-shrink-0 flex flex-col justify-end">
                                <img
                                    src={msg.sender?.profilePicture || "/user.png"}
                                    alt="User"
                                    className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                                />
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex flex-col relative p-2 shadow-sm min-w-[120px]
                                ${isSender 
                                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' 
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-none'
                                }`}>
                                
                                {/* Sender Name (Only for received messages in group chat) */}
                                {!isSender && msg.sender?.fullName && (
                                    <p className="text-[11px] font-bold text-blue-600 mb-1 px-1 truncate max-w-[200px]">
                                        {msg.sender.fullName}
                                    </p>
                                )}

                                {/* Attachment */}
                                {msg.attachment && (
                                    <div className="mb-2">
                                        {isImageFile(msg.attachment) ? (
                                            <a href={msg.attachment} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={msg.attachment}
                                                    alt="attachment"
                                                    className="max-h-60 rounded-lg object-cover w-full cursor-pointer hover:opacity-95"
                                                />
                                            </a>
                                        ) : (
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
                                                    className={`p-2 rounded-full transition-colors ${isSender ? 'hover:bg-white/20' : 'hover:bg-gray-200'}`}
                                                >
                                                    <Download size={20} />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Content */}
                                {msg.content && (
                                    <p className={`text-sm whitespace-pre-wrap leading-relaxed px-1 ${!msg.attachment ? 'pt-0' : ''}`}>
                                        {msg.content}
                                    </p>
                                )}

                                {/* Time */}
                                <div className={`text-[10px] text-right mt-1 px-1 opacity-80
                                    ${isSender ? 'text-blue-50' : 'text-gray-400'}`}>
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
        <div className="flex flex-col h-[600px] bg-[#F0F2F5] border border-gray-300 rounded-xl shadow-lg relative overflow-hidden">

            {/* Header: Class Discussion */}
            <div className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">Class Discussion</p>
                        <p className="text-xs text-gray-500">Ask questions and collaborate</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent bg-[#e5ddd5]/30"
            >
                {/* Loader */}
                {loading && page > 1 && (
                    <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                
                {renderMessagesWithDate()}
                <div className="h-2" />
            </div>

            {/* Floating New Message Indicator */}
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

            {/* Preview */}
            {file && (
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

            {/* Input Area - Visible to Everyone */}
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
                        placeholder="Type a message..."
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
        </div>
    );
};

export default DiscussionScreen;