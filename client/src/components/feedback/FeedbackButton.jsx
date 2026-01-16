import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

const FeedbackButton = ({ onClick }) => {
  const { isSuperAdmin, openFeedbackModal, showModal, setShowModal } = useAppContext();

  return (
    <button
      onClick={openFeedbackModal}
      className="
        fixed bottom-6 right-6 z-50 
        flex items-center gap-2 
        px-5 py-3 
        bg-blue-500 text-white 
        rounded-full shadow-lg 
        hover:bg-blue-00 hover:scale-105 hover:shadow-xl
        transition-all duration-300 ease-in-out
        cursor-pointer
      "
      aria-label="Open Feedback Form"
    >
      <MessageSquare size={20} />
      <span className="font-medium text-sm">Feedback</span>
    </button>
  );
};

export default FeedbackButton;