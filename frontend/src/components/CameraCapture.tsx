import { useRef } from "react";
import Webcam from "react-webcam";
import "./VerificationCard.css";

interface Props {
  onCapture: (image: string) => void;
}

const CameraCapture = ({ onCapture }: Props) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) onCapture(imageSrc);
  };

  return (
    <>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
        style={{
          width: "100%",
          borderRadius: "10px"
        }}
      />
      <button onClick={capture} style={{ marginTop: "8px" }}>
        Capture Face
      </button>
    </>
  );
};

export default CameraCapture;
