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
