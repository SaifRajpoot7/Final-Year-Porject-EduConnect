// import { StreamChatClient } from "@stream-io/node-sdk";

// const streamClient = new StreamChatClient(
//   process.env.STREAM_API_KEY,
//   process.env.STREAM_API_SECRET
// );

// export const generateToken = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: 'userId is required',
//       });
//     }
//     console.log(userId)

//     // Create / update user on Stream
//     // await streamClient.upsertUser({
//     //   id: userId,
//     //   role: 'user',
//     // });

//     // Generate JWT token for client
//     const token = streamClient.createToken(userId);

//     return res.status(200).json({
//       success: true,
//       token,
//     });
//   } catch (error) {
//     console.error('Stream token error:', error);

//     return res.status(500).json({
//       message: 'Failed to generate Stream token',
//     });
//   }
// };


import { StreamChat } from "stream-chat"; // old package
// OR
// import { StreamChatServer } from "@stream-io/node-sdk"; // depending on SDK version

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

export const generateToken = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    // Optional: upsert user
    await serverClient.upsertUser({ id: userId, role: "user" });

    // Generate token
    const token = serverClient.createToken(userId); // works in server SDK

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to generate Stream token" });
  }
};
