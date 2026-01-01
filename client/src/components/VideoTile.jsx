import React, { useEffect, useRef } from "react";

const VideoTile = ({ stream, isLocal, name }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{ margin: "5px", border: "1px solid #ccc", padding: "5px" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        style={{ width: "200px", height: "150px", background: "#000" }}
      />
      <p>{name}</p>
    </div>
  );
};

export default VideoTile;
