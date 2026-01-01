import { useCall } from "@stream-io/video-react-sdk";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { useAppContext } from "../../contexts/AppContext";

const EndCallButton = () => {
  const call = useCall();
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useAppContext();

  const endLecture = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/lectures/${lectureId}/end`,
        {},
        { withCredentials: true }
      );

      navigate(`/dashboard`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={endLecture}
      className="rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-white cursor-pointer"
    >
      End Lecture
    </button>
  );
};

export default EndCallButton;
