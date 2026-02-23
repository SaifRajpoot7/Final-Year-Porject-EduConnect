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