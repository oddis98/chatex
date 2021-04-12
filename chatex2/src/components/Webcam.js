import React, { useRef } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: "100%",
  height: "100%",
  facingMode: "user",
};

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  return (
    <>
      <Webcam
        audio={false}
        height={"50%"}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={"100%"}
        videoConstraints={videoConstraints}
      />
    </>
  );
};

export default WebcamCapture;
