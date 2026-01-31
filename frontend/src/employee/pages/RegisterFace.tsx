import { useState } from "react";
import CameraCapture from "../../components/CameraCapture";
import { toast } from "react-toastify";
import "./RegisterFace.css";
import { registerFace as registerFaceApi } from "../../api/attendanceApi";
const RegisterFace = () => {
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // const token = localStorage.getItem("token");

  const handleFaceCapture = (image: string) => {
    setFaceImage(image);
    toast.success("Face captured successfully");
  };

  // const registerFace = async () => {
  //   if (!faceImage) {
  //     toast.error("Please capture face first");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const res = await fetch(
  //       "http://localhost:5000/attendance/register-face",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`
  //         },
  //         body: JSON.stringify({ faceImage })
  //       }
  //     );

  //     const data = await res.json();
  //     if (!res.ok) return toast.error(data.message);

  //     toast.success("Face registered successfully");
  //   } catch (err) {
  //     toast.error("Face registration failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleRegisterFace = async () => {
  if (!faceImage) {
    toast.error("Please capture face first");
    return;
  }

  try {
    setLoading(true);
    await registerFaceApi(faceImage);
    toast.success("Face registered successfully");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Face registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="register-face-page">
      <h2>Face Registration</h2>

      <p className="info">
        This is a one-time process. Your face will be used for attendance
        verification.
      </p>

      {/* Camera */}
      <CameraCapture onCapture={handleFaceCapture} />

      {/* Preview */}
      {faceImage && (
        <div className="preview">
          <img src={faceImage} alt="Face Preview" />
        </div>
      )}

      {/* Register Button */}
      <button
  className="register-btn"
  disabled={!faceImage || loading}
  onClick={handleRegisterFace}
>
        {loading ? "Registering..." : "Register Face"}
      </button>
    </div>
  );
};

export default RegisterFace;
