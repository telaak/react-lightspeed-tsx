import React, { useEffect, useRef } from "react";

export const VideoPlayer = ({ mediaStream }: { mediaStream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (mediaStream && videoRef.current) {
      console.log(mediaStream);
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return <video ref={videoRef} playsInline autoPlay controls muted></video>;
};

