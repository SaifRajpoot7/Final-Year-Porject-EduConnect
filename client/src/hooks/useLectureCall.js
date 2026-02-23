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


