// // // // import { useEffect, useState } from 'react';
// // // // import {
// // // //     DeviceSettings,
// // // //     VideoPreview,
// // // //     useCall,
// // // //     useCallStateHooks,
// // // //     useStreamVideoClient,
// // // // } from '@stream-io/video-react-sdk';

// // // // const LectureSetup = ({ setIsSetupComplete, isAdmin }) => {
// // // //     // Call state hooks
// // // //     const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
// // // //     const client = useStreamVideoClient();
// // // //     const callStartsAt = useCallStartsAt();
// // // //     const callEndedAt = useCallEndedAt();
// // // //     const callTimeNotArrived = callStartsAt && new Date(callStartsAt) > new Date();
// // // //     const callHasEnded = !!callEndedAt;

// // // //     const call = useCall();

// // // //     if (!call) {
// // // //         throw new Error(
// // // //             'useStreamCall must be used within a StreamCall component.'
// // // //         );
// // // //     }

// // // //     const [isMicCamToggled, setIsMicCamToggled] = useState(false);

// // // //     useEffect(() => {
// // // //         if (isMicCamToggled) {
// // // //             call.camera.disable();
// // // //             call.microphone.disable();
// // // //         } else {
// // // //             call.camera.enable();
// // // //             call.microphone.enable();
// // // //         }
// // // //     }, [isMicCamToggled, call.camera, call.microphone]);

// // // //     const createLecture = async (lecture) => {
// // // //         try {
// // // //             const call = await client.call('default', lecture._id);
// // // //             if (!call) throw new Error('Failed to create meeting');
// // // //             const startsAt = new Date(Date.now()).toISOString();
// // // //             // values.dateTime.toISOString() || 
// // // //             const title = lecture.title;
// // // //             isAdmin ?
// // // //             await call.getOrCreate({
// // // //                 data: {
// // // //                     starts_at: startsAt,
// // // //                     custom: {
// // // //                         title,
// // // //                     },
// // // //                 },
// // // //             }) : await call.join();
// // // //             // setCallDetail(call);
// // // //             if (!call) {
// // // //                 console.log('gg')
// // // //             }
// // // //             navigate(`/lecture/live/${call.id}`);

// // // //             // toast.success('Meeting Created');
// // // //         } catch (error) {
// // // //             console.error(error);
// // // //             // toast.error('Failed to create Meeting');
// // // //         }
// // // //     };

// // // //     if (callTimeNotArrived)
// // // //         return (
// // // //             <p>
// // // //                 {`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
// // // //             </p>
// // // //         );

// // // //     if (callHasEnded)
// // // //         return (
// // // //             <p>
// // // //                 The call has been ended by the host
// // // //             </p>
// // // //         );




// // // //     return (
// // // //         <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white bg-gray-800">
// // // //             <h1 className="text-center text-2xl font-bold rounded-2xl">Setup</h1>
// // // //             <VideoPreview />
// // // //             <div className="flex h-16 items-center justify-center gap-3">
// // // //                 <label className="flex items-center justify-center gap-2 font-medium">
// // // //                     <input
// // // //                         type="checkbox"
// // // //                         checked={isMicCamToggled}
// // // //                         onChange={(e) => setIsMicCamToggled(e.target.checked)}
// // // //                     />
// // // //                     Join with mic and camera off
// // // //                 </label>
// // // //                 <DeviceSettings />
// // // //             </div>
// // // //             <button
// // // //                 className="rounded-md bg-green-500 px-4 py-2.5"
// // // //                 onClick={async () => {
// // // //                     if (call.state.callingState !== "joined") {
// // // //                         await call.join();
// // // //                     }
// // // //                     setIsSetupComplete(true);
// // // //                 }}
// // // //             >
// // // //                 Join meeting
// // // //             </button>
// // // //         </div>
// // // //     );
// // // // };

// // // // export default LectureSetup;


// // // import { useEffect, useState } from 'react';
// // // import {
// // //     DeviceSettings,
// // //     VideoPreview,
// // //     useCall,
// // //     useCallStateHooks,
// // // } from '@stream-io/video-react-sdk';

// // // import useBeforeUnload from '../../hooks/useBeforeUnload';
// // // import { useLectureJoinController } from '../../hooks/useLectureJoinController';

// // // const LectureSetup = ({ setIsSetupComplete, isAdmin }) => {
// // //     const call = useCall();
// // //     const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();

// // //     const callStartsAt = useCallStartsAt();
// // //     const callEndedAt = useCallEndedAt();

// // //     const callTimeNotArrived =
// // //         callStartsAt && new Date(callStartsAt) > new Date();

// // //     const callHasEnded = !!callEndedAt;

// // //     const [joinWithMicCamOff, setJoinWithMicCamOff] = useState(false);

// // //     const { joinLecture } = useLectureJoinController({ call, isAdmin });

// // //     useEffect(() => {
// // //         if (!call) return;

// // //         if (joinWithMicCamOff) {
// // //             call.camera.disable();
// // //             call.microphone.disable();
// // //         } else {
// // //             call.camera.enable();
// // //             call.microphone.enable();
// // //         }
// // //     }, [joinWithMicCamOff, call]);

// // //     useBeforeUnload({
// // //         enabled: call?.state.callingState === 'joined',
// // //         onLeave: () => {
// // //             call.leave();
// // //         },
// // //     });

// // //     if (!call) {
// // //         throw new Error('LectureSetup must be used inside StreamCall');
// // //     }

// // //     if (callTimeNotArrived) {
// // //         return (
// // //             <p>
// // //                 Lecture will start at{' '}
// // //                 {new Date(callStartsAt).toLocaleString()}
// // //             </p>
// // //         );
// // //     }

// // //     if (callHasEnded) {
// // //         return <p>The lecture has ended.</p>;
// // //     }

// // //     return (
// // //         <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-800 text-white">
// // //             <h1 className="text-2xl font-bold">Lecture Setup</h1>

// // //             <VideoPreview />

// // //             <div className="flex items-center gap-3">
// // //                 <label className="flex items-center gap-2">
// // //                     <input
// // //                         type="checkbox"
// // //                         checked={joinWithMicCamOff}
// // //                         onChange={(e) =>
// // //                             setJoinWithMicCamOff(e.target.checked)
// // //                         }
// // //                     />
// // //                     Join with mic & camera off
// // //                 </label>
// // //                 <DeviceSettings />
// // //             </div>

// // //             <button
// // //                 className="rounded-md bg-green-500 px-5 py-2"
// // //                 onClick={async () => {
// // //                     await joinLecture();
// // //                     setIsSetupComplete(true);
// // //                 }}
// // //             >
// // //                 Join Lecture
// // //             </button>
// // //         </div>
// // //     );
// // // };

// // // export default LectureSetup;


// // import { useEffect, useState } from "react";
// // import {
// //   DeviceSettings,
// //   VideoPreview,
// //   useCall,
// //   useCallStateHooks,
// // } from "@stream-io/video-react-sdk";
// // import useBeforeUnload from "../../hooks/useBeforeUnload";
// // import { useLectureJoinController } from "../../hooks/useLectureJoinController";

// // const LectureSetup = ({ lectureId, setIsSetupComplete }) => {
// //   const call = useCall();
// //   const [mute, setMute] = useState(false);
// //   const { joinLecture, leaveLecture } =
// //     useLectureJoinController({ call, lectureId });

// //   useEffect(() => {
// //     if (!call) return;
// //     mute
// //       ? (call.microphone.disable(), call.camera.disable())
// //       : (call.microphone.enable(), call.camera.enable());
// //   }, [mute, call]);

// //   useBeforeUnload({
// //     enabled: call?.state.callingState === "joined",
// //     onLeave: leaveLecture,
// //   });

// //   return (
// //     <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white gap-4">
// //       <h1 className="text-2xl font-bold">Lecture Setup</h1>
// //       <VideoPreview />
// //       <div className="flex gap-3 items-center">
// //         <label className="flex gap-2">
// //           <input
// //             type="checkbox"
// //             checked={mute}
// //             onChange={(e) => setMute(e.target.checked)}
// //           />
// //           Join muted
// //         </label>
// //         <DeviceSettings />
// //       </div>
// //       <button
// //         className="bg-green-500 px-6 py-2 rounded"
// //         onClick={async () => {
// //           await joinLecture();
// //           setIsSetupComplete(true);
// //         }}
// //       >
// //         Join Lecture
// //       </button>
// //     </div>
// //   );
// // };

// // export default LectureSetup;



// import { useEffect, useState } from 'react';
// import {
//     DeviceSettings,
//     VideoPreview,
//     useCall,
// } from '@stream-io/video-react-sdk';
// import { useLectureJoinController } from '../../hooks/useLectureJoinController';

// const LectureSetup = ({ setIsSetupComplete, lectureId, isAdmin }) => {
//     const call = useCall();
//     const [joinWithMicCamOff, setJoinWithMicCamOff] = useState(false);

//     // Use the controller we created
//     const { joinLecture, joinError } = useLectureJoinController({ lectureId, isAdmin });

//     useEffect(() => {
//         if (!call) return;
//         if (joinWithMicCamOff) {
//             call.camera.disable();
//             call.microphone.disable();
//         } else {
//             call.camera.enable();
//             call.microphone.enable();
//         }
//     }, [joinWithMicCamOff, call]);

//     const handleJoin = async () => {
//         try {
//             await joinLecture(); // Checks backend locks + Stream Join
//             setIsSetupComplete(true);
//         } catch (error) {
//             // Error handled by hook (joinError), but you can toast here too
//             console.error(error);
//         }
//     };

//     if (joinError) {
//         return (
//             <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-800 text-white">
//                 <h2 className="text-red-500 text-xl font-bold">Unable to Join</h2>
//                 <p>{joinError}</p>
//                 <button onClick={() => window.location.reload()} className="bg-blue-600 px-4 py-2 rounded">Retry</button>
//             </div>
//         );
//     }

//     return (
//         <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-800 text-white">
//             <h1 className="text-2xl font-bold">Lecture Setup</h1>
//             <VideoPreview />
//             <div className="flex items-center gap-3">
//                 <label className="flex items-center gap-2">
//                     <input
//                         type="checkbox"
//                         checked={joinWithMicCamOff}
//                         onChange={(e) => setJoinWithMicCamOff(e.target.checked)}
//                     />
//                     Join with mic & camera off
//                 </label>
//                 <DeviceSettings />
//             </div>
//             <button
//                 className="rounded-md bg-green-500 px-5 py-2 hover:bg-green-600 transition"
//                 onClick={handleJoin}
//             >
//                 Join Lecture
//             </button>
//         </div>
//     );
// };

// export default LectureSetup;


import { useEffect, useState } from 'react';
import {
    DeviceSettings,
    VideoPreview,
    useCall, // <--- We get the call object here
} from '@stream-io/video-react-sdk';
import { useLectureJoinController } from '../../hooks/useLectureJoinController';

const LectureSetup = ({ setIsSetupComplete, lectureId, isAdmin }) => {
    const call = useCall(); // Get the active call instance from context
    const [joinWithMicCamOff, setJoinWithMicCamOff] = useState(false);
    
    // Pass 'call' to the hook
    const { joinLecture, joinError } = useLectureJoinController({ lectureId, isAdmin, call });

    useEffect(() => {
        if (!call) return;
        if (joinWithMicCamOff) {
            call.camera.disable();
            call.microphone.disable();
        } else {
            call.camera.enable();
            call.microphone.enable();
        }
    }, [joinWithMicCamOff, call]);

    const handleJoin = async () => {
        try {
            await joinLecture();
            setIsSetupComplete(true);
        } catch (error) {
            console.error("Setup failed:", error);
        }
    };

    if (joinError) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-800 text-white">
                <h2 className="text-red-500 text-xl font-bold">Unable to Join</h2>
                <p>{joinError}</p>
                <button onClick={() => window.location.reload()} className="bg-blue-600 px-4 py-2 rounded">Retry</button>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-800 text-white">
            <h1 className="text-2xl font-bold">Lecture Setup</h1>
            <VideoPreview />
            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={joinWithMicCamOff}
                        onChange={(e) => setJoinWithMicCamOff(e.target.checked)}
                    />
                    Join with mic & camera off
                </label>
                <DeviceSettings />
            </div>
            <button
                className="rounded-md bg-green-500 px-5 py-2 hover:bg-green-600 transition"
                onClick={handleJoin}
            >
                Join Lecture
            </button>
        </div>
    );
};

export default LectureSetup;