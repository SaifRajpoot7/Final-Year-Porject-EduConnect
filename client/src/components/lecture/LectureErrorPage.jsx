import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router';

const LectureErrorPage = ({ title, message, buttonLabel = 'Dashboard', redirectUrl, loading }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-gray-800 flex items-center justify-center px-4">
            {loading ?
                <Loader size={48} className="animate-spin text-white" />
                :
                <div className="max-w-md w-full bg-gray-900 rounded-xl shadow-lg p-8 text-center">
                    <h1 className="text-2xl font-semibold text-white mb-4">
                        {title}
                    </h1>

                    <p className="text-white mb-8">
                        {message}
                    </p>

                    <button
                        onClick={() => navigate(redirectUrl)}
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white cursor-pointer font-medium py-3 rounded-lg transition"
                    >
                        {buttonLabel}
                    </button>
                </div>
            }
        </div>
    );
};

export default LectureErrorPage;
