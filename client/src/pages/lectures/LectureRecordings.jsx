// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { Play, Calendar, Clock, Video, X } from 'lucide-react';
// // import { useAppContext } from '../../contexts/AppContext';
// // import { toast } from 'react-toastify';
// // import ComponentLoader from '../../components/ComponentLoader';

// // const LectureRecordings = ({ lectureId }) => {
// //     const { backendUrl } = useAppContext();
// //     const [recordings, setRecordings] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [activeVideo, setActiveVideo] = useState(null);

// //     // Fetch Recordings on Mount
// //     useEffect(() => {
// //         const fetchRecordings = async () => {
// //             try {
// //                 const { data } = await axios.get(
// //                     `${backendUrl}/api/lectures/${lectureId}/recordings`, 
// //                     { withCredentials: true }
// //                 );

// //                 if (data.success) {
// //                     setRecordings(data.recordings);
// //                 }
// //             } catch (error) {
// //                 console.error("Error fetching recordings:", error);
// //                 // Optional: Don't toast on 404/empty, just show empty state
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         if (lectureId) fetchRecordings();
// //     }, [lectureId, backendUrl]);

// //     // Render Helpers
// //     if (loading) return (
// //             <ComponentLoader />
// //     );

// //     if (recordings.length === 0) {
// //         return (
// //             <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-500">
// //                 <Video size={32} className="mb-2 opacity-50" />
// //                 <p>No recordings available for this lecture.</p>
// //                 <p className="text-xs mt-1">Recordings usually appear a few minutes after the lecture ends.</p>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="space-y-6 mt-6">
// //             <div className="flex items-center gap-2 mb-4">
// //                 <Video className="text-red-600" size={20} />
// //                 <h3 className="text-lg font-bold text-gray-800">Lecture Recordings</h3>
// //             </div>

// //             {/* Video Player Modal/Section */}
// //             {activeVideo && (
// //                 <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl mb-6 ring-4 ring-gray-100">
// //                     <video 
// //                         controls 
// //                         autoPlay 
// //                         className="w-full h-auto max-h-[500px]"
// //                         src={activeVideo}
// //                     >
// //                         Your browser does not support the video tag.
// //                     </video>
                    
// //                     {/* Player Header */}
// //                     <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent flex justify-between items-start">
// //                         <span className="text-white font-medium text-sm px-2 py-1 bg-red-600 rounded">
// //                             Now Playing
// //                         </span>
// //                         <button 
// //                             onClick={() => setActiveVideo(null)}
// //                             className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-full transition-all"
// //                         >
// //                             <X size={24} />
// //                         </button>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* Recordings Grid */}
// //             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
// //                 {recordings.map((rec, index) => (
// //                     <div 
// //                         key={rec.filename || index} 
// //                         className={`group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1
// //                             ${activeVideo === rec.url ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-200'}
// //                         `}
// //                         onClick={() => setActiveVideo(rec.url)}
// //                     >
// //                         {/* Thumbnail Area */}
// //                         <div className="h-40 bg-gray-900 relative flex items-center justify-center overflow-hidden">
// //                             {rec.thumb_url ? (
// //                                 <img 
// //                                     src={rec.thumb_url} 
// //                                     alt="Recording Thumbnail" 
// //                                     className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
// //                                 />
// //                             ) : (
// //                                 // Fallback pattern if no thumbnail
// //                                 <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-100 flex flex-col items-center justify-center">
// //                                     <Video size={40} className="text-gray-700 mb-2" />
// //                                 </div>
// //                             )}
                            
// //                             {/* Duration Badge (If available, otherwise placeholder) */}
// //                             <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
// //                                 {new Date(new Date(rec.end_time) - new Date(rec.start_time)).toISOString().substr(11, 8)}
// //                             </div>

// //                             {/* Play Button Overlay */}
// //                             <div className="absolute inset-0 flex items-center justify-center">
// //                                 <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all group-hover:scale-110">
// //                                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
// //                                         <Play size={14} className="text-blue-600 ml-0.5" fill="currentColor" />
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* Info Area */}
// //                         <div className="p-4">
// //                             <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-1">
// //                                 Session Recording {index + 1}
// //                             </h4>
                            
// //                             <div className="flex flex-col gap-1.5">
// //                                 <div className="flex items-center gap-2 text-xs text-gray-500">
// //                                     <Calendar size={12} />
// //                                     <span>{new Date(rec.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
// //                                 </div>
// //                                 <div className="flex items-center gap-2 text-xs text-gray-500">
// //                                     <Clock size={12} />
// //                                     <span>
// //                                         {new Date(rec.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
// //                                         {" - "}
// //                                         {new Date(rec.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
// //                                     </span>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // };

// // export default LectureRecordings;

// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { Play, Calendar, Clock, Video, X } from 'lucide-react';
// import { useAppContext } from '../../contexts/AppContext';
// import Hls from 'hls.js'; // Import HLS
// import ComponentLoader from '../../components/ComponentLoader';

// // ✅ ROBUST VIDEO PLAYER COMPONENT
// const VideoPlayer = ({ src, onClose }) => {
//     const videoRef = useRef(null);
//     const hlsRef = useRef(null);

//     useEffect(() => {
//         const video = videoRef.current;
//         if (!video || !src) return;

//         // Check if it's an HLS stream (.m3u8)
//         const isHls = src.includes('.m3u8');

//         if (isHls && Hls.isSupported()) {
//             // Option 1: HLS.js for Chrome/Firefox/Edge
//             hlsRef.current = new Hls();
//             hlsRef.current.loadSource(src);
//             hlsRef.current.attachMedia(video);
//             hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
//                 video.play().catch(e => console.log("Autoplay blocked:", e));
//             });
//         } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
//             // Option 2: Native HLS support (Safari)
//             video.src = src;
//             video.addEventListener('loadedmetadata', () => {
//                 video.play().catch(e => console.log("Autoplay blocked:", e));
//             });
//         } else {
//             // Option 3: Standard MP4/WebM
//             video.src = src;
//             video.play().catch(e => console.log("Autoplay blocked:", e));
//         }

//         // Cleanup
//         return () => {
//             if (hlsRef.current) {
//                 hlsRef.current.destroy();
//             }
//         };
//     }, [src]);

//     return (
//         <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl mb-6 ring-4 ring-gray-100">
//             <video 
//                 ref={videoRef}
//                 controls 
//                 className="w-full h-auto max-h-[500px]"
//                 crossOrigin="anonymous" 
//             >
//                 Your browser does not support the video tag.
//             </video>
            
//             {/* Player Header */}
//             <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent flex justify-between items-start z-10">
//                 <span className="text-white font-medium text-sm px-2 py-1 bg-red-600 rounded shadow-sm">
//                     Now Playing
//                 </span>
//                 <button 
//                     onClick={onClose}
//                     className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-all backdrop-blur-sm"
//                 >
//                     <X size={24} />
//                 </button>
//             </div>
//         </div>
//     );
// };

// // ✅ MAIN COMPONENT
// const LectureRecordings = ({ lectureId }) => {
//     const { backendUrl } = useAppContext();
//     const [recordings, setRecordings] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [activeVideo, setActiveVideo] = useState(null);

//     // Fetch Recordings on Mount
//     useEffect(() => {
//         const fetchRecordings = async () => {
//             try {
//                 const { data } = await axios.get(
//                     `${backendUrl}/api/lectures/${lectureId}/recordings`, 
//                     { withCredentials: true }
//                 );

//                 if (data.success) {
//                     setRecordings(data.recordings);
//                 }
//             } catch (error) {
//                 console.error("Error fetching recordings:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (lectureId) fetchRecordings();
//     }, [lectureId, backendUrl]);

//     // Render Helpers
//     if (loading) return <ComponentLoader />;

//     if (recordings.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-500">
//                 <Video size={32} className="mb-2 opacity-50" />
//                 <p>No recordings available for this lecture.</p>
//                 <p className="text-xs mt-1">Recordings usually appear a few minutes after the lecture ends.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6 mt-6">
//             <div className="flex items-center gap-2 mb-4">
//                 <Video className="text-red-600" size={20} />
//                 <h3 className="text-lg font-bold text-gray-800">Lecture Recordings</h3>
//             </div>

//             {/* Video Player Modal/Section */}
//             {activeVideo && (
//                 <VideoPlayer 
//                     src={activeVideo} 
//                     onClose={() => setActiveVideo(null)} 
//                 />
//             )}

//             {/* Recordings Grid */}
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {recordings.map((rec, index) => (
//                     <div 
//                         key={rec.filename || index} 
//                         className={`group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1
//                             ${activeVideo === rec.url ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-200'}
//                         `}
//                         onClick={() => setActiveVideo(rec.url)}
//                     >
//                         {/* Thumbnail Area */}
//                         <div className="h-40 bg-gray-900 relative flex items-center justify-center overflow-hidden">
//                             {rec.thumb_url ? (
//                                 <img 
//                                     src={rec.thumb_url} 
//                                     alt="Recording Thumbnail" 
//                                     className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
//                                 />
//                             ) : (
//                                 <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-100 flex flex-col items-center justify-center">
//                                     <Video size={40} className="text-gray-700 mb-2" />
//                                 </div>
//                             )}
                            
//                             {/* Duration Badge */}
//                             <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
//                                 {new Date(new Date(rec.end_time) - new Date(rec.start_time)).toISOString().substr(11, 8)}
//                             </div>

//                             {/* Play Button Overlay */}
//                             <div className="absolute inset-0 flex items-center justify-center">
//                                 <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all group-hover:scale-110">
//                                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
//                                         <Play size={14} className="text-blue-600 ml-0.5" fill="currentColor" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Info Area */}
//                         <div className="p-4">
//                             <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-1">
//                                 Session Recording {index + 1}
//                             </h4>
                            
//                             <div className="flex flex-col gap-1.5">
//                                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                                     <Calendar size={12} />
//                                     <span>{new Date(rec.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                                     <Clock size={12} />
//                                     <span>
//                                         {new Date(rec.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
//                                         {" - "}
//                                         {new Date(rec.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default LectureRecordings;

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Play, Calendar, Clock, Video, X, AlertCircle, Loader2 } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import Hls from 'hls.js'; 
import ComponentLoader from '../../components/ComponentLoader';

// ✅ UPDATED VIDEO PLAYER (Handles 404 / Processing Errors)
const VideoPlayer = ({ src, onClose }) => {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        // Reset error on new source
        setError(null);

        const isHls = src.includes('.m3u8');

        const handleError = (e) => {
            console.error("Video Error:", e);
            // If the error code is 4 (MEDIA_ERR_SRC_NOT_SUPPORTED) often caused by 404
            setError("The recording is still processing or unavailable.");
        };

        if (isHls && Hls.isSupported()) {
            hlsRef.current = new Hls();
            hlsRef.current.loadSource(src);
            hlsRef.current.attachMedia(video);
            hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(e => console.log("Autoplay blocked"));
            });
            // Catch HLS specific errors (like 404 on fragments)
            hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    setError("Recording is being processed. Please check back in 5 minutes.");
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.addEventListener('loadedmetadata', () => video.play().catch(() => {}));
            video.addEventListener('error', handleError);
        } else {
            video.src = src;
            video.play().catch(() => {});
            video.addEventListener('error', handleError);
        }

        return () => {
            if (hlsRef.current) hlsRef.current.destroy();
            if (video) video.removeEventListener('error', handleError);
        };
    }, [src]);

    return (
        <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl mb-6 ring-4 ring-gray-100">
            {/* Error State Overlay */}
            {error ? (
                <div className="w-full h-[300px] flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
                    <div className="bg-red-500/20 p-4 rounded-full mb-4">
                        <Loader2 className="animate-spin text-red-500" size={32} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Processing Recording...</h3>
                    <p className="text-gray-400 text-sm max-w-md">
                        The video file is not ready yet (404 Not Found). <br/>
                        GetStream is currently processing the lecture. 
                    </p>
                    <p className="text-xs text-gray-500 mt-4">
                        Please close this and try again in 5-10 minutes.
                    </p>
                </div>
            ) : (
                <video 
                    ref={videoRef}
                    controls 
                    className="w-full h-auto max-h-[500px]"
                    crossOrigin="anonymous"
                    onError={(e) => setError("Recording is being processed.")} 
                >
                    Your browser does not support the video tag.
                </video>
            )}
            
            {/* Player Header */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent flex justify-between items-start z-10">
                <span className={`text-white font-medium text-sm px-2 py-1 rounded shadow-sm ${error ? 'bg-gray-600' : 'bg-red-600'}`}>
                    {error ? 'Status: Pending' : 'Now Playing'}
                </span>
                <button 
                    onClick={onClose}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-all backdrop-blur-sm"
                >
                    <X size={24} />
                </button>
            </div>
        </div>
    );
};

const LectureRecordings = ({ lectureId }) => {
    const { backendUrl } = useAppContext();
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const { data } = await axios.get(
                    `${backendUrl}/api/lectures/${lectureId}/recordings`, 
                    { withCredentials: true }
                );

                if (data.success) {
                    setRecordings(data.recordings);
                }
            } catch (error) {
                console.error("Error fetching recordings:", error);
            } finally {
                setLoading(false);
            }
        };

        if (lectureId) fetchRecordings();
    }, [lectureId, backendUrl]);

    if (loading) return <ComponentLoader />;

    if (recordings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-500">
                <Video size={32} className="mb-2 opacity-50" />
                <p>No recordings available for this lecture.</p>
                <p className="text-xs mt-1">Recordings usually appear a few minutes after the lecture ends.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
                <Video className="text-red-600" size={20} />
                <h3 className="text-lg font-bold text-gray-800">Lecture Recordings</h3>
            </div>

            {/* Video Player Modal/Section */}
            {activeVideo && (
                <VideoPlayer 
                    src={activeVideo} 
                    onClose={() => setActiveVideo(null)} 
                />
            )}

            {/* Recordings Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recordings.map((rec, index) => (
                    <div 
                        key={rec.filename || index} 
                        className={`group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1
                            ${activeVideo === rec.url ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-200'}
                        `}
                        onClick={() => setActiveVideo(rec.url)}
                    >
                        {/* Thumbnail Area */}
                        <div className="h-40 bg-gray-900 relative flex items-center justify-center overflow-hidden">
                            {rec.thumb_url ? (
                                <img 
                                    src={rec.thumb_url} 
                                    alt="Recording Thumbnail" 
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-100 flex flex-col items-center justify-center">
                                    <Video size={40} className="text-gray-700 mb-2" />
                                </div>
                            )}
                            
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                {new Date(new Date(rec.end_time) - new Date(rec.start_time)).toISOString().substr(11, 8)}
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all group-hover:scale-110">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <Play size={14} className="text-blue-600 ml-0.5" fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-1">
                                Session Recording {index + 1}
                            </h4>
                            
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar size={12} />
                                    <span>{new Date(rec.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock size={12} />
                                    <span>
                                        {new Date(rec.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                                        {" - "}
                                        {new Date(rec.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LectureRecordings;