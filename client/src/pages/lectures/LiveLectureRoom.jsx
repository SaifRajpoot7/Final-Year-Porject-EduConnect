// // import { useState, useEffect } from 'react';
// // import {
// //     CallControls,
// //     CallParticipantsList,
// //     PaginatedGridLayout,
// //     SpeakerLayout,
// //     useCall,
// //     useCallStateHooks,
// //     CallingState,
// // } from '@stream-io/video-react-sdk';
// // import { Users, Loader, AlertCircle } from 'lucide-react';
// // import { useNavigate } from 'react-router';
// // import axios from 'axios';
// // import { useAppContext } from '../../contexts/AppContext';
// // import useBeforeUnload from '../../hooks/useBeforeUnload';

// // const LiveLectureRoom = ({ isAdmin, lectureId }) => {
// //     const navigate = useNavigate();
// //     const { backendUrl } = useAppContext();
// //     const call = useCall();

// //     const { useCallCallingState } = useCallStateHooks();
// //     const callingState = useCallCallingState();

// //     const [layout, setLayout] = useState('speaker-left');
// //     const [showParticipants, setShowParticipants] = useState(false);

// //     useBeforeUnload(lectureId);

// //     // --- SELF HEALING FIX ---
// //     // If we land here and state is IDLE, force a join.
// //     useEffect(() => {
// //         if (callingState === CallingState.IDLE && call) {
// //             console.log("State is IDLE in Room, forcing join...");
// //             call.join().catch(err => console.error("Auto-join failed:", err));
// //         }
// //     }, [callingState, call]);

// //     // DEBUG LOG
// //     console.log("LiveLectureRoom State:", callingState);

// //     // 1. Loading States
// //     if (!callingState || callingState === CallingState.JOINING || callingState === CallingState.RECONNECTING || callingState === CallingState.IDLE) {
// //         return (
// //             <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-800 text-white gap-3">
// //                 <Loader className="animate-spin h-10 w-10 text-blue-500" />
// //                 <p className="text-sm text-gray-400">
// //                     {callingState === CallingState.RECONNECTING ? "Reconnecting..." : "Connecting to Room..."}
// //                 </p>
// //             </div>
// //         );
// //     }

// //     // 2. Error State (Only show if truly LEFT)
// //     if (callingState === CallingState.LEFT) {
// //         return (
// //             <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-800 text-white gap-4">
// //                 <AlertCircle className="h-12 w-12 text-red-500" />
// //                 <h2 className="text-xl font-bold">Connection Lost</h2>
// //                 <button 
// //                     onClick={() => window.location.reload()} 
// //                     className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition"
// //                 >
// //                     Rejoin
// //                 </button>
// //             </div>
// //         );
// //     }

// //     // ... (Rest of your component: handleLeave, handleEndCall, Layouts, Controls) ...
// //     // Copy the rest of the return statement from the previous correct version

// //     const handleLeave = async () => {
// //         try {
// //             await call.leave();
// //             await axios.post(`${backendUrl}/api/lectures/${lectureId}/leave`, {}, { withCredentials: true });
// //             navigate('/'); 
// //         } catch (error) {
// //             console.error("Error leaving:", error);
// //         }
// //     };

// //     const handleEndCall = async () => {
// //         try {
// //             await axios.post(`${backendUrl}/api/lectures/${lectureId}/end`, {}, { withCredentials: true });
// //         } catch (error) {
// //             console.error("Error ending call:", error);
// //         }
// //     };

// //     const CallLayout = () => {
// //         switch (layout) {
// //             case 'grid': return <PaginatedGridLayout />;
// //             case 'speaker-right': return <SpeakerLayout participantsBarPosition="left" />;
// //             default: return <SpeakerLayout participantsBarPosition="right" />;
// //         }
// //     };

// //     return (
// //         <section className="relative h-screen w-full overflow-hidden bg-gray-800 text-white">
// //             <div className="relative flex size-full items-center justify-center">
// //                 <div className="flex size-full max-w-[1000px] items-center">
// //                     <CallLayout />
// //                 </div>
// //                 {showParticipants && (
// //                     <div className="absolute right-0 top-0 h-full w-[300px] bg-gray-900 p-4 z-10 border-l border-gray-700">
// //                         <CallParticipantsList onClose={() => setShowParticipants(false)} />
// //                     </div>
// //                 )}
// //             </div>

// //             <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 pb-4 px-4">
// //                 <CallControls onLeave={handleLeave} />
// //                 <button onClick={() => setShowParticipants((prev) => !prev)}>
// //                     <div className="cursor-pointer rounded-full bg-[#19232d] p-3 hover:bg-[#4c535b] transition">
// //                         <Users size={20} className="text-white" />
// //                     </div>
// //                 </button>
// //                 {isAdmin && (
// //                     <button 
// //                         onClick={handleEndCall}
// //                         className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-full font-semibold text-sm transition shadow-lg"
// //                     >
// //                         End Class
// //                     </button>
// //                 )}
// //             </div>
// //         </section>
// //     );
// // };

// // export default LiveLectureRoom;

// import { useState, useEffect } from 'react';
// import {
//     CallParticipantsList,
//     PaginatedGridLayout,
//     SpeakerLayout,
//     useCall,
//     useCallStateHooks,
//     CallingState,
// } from '@stream-io/video-react-sdk';
// import { 
//     Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, 
//     Users, LayoutGrid, RectangleHorizontal, Radio, 
//     MoreVertical, Loader, AlertCircle 
// } from 'lucide-react';
// import { useNavigate } from 'react-router';
// import axios from 'axios';
// import { useAppContext } from '../../contexts/AppContext';
// import useBeforeUnload from '../../hooks/useBeforeUnload';

// // --- Helper Component: Recording Timer ---
// const RecordingTimer = () => {
//     const { useCallRecordingInProgress } = useCallStateHooks();
//     const isRecording = useCallRecordingInProgress();
//     const [seconds, setSeconds] = useState(0);

//     useEffect(() => {
//         let interval;
//         if (isRecording) {
//             interval = setInterval(() => setSeconds(s => s + 1), 1000);
//         } else {
//             setSeconds(0);
//         }
//         return () => clearInterval(interval);
//     }, [isRecording]);

//     if (!isRecording) return null;

//     const formatTime = (totalSeconds) => {
//         const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
//         const secs = (totalSeconds % 60).toString().padStart(2, '0');
//         return `${mins}:${secs}`;
//     };

//     return (
//         <div className="flex items-center gap-2 bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm font-semibold border border-red-500/50">
//             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
//             REC {formatTime(seconds)}
//         </div>
//     );
// };

// // --- Main Component ---
// const LiveLectureRoom = ({ isAdmin, lectureId }) => {
//     const navigate = useNavigate();
//     const { backendUrl } = useAppContext();
//     const call = useCall();

//     // Stream State Hooks
//     const { useCallCallingState, useParticipantCount, useMicrophoneState, useCameraState, useScreenShareState, useCallRecordingInProgress } = useCallStateHooks();
//     const callingState = useCallCallingState();
//     const participantCount = useParticipantCount();
//     const { microphone, isMute: isMicMuted } = useMicrophoneState();
//     const { camera, isMute: isCamMuted } = useCameraState();
//     const { screenShare, isMute: isScreenSharing } = useScreenShareState(); // Note: isMute is true when NOT sharing
//     const isRecording = useCallRecordingInProgress();

//     // Local State
//     const [layout, setLayout] = useState('speaker-left');
//     const [showParticipants, setShowParticipants] = useState(false);
//     const [showMoreOptions, setShowMoreOptions] = useState(false);

//     // Tab Close Handler
//     useBeforeUnload(lectureId);

//     // Self-Healing Join Logic
//     useEffect(() => {
//         if (callingState === CallingState.IDLE && call) {
//             console.log("State is IDLE in Room, forcing join...");
//             call.join().catch(err => console.error("Auto-join failed:", err));
//         }
//     }, [callingState, call]);

//     // --- Actions ---

//     const toggleMic = async () => {
//         try {
//             await microphone.toggle();
//         } catch (err) {
//             console.error("Mic toggle failed", err);
//         }
//     };

//     const toggleCam = async () => {
//         try {
//             await camera.toggle();
//         } catch (err) {
//             console.error("Cam toggle failed", err);
//         }
//     };

//     const toggleScreenShare = async () => {
//         try {
//             await screenShare.toggle();
//         } catch (err) {
//             console.error("Screen share toggle failed", err);
//         }
//     };

//     const toggleRecording = async () => {
//         try {
//             if (isRecording) {
//                 await call.stopRecording();
//             } else {
//                 await call.startRecording();
//             }
//         } catch (err) {
//             console.error("Recording toggle failed", err);
//         }
//     };

//     const muteAllParticipants = async () => {
//         try {
//             await call.muteAllUsers();
//         } catch (err) {
//             console.error("Mute all failed", err);
//         }
//     };

//     const handleLeave = async () => {
//         try {
//             await call.leave();
//             await axios.post(`${backendUrl}/api/lectures/${lectureId}/leave`, {}, { withCredentials: true });
//             navigate('/');
//         } catch (error) {
//             console.error("Error leaving:", error);
//         }
//     };

//     const handleEndCall = async () => {
//         const confirmEnd = window.confirm("Are you sure you want to end the class for everyone?");
//         if (!confirmEnd) return;

//         try {
//             await axios.post(`${backendUrl}/api/lectures/${lectureId}/end`, {}, { withCredentials: true });
//         } catch (error) {
//             console.error("Error ending call:", error);
//         }
//     };

//     // --- Loading / Error States ---
//     if (!callingState || callingState === CallingState.JOINING || callingState === CallingState.RECONNECTING || callingState === CallingState.IDLE) {
//         return (
//             <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white gap-3">
//                 <Loader className="animate-spin h-10 w-10 text-blue-500" />
//                 <p className="text-sm text-gray-400">Connecting to Lecture Room...</p>
//             </div>
//         );
//     }

//     if (callingState === CallingState.LEFT) {
//         return (
//             <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
//                 <AlertCircle className="h-12 w-12 text-red-500" />
//                 <h2 className="text-xl font-bold">You left the lecture</h2>
//                 <button onClick={() => window.location.reload()} className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition">
//                     Rejoin
//                 </button>
//             </div>
//         );
//     }

//     // --- Render ---

//     const CallLayout = () => {
//         switch (layout) {
//             case 'grid': return <PaginatedGridLayout />;
//             case 'speaker-right': return <SpeakerLayout participantsBarPosition="left" />;
//             default: return <SpeakerLayout participantsBarPosition="right" />;
//         }
//     };

//     return (
//         <section className="relative h-screen w-full overflow-hidden bg-gray-900 text-white flex flex-col">

//             {/* Top Bar: Recording & Info */}
//             <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
//                 <RecordingTimer />
//                 <div className="bg-gray-800/80 backdrop-blur px-3 py-1 rounded-full text-sm font-medium border border-gray-700 flex items-center gap-2">
//                     <Users size={14} className="text-blue-400" />
//                     {participantCount} Online
//                 </div>
//             </div>

//             {/* Main Video Area */}
//             <div className="flex-1 relative flex items-center justify-center p-4">
//                 <div className="w-full max-w-6xl h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-950 border border-gray-800 relative">
//                     <CallLayout />
//                 </div>

//                 {/* Participants Sidebar (Overlay) */}
//                 {showParticipants && (
//                     <div className="absolute right-4 top-4 bottom-20 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden z-20">
//                         <div className="p-4 border-b border-gray-700 flex justify-between items-center">
//                             <h3 className="font-semibold">Participants</h3>
//                             <button onClick={() => setShowParticipants(false)} className="text-gray-400 hover:text-white">✕</button>
//                         </div>
//                         <div className="flex-1 overflow-y-auto custom-scrollbar">
//                             <CallParticipantsList onClose={() => setShowParticipants(false)} />
//                         </div>
//                         {isAdmin && (
//                             <div className="p-4 border-t border-gray-700 bg-gray-900/50">
//                                 <button 
//                                     onClick={muteAllParticipants}
//                                     className="w-full py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition text-sm font-medium border border-red-500/20"
//                                 >
//                                     Mute Everyone
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* Custom Control Bar */}
//             <div className="h-20 bg-gray-800/90 backdrop-blur border-t border-gray-700 flex items-center justify-center px-4 gap-4 md:gap-6 relative z-30">

//                 {/* 1. Media Controls */}
//                 <div className="flex items-center gap-3">
//                     <ControlButton 
//                         isActive={!isMicMuted} 
//                         onClick={toggleMic}
//                         icon={!isMicMuted ? Mic : MicOff}
//                         activeColor="bg-gray-700"
//                         inactiveColor="bg-red-500/20 text-red-500 border-red-500/50"
//                         tooltip={isMicMuted ? "Unmute" : "Mute"}
//                     />
//                     <ControlButton 
//                         isActive={!isCamMuted} 
//                         onClick={toggleCam}
//                         icon={!isCamMuted ? Video : VideoOff}
//                         activeColor="bg-gray-700"
//                         inactiveColor="bg-red-500/20 text-red-500 border-red-500/50"
//                         tooltip={isCamMuted ? "Start Video" : "Stop Video"}
//                     />
//                      {/* Only Admin or Teacher usually shares screen, but Stream allows all by default unless locked */}
//                     <ControlButton 
//                         isActive={isScreenSharing} // Note: Hook logic varies, usually false=sharing for isMute. Adjust based on SDK version.
//                         onClick={toggleScreenShare}
//                         icon={MonitorUp}
//                         activeColor="bg-blue-500 text-white"
//                         inactiveColor="bg-gray-700"
//                         tooltip="Share Screen"
//                     />
//                 </div>

//                 <div className="h-8 w-px bg-gray-600 mx-2 hidden md:block" />

//                 {/* 2. Layout & View Controls */}
//                 <div className="flex items-center gap-3">
//                     <ControlButton 
//                         isActive={layout === 'grid'}
//                         onClick={() => setLayout('grid')}
//                         icon={LayoutGrid}
//                         tooltip="Grid View"
//                     />
//                     <ControlButton 
//                         isActive={layout === 'speaker-left'}
//                         onClick={() => setLayout('speaker-left')}
//                         icon={RectangleHorizontal}
//                         tooltip="Speaker View"
//                     />
//                     <ControlButton 
//                         isActive={showParticipants}
//                         onClick={() => setShowParticipants(!showParticipants)}
//                         icon={Users}
//                         activeColor="bg-blue-600 text-white"
//                         tooltip="Participants"
//                     />
//                 </div>

//                 <div className="h-8 w-px bg-gray-600 mx-2 hidden md:block" />

//                 {/* 3. Admin Controls (Conditional) */}
//                 {isAdmin && (
//                     <div className="flex items-center gap-3">
//                         <ControlButton 
//                             isActive={isRecording}
//                             onClick={toggleRecording}
//                             icon={Radio}
//                             activeColor="bg-red-500 text-white animate-pulse"
//                             inactiveColor="bg-gray-700 text-gray-400 hover:text-red-400"
//                             tooltip={isRecording ? "Stop Recording" : "Start Recording"}
//                         />
//                         {/* More Menu for Mobile/Extra Admin stuff */}
//                         <div className="relative">
//                             <ControlButton 
//                                 onClick={() => setShowMoreOptions(!showMoreOptions)}
//                                 icon={MoreVertical}
//                                 tooltip="More Options"
//                             />
//                             {showMoreOptions && (
//                                 <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden py-1">
//                                     <button 
//                                         onClick={() => { muteAllParticipants(); setShowMoreOptions(false); }}
//                                         className="w-full text-left px-4 py-2.5 hover:bg-gray-700 text-sm text-red-400 hover:text-red-300 flex items-center gap-2"
//                                     >
//                                         <MicOff size={16} /> Mute All
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {/* 4. Leave / End Call */}
//                 <div className="ml-auto md:ml-4">
//                     {isAdmin ? (
//                         <button 
//                             onClick={handleEndCall}
//                             className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-red-900/20"
//                         >
//                             <PhoneOff size={18} />
//                             <span className="hidden md:inline">End Class</span>
//                         </button>
//                     ) : (
//                         <button 
//                             onClick={handleLeave}
//                             className="bg-gray-700 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2"
//                         >
//                             <PhoneOff size={18} />
//                             <span className="hidden md:inline">Leave</span>
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </section>
//     );
// };

// // --- Helper: Reusable Control Button ---
// const ControlButton = ({ isActive, onClick, icon: Icon, activeColor, inactiveColor, tooltip }) => {
//     // Default colors if not provided
//     const activeClass = activeColor || "bg-blue-600 text-white shadow-lg shadow-blue-900/20";
//     const inactiveClass = inactiveColor || "bg-gray-700 text-gray-200 hover:bg-gray-600";

//     return (
//         <button
//             onClick={onClick}
//             title={tooltip}
//             className={`p-3.5 rounded-xl transition-all duration-200 flex items-center justify-center ${isActive ? activeClass : inactiveClass}`}
//         >
//             <Icon size={20} />
//         </button>
//     );
// };

// export default LiveLectureRoom;


import { useState, useEffect } from 'react';
import {
    CallParticipantsList,
    PaginatedGridLayout,
    SpeakerLayout,
    useCall,
    useCallStateHooks,
    CallingState,
} from '@stream-io/video-react-sdk';
import {
    Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff,
    Users, LayoutGrid, RectangleHorizontal, Radio,
    MoreVertical, Loader, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useAppContext } from '../../contexts/AppContext';
import useBeforeUnload from '../../hooks/useBeforeUnload';

// --- Custom Hook for Recording State (Version Safe) ---
const useIsCallRecording = (call) => {
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        if (!call) return;

        // 1. Try to set initial state if available
        if (call.state?.recording) {
            setIsRecording(true);
        }

        // 2. Listen for events
        const handleStart = () => setIsRecording(true);
        const handleStop = () => setIsRecording(false);

        // Subscribe
        call.on('call.recording_started', handleStart);
        call.on('call.recording_stopped', handleStop);

        // Cleanup
        return () => {
            call.off('call.recording_started', handleStart);
            call.off('call.recording_stopped', handleStop);
        };
    }, [call]);

    return isRecording;
};

// --- Helper Component: Recording Timer ---
const RecordingTimer = ({ isRecording }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => setSeconds(s => s + 1), 1000);
        } else {
            setSeconds(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    if (!isRecording) return null;

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className="flex items-center gap-2 bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm font-semibold border border-red-500/50">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            REC {formatTime(seconds)}
        </div>
    );
};

// --- Main Component ---
const LiveLectureRoom = ({ isAdmin, lectureId }) => {
    const navigate = useNavigate();
    const { backendUrl } = useAppContext();
    const call = useCall();

    // Stream State Hooks
    const {
        useCallCallingState,
        useParticipantCount,
        useMicrophoneState,
        useCameraState,
        useScreenShareState
    } = useCallStateHooks();

    // Use our custom hook instead of the SDK one
    const isRecording = useIsCallRecording(call);

    const callingState = useCallCallingState();
    const participantCount = useParticipantCount();
    const { microphone, isMute: isMicMuted } = useMicrophoneState();
    const { camera, isMute: isCamMuted } = useCameraState();
    const { screenShare, isMute: isScreenSharing } = useScreenShareState();

    // Local State
    const [layout, setLayout] = useState('grid');
    const [showParticipants, setShowParticipants] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    // Tab Close Handler
    useBeforeUnload(lectureId);

    // Self-Healing Join Logic
    useEffect(() => {
        if (callingState === CallingState.IDLE && call) {
            console.log("State is IDLE in Room, forcing join...");
            call.join().catch(err => console.error("Auto-join failed:", err));
        }
    }, [callingState, call]);

    // --- Actions ---

    const toggleMic = async () => {
        try {
            await microphone.toggle();
        } catch (err) {
            console.error("Mic toggle failed", err);
        }
    };

    const toggleCam = async () => {
        try {
            await camera.toggle();
        } catch (err) {
            console.error("Cam toggle failed", err);
        }
    };

    const toggleScreenShare = async () => {
        try {
            await screenShare.toggle();
        } catch (err) {
            console.error("Screen share toggle failed", err);
        }
    };

    const toggleRecording = async () => {
        try {
            if (isRecording) {
                await call.stopRecording();
            } else {
                await call.startRecording();
            }
        } catch (err) {
            console.error("Recording toggle failed", err);
        }
    };

    const muteAllParticipants = async () => {
        try {
            await call.muteAllUsers();
        } catch (err) {
            console.error("Mute all failed", err);
        }
    };

    // --- FIX: Student Redirect Listener inside the Room ---
    useEffect(() => {
        if (!call) return;

        const handleCallEnded = () => {
            // Force redirect for students when call is ended remotely
            navigate('/dashboard'); // Or back to course page
        };

        call.on('call.ended', handleCallEnded);

        return () => {
            call.off('call.ended', handleCallEnded);
        };
    }, [call, navigate]);

    const handleLeave = async () => {
        try {
            await call.leave();
            await axios.post(`${backendUrl}/api/lectures/${lectureId}/leave`, {}, { withCredentials: true });
            navigate('/');
        } catch (error) {
            console.error("Error leaving:", error);
        }
    };

    // const handleEndCall = async () => {
    //     const confirmEnd = window.confirm("Are you sure you want to end the class for everyone?");
    //     if (!confirmEnd) return;

    //     try {
    //         await axios.post(`${backendUrl}/api/lectures/${lectureId}/end`, {}, { withCredentials: true });
    //     } catch (error) {
    //         console.error("Error ending call:", error);
    //     }
    // };

    // --- FIX: Teacher Redirect Logic ---
    const handleEndCall = async () => {
        const confirmEnd = window.confirm("Are you sure you want to end the class for everyone?");
        if (!confirmEnd) return;

        try {
            // 1. Notify Backend
            await axios.post(`${backendUrl}/api/lectures/${lectureId}/end`, {}, { withCredentials: true });

            // 2. End local stream instance (redundant but safe)
            if (call) await call.endCall();

            // 3. IMMEDIATE REDIRECT for Teacher
            navigate('/dashboard');

        } catch (error) {
            console.error("Error ending call:", error);
            // Even if backend fails, if stream is dead, leave
            navigate('/dashboard');
        }
    };

    // --- Loading / Error States ---
    if (!callingState || callingState === CallingState.JOINING || callingState === CallingState.RECONNECTING || callingState === CallingState.IDLE) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white gap-3">
                <Loader className="animate-spin h-10 w-10 text-blue-500" />
                <p className="text-sm text-gray-400">Connecting to Lecture Room...</p>
            </div>
        );
    }

    if (callingState === CallingState.LEFT) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-bold">You left the lecture</h2>
                <button onClick={() => window.location.reload()} className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                    Rejoin
                </button>
            </div>
        );
    }

    // --- Render ---

    const CallLayout = () => {
        switch (layout) {
            case 'grid': return <PaginatedGridLayout />;
            case 'speaker-right': return <SpeakerLayout participantsBarPosition="left" />;
            default: return <SpeakerLayout participantsBarPosition="right" />;
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-gray-900 text-white flex flex-col">

            {/* Top Bar: Recording & Info */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
                {/* Pass isRecording prop here */}
                <RecordingTimer isRecording={isRecording} />
                <div className="bg-gray-800/80 backdrop-blur px-3 py-1 rounded-full text-sm font-medium border border-gray-700 flex items-center gap-2">
                    <Users size={14} className="text-blue-400" />
                    {participantCount} Online
                </div>
            </div>

            {/* Main Video Area */}
            <div className="flex-1 relative flex items-center justify-center p-4">
                <div className="w-full max-w-6xl h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative flex justify-center align-middle items-center content-center">
                    <CallLayout />
                </div>

                {/* Participants Sidebar (Overlay) */}
                {showParticipants && (
                    <div className="absolute right-4 top-4 bottom-20 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden z-20">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="font-semibold">Participants</h3>
                            <button onClick={() => setShowParticipants(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <CallParticipantsList onClose={() => setShowParticipants(false)} />
                        </div>
                        {isAdmin && (
                            <div className="p-4 border-t border-gray-700 bg-gray-900/50">
                                <button
                                    onClick={muteAllParticipants}
                                    className="w-full py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition text-sm font-medium border border-red-500/20"
                                >
                                    Mute Everyone
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Custom Control Bar */}
            <div className="h-20 bg-gray-800/90 backdrop-blur border-t border-gray-700 flex items-center justify-center px-4 gap-4 md:gap-6 relative z-30">

                {/* 1. Media Controls */}
                <div className="flex items-center gap-3">
                    <ControlButton
                        isActive={!isMicMuted}
                        onClick={toggleMic}
                        icon={!isMicMuted ? Mic : MicOff}
                        activeColor="bg-gray-700"
                        inactiveColor="bg-red-500/20 text-red-500 border-red-500/50"
                        tooltip={isMicMuted ? "Unmute" : "Mute"}
                    />
                    <ControlButton
                        isActive={!isCamMuted}
                        onClick={toggleCam}
                        icon={!isCamMuted ? Video : VideoOff}
                        activeColor="bg-gray-700"
                        inactiveColor="bg-red-500/20 text-red-500 border-red-500/50"
                        tooltip={isCamMuted ? "Start Video" : "Stop Video"}
                    />
                    <ControlButton
                        isActive={isScreenSharing}
                        onClick={toggleScreenShare}
                        icon={MonitorUp}
                        activeColor="bg-blue-500 text-white"
                        inactiveColor="bg-gray-700"
                        tooltip="Share Screen"
                    />
                </div>

                <div className="h-8 w-px bg-gray-600 mx-2 hidden md:block" />

                {/* 2. Layout & View Controls */}
                <div className="flex items-center gap-3">
                    <ControlButton
                        isActive={layout === 'grid'}
                        onClick={() => setLayout('grid')}
                        icon={LayoutGrid}
                        tooltip="Grid View"
                    />
                    <ControlButton
                        isActive={layout === 'speaker-left'}
                        onClick={() => setLayout('speaker-left')}
                        icon={RectangleHorizontal}
                        tooltip="Speaker View"
                    />
                    <ControlButton
                        isActive={showParticipants}
                        onClick={() => setShowParticipants(!showParticipants)}
                        icon={Users}
                        activeColor="bg-blue-600 text-white"
                        tooltip="Participants"
                    />
                </div>

                <div className="h-8 w-px bg-gray-600 mx-2 hidden md:block" />

                {/* 3. Admin Controls (Conditional) */}
                {isAdmin && (
                    <div className="flex items-center gap-3">
                        <ControlButton
                            isActive={isRecording}
                            onClick={toggleRecording}
                            icon={Radio}
                            activeColor="bg-red-500 text-white animate-pulse"
                            inactiveColor="bg-gray-700 text-gray-400 hover:text-red-400"
                            tooltip={isRecording ? "Stop Recording" : "Start Recording"}
                        />
                        <div className="relative">
                            <ControlButton
                                onClick={() => setShowMoreOptions(!showMoreOptions)}
                                icon={MoreVertical}
                                tooltip="More Options"
                            />
                            {showMoreOptions && (
                                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden py-1">
                                    <button
                                        onClick={() => { muteAllParticipants(); setShowMoreOptions(false); }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-gray-700 text-sm text-red-400 hover:text-red-300 flex items-center gap-2"
                                    >
                                        <MicOff size={16} /> Mute All
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 4. Leave / End Call */}
                <div className="ml-auto md:ml-4">
                    {isAdmin ? (
                        <button
                            onClick={handleEndCall}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-red-900/20"
                        >
                            <PhoneOff size={18} />
                            <span className="hidden md:inline">End Class</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleLeave}
                            className="bg-gray-700 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2"
                        >
                            <PhoneOff size={18} />
                            <span className="hidden md:inline">Leave</span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

// --- Helper: Reusable Control Button ---
const ControlButton = ({ isActive, onClick, icon: Icon, activeColor, inactiveColor, tooltip }) => {
    const activeClass = activeColor || "bg-blue-600 text-white shadow-lg shadow-blue-900/20";
    const inactiveClass = inactiveColor || "bg-gray-700 text-gray-200 hover:bg-gray-600";

    return (
        <button
            onClick={onClick}
            title={tooltip}
            className={`p-3.5 rounded-xl transition-all duration-200 flex items-center justify-center ${isActive ? activeClass : inactiveClass}`}
        >
            <Icon size={20} />
        </button>
    );
};

export default LiveLectureRoom;



// import { useState, useEffect } from 'react';
// import {
//     CallControls,
//     CallParticipantsList,
//     PaginatedGridLayout,
//     SpeakerLayout,
//     useCall,
//     useCallStateHooks,
//     CallingState,
// } from '@stream-io/video-react-sdk';
// import {
//     LayoutGrid,
//     RectangleHorizontal,
//     Users,
//     Radio,
//     Loader,
//     AlertCircle,
//     Power
// } from 'lucide-react';
// import { useNavigate } from 'react-router';
// import axios from 'axios';
// import { useAppContext } from '../../contexts/AppContext';
// import useBeforeUnload from '../../hooks/useBeforeUnload';
// import '@stream-io/video-react-sdk/dist/css/styles.css'; // Ensure SDK styles are imported

// // --- Custom Hook for Recording State ---
// const useIsCallRecording = (call) => {
//     const [isRecording, setIsRecording] = useState(false);

//     useEffect(() => {
//         if (!call) return;
//         if (call.state?.recording) setIsRecording(true);

//         const handleStart = () => setIsRecording(true);
//         const handleStop = () => setIsRecording(false);

//         call.on('call.recording_started', handleStart);
//         call.on('call.recording_stopped', handleStop);

//         return () => {
//             call.off('call.recording_started', handleStart);
//             call.off('call.recording_stopped', handleStop);
//         };
//     }, [call]);

//     return isRecording;
// };

// const LiveLectureRoom = ({ isAdmin, lectureId }) => {
//     const navigate = useNavigate();
//     const { backendUrl } = useAppContext();
//     const call = useCall();

//     // Stream Hooks
//     const { useCallCallingState, useParticipantCount } = useCallStateHooks();
//     const callingState = useCallCallingState();
//     const participantCount = useParticipantCount();
//     const isRecording = useIsCallRecording(call);

//     // Local State
//     const [layout, setLayout] = useState('speaker-left');
//     const [showParticipants, setShowParticipants] = useState(false);

//     useBeforeUnload(lectureId);

//     // 1. Redirect Listener (For Students)
//     useEffect(() => {
//         if (!call) return;
//         const handleCallEnded = () => navigate('/dashboard');
//         call.on('call.ended', handleCallEnded);
//         return () => call.off('call.ended', handleCallEnded);
//     }, [call, navigate]);

//     // 2. Self-Healing Logic
//     useEffect(() => {
//         if (callingState === CallingState.IDLE && call) {
//             call.join().catch(console.error);
//         }
//     }, [callingState, call]);

//     // --- Handlers ---

//     // Unified Leave/End Handler
//     const handleExit = async () => {
//         if (isAdmin) {
//             const confirmEnd = window.confirm("Do you want to end the class for everyone? \n\nClick OK to End Class.\nClick Cancel to just leave.");

//             if (confirmEnd) {
//                 // End for everyone
//                 try {
//                     await axios.post(`${backendUrl}/api/lectures/${lectureId}/end`, {}, { withCredentials: true });
//                     if (call) await call.endCall();
//                     navigate('/dashboard');
//                 } catch (error) {
//                     console.error(error);
//                     navigate('/dashboard');
//                 }
//             } else {
//                 // Just leave
//                 await leaveCall();
//             }
//         } else {
//             // Student Leave
//             await leaveCall();
//         }
//     };

//     const leaveCall = async () => {
//         try {
//             await call.leave();
//             await axios.post(`${backendUrl}/api/lectures/${lectureId}/leave`, {}, { withCredentials: true });
//             navigate('/');
//         } catch (error) {
//             navigate('/');
//         }
//     };

//     const toggleRecording = async () => {
//         try {
//             isRecording ? await call.stopRecording() : await call.startRecording();
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     // --- Render Logic ---

//     if (!callingState || [CallingState.JOINING, CallingState.RECONNECTING, CallingState.IDLE].includes(callingState)) {
//         return (
//             <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-950 text-white gap-3">
//                 <Loader className="animate-spin h-8 w-8 text-blue-500" />
//                 <p className="text-sm text-gray-400">Joining Lecture...</p>
//             </div>
//         );
//     }

//     if (callingState === CallingState.LEFT) {
//         return (
//             <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-950 text-white gap-4">
//                 <AlertCircle className="h-12 w-12 text-red-500" />
//                 <h2 className="text-xl font-bold">You left the lecture</h2>
//                 <button onClick={() => window.location.reload()} className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700">Rejoin</button>
//             </div>
//         );
//     }

//     return (
//         <div className="relative w-full h-screen max-h-screen bg-gray-950 overflow-hidden flex flex-col">

//             {/* Top Bar: Info & Custom Toggles */}
//             <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
//                 <div className="flex gap-2 pointer-events-auto">
//                     {/* Recording Indicator */}
//                     {isAdmin && (
//                         <button 
//                             onClick={toggleRecording}
//                             className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
//                         >
//                             <Radio size={14} />
//                             {isRecording ? "REC" : "START REC"}
//                         </button>
//                     )}

//                     {/* Participant Count */}
//                     <div className="bg-gray-900/80 backdrop-blur border border-gray-700 px-3 py-1.5 rounded-full text-xs text-white flex items-center gap-2">
//                         <Users size={14} className="text-blue-400" />
//                         {participantCount}
//                     </div>
//                 </div>

//                 <div className="flex gap-2 pointer-events-auto">
//                     {/* View Switcher */}
//                     <div className="bg-gray-900/90 border border-gray-700 rounded-lg p-1 flex gap-1">
//                         <button 
//                             onClick={() => setLayout('speaker-left')}
//                             className={`p-1.5 rounded ${layout === 'speaker-left' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
//                             title="Speaker View"
//                         >
//                             <RectangleHorizontal size={18} />
//                         </button>
//                         <button 
//                             onClick={() => setLayout('grid')}
//                             className={`p-1.5 rounded ${layout === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
//                             title="Grid View"
//                         >
//                             <LayoutGrid size={18} />
//                         </button>
//                     </div>

//                     <button 
//                         onClick={() => setShowParticipants(!showParticipants)}
//                         className={`p-2 rounded-lg border ${showParticipants ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800'}`}
//                     >
//                         <Users size={20} />
//                     </button>
//                 </div>
//             </div>

//             {/* Main Video Layout */}
//             <div className="flex-1 w-full h-full flex items-center justify-center p-2 md:p-4">
//                 <div className="w-full h-full max-w-[1200px] relative">
//                     {layout === 'grid' ? <PaginatedGridLayout /> : <SpeakerLayout participantsBarPosition="left" />}

//                     {/* Participants Overlay */}
//                     {showParticipants && (
//                         <div className="absolute top-0 right-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur border-l border-gray-800 z-20 shadow-2xl p-4 overflow-y-auto rounded-l-xl">
//                             <h3 className="text-white font-semibold mb-4">Participants</h3>
//                             <CallParticipantsList onClose={() => setShowParticipants(false)} />
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Default SDK Controls */}
//             {/* We wrap CallControls to override the Leave button behavior */}
//             <div className="w-full flex justify-center pb-6 pt-2 bg-gray-950">
//                 <div className="flex items-center gap-2">
//                     <CallControls onLeave={handleExit} />

//                     {/* Extra Admin Button if needed */}
//                     {isAdmin && (
//                         <button 
//                             onClick={handleExit}
//                             className="bg-red-600 p-3 rounded-full text-white hover:bg-red-700 shadow-lg ml-2"
//                             title="End Class"
//                         >
//                             <Power size={20} />
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LiveLectureRoom;

