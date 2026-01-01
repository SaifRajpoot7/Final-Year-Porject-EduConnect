import { StreamVideoClient } from '@stream-io/video-client';

const client = new StreamVideoClient({
  apiKey: import.meta.env.VITE,
  token: 'USER_TOKEN',
  user: { id: userId },
});

const joinLecture = async (lectureId) => {
  const lecture = await client.call('default', lectureId);
  await lecture.join({ create: true });

  // Teacher can publish streams
  if (isTeacher) {
    lecture.camera.enable();
    lecture.microphone.enable();
    lecture.screenShare.enable();
  }
};
