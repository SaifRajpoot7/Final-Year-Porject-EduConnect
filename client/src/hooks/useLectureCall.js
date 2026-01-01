// // import { useEffect, useState } from "react";
// // import { useStreamVideoClient } from "@stream-io/video-react-sdk";

// // const useLectureCall = ({ lecture, lectureState, isAdmin }) => {
// //   const client = useStreamVideoClient();
// //   const [call, setCall] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     if (!client || !lecture || lectureState !== "live") return;

// //     let cancelled = false;

// //     const prepareCall = async () => {
// //       try {
// //         setLoading(true);

// //         const callInstance = client.call(
// //           "default",
// //           lecture._id.toString()
// //         );

// //         // Admin creates (or reuses) the call
// //         if (isAdmin) {
// //           await callInstance.getOrCreate({
// //             data: {
// //               starts_at: new Date().toISOString(),
// //               custom: {
// //                 lectureId: lecture._id.toString(),
// //                 title: lecture.title,
// //               },
// //             },
// //           });
// //         }

// //         // Everyone joins
// //         await callInstance.join();

// //         // 🔒 DEVICE CONTROL
// //         if (isAdmin) {
// //           // Teacher joins with mic & cam ON
// //           await callInstance.microphone.enable();
// //           await callInstance.camera.enable();
// //         } else {
// //           // Students join muted with cam OFF
// //           await callInstance.microphone.disable();
// //           await callInstance.camera.disable();
// //         }

// //         if (!cancelled) {
// //           setCall(callInstance);
// //         }
// //       } catch (err) {
// //         console.error("Failed to prepare lecture call:", err);
// //       } finally {
// //         if (!cancelled) setLoading(false);
// //       }
// //     };

// //     prepareCall();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [client, lecture, lectureState, isAdmin]);

// //   return { call, loading };
// // };

// // export default useLectureCall;



import { useEffect, useState } from "react";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";

const useLectureCall = ({ lecture, lectureState }) => {
  const client = useStreamVideoClient();
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!client || !lecture || lectureState !== "live") return;

    const init = async () => {
      const call = client.call("default", lecture._id);

      if (isAdmin) {
        await call.getOrCreate();
      }

      await axios.post(`/api/lectures/${lecture._id}/join`);
      await call.join();

      setCall(call);
    };

    init();

    return () => {
      axios.post(`/api/lectures/${lecture._id}/leave`);
      call?.leave();
    };
  }, []);


  return { call, loading };
};

export default useLectureCall;


