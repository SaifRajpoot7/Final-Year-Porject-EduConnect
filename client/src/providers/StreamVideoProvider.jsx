import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import FullPageLoaderComponent from '../components/FullPageLoaderComponent';
import { useAppContext } from '../contexts/AppContext';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const StreamVideoProvider = ({ children }) => {
  const [videoClient, setVideoClient] = useState(null);
  const { userData, backendUrl } = useAppContext();
  const [token, setToken] = useState('');

  // Fetch token
  useEffect(() => {
    if (!userData) return;

    const getToken = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/generate-stream-token`, {
          params: { userId: userData._id }
        });

        if (response.data.success) {
          setToken(response.data.token);
        }
      } catch (err) {
        console.error('Failed to fetch Stream token', err);
      }
    };

    getToken();
  }, [userData]);

  // Initialize Stream client after token is ready
  useEffect(() => {
    if (!userData || !token) return;
    if (!API_KEY) throw new Error('Stream API key is missing');

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: userData._id,
        name: userData.fullName || userData._id,
      },
      token,
    });

    setVideoClient(client);

    // return () => client.disconnect();
  }, [userData, token]);

  if (!userData) {
    return children; // allow public routes
  }

  if (!videoClient) {
    return <FullPageLoaderComponent />;
  }


  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
