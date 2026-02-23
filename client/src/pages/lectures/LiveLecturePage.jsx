import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router"; // Added useNavigate
import axios from "axios";
import { useAppContext } from "../../contexts/AppContext";
import LectureSetup from "./LectureSetup";
import LiveLectureRoom from "./LiveLectureRoom";
import LectureErrorPage from "../../components/lecture/LectureErrorPage";
import { StreamCall, StreamTheme, useStreamVideoClient } from "@stream-io/video-react-sdk";

const LiveLecturePage = () => {
  const { lectureId } = useParams();
  const navigate = useNavigate(); // For redirect
  const { backendUrl } = useAppContext();
  const client = useStreamVideoClient();

  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [call, setCall] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Fetch Lecture Initial State
  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/lectures/${lectureId}`,
          { withCredentials: true }
        );

        if (!data.success) {
          setErrorMsg(data.message);
          return;
        }

        setLecture(data.lecture);
        setIsAdmin(data.isAdmin);

        // Access Control Logic
        if (data.lecture.status === "ended") {
          setErrorMsg("This lecture has ended.");
        } else if (data.lecture.status === "upcoming" && !data.isAdmin) {
          // Students wait here. Admin proceeds.
          setErrorMsg("Waiting for the teacher to start the lecture...");
          // Optionally, implement polling here to check when it goes live
        }

      } catch (err) {
        setErrorMsg("Failed to load lecture details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [lectureId, backendUrl]);

  // 2. Prepare Stream Call Object (But don't join yet)
  useEffect(() => {
    if (client && lecture && !call) {
      const _call = client.call('default', lecture._id);
      setCall(_call);
    }
  }, [client, lecture, call]);

  // // 3. Listen for "Call Ended" Event (Redirect Logic)
  // useEffect(() => {
  //   if (!call) return;

  //   const handleCallEnded = (event) => {
  //       // This fires when Admin calls call.end()
  //       // navigate(`/course/${lecture.course._id}/lectures`); 
  //        navigate('/dashboard');
  //   };

  //   // Subscribe to event
  //   const unsubscribe = call.on('call.ended', handleCallEnded);

  //   return () => {
  //       unsubscribe();
  //   };
  // }, [call, navigate, lecture]);

  // 3. Listen for "Call Ended" Event (Redirect Logic)
  useEffect(() => {
    if (!call) return;

    const handleCallEnded = (event) => {
      console.log("Call ended event received:", event);
      navigate('/dashboard'); // Use specific route if needed
    };

    // Listen for both event types just in case
    call.on('call.ended', handleCallEnded);

    // Also check if the call state transitions to empty/left remotely
    const handleStateChange = (state) => {
      // sometimes SDK emits different events based on version
    };

    return () => {
      call.off('call.ended', handleCallEnded);
    };
  }, [call, navigate]);

  if (loading) return <div className="text-white text-center mt-20">Loading Lecture...</div>;

  if (errorMsg && lecture?.status === 'ended') {
    return (
      <LectureErrorPage
        title="Lecture Status"
        message={errorMsg}
        redirectUrl={lecture ? `/course/${lecture.course._id}/lectures` : '/'}
      />
    );
  }

  // Show "Waiting Room" error if student tries to join early
  if (errorMsg && !isAdmin && lecture?.status !== 'live') {
    return (
      <LectureErrorPage
        title="Lecture Status"
        message={errorMsg}
        redirectUrl={lecture ? `/course/${lecture.course}/lectures` : '/'}
      />
    );
  }

  // If Admin, they can proceed even if errorMsg was "upcoming"
  // If Student, they can only proceed if lecture.status === 'live'

  return (
    <main className="h-screen w-full bg-gray-800">
      {call && (
        <StreamCall call={call}>
          <StreamTheme>
            {!isSetupComplete ? (
              <LectureSetup
                setIsSetupComplete={setIsSetupComplete}
                lectureId={lectureId}
                isAdmin={isAdmin}
              />
            ) : (
              <LiveLectureRoom
                isAdmin={isAdmin}
                lectureId={lectureId} // Pass ID for leave logic
              />
            )}
          </StreamTheme>
        </StreamCall>
      )}
    </main>
  );
};

export default LiveLecturePage;