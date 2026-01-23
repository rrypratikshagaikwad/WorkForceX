import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CameraCapture from "../../components/CameraCapture";
import LocationCapture from "../../components/LocationCapture";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { toast } from "react-toastify";
import "./EmployeeDashboard.css";
import {
  getTodayStatus,
  getMonthlySummary,
  getSalarySummary,
  checkIn,
  checkOut
} from "../../api/attendanceApi";

type AttendanceStatus = "NOT_CHECKED_IN" | "CHECKED_IN" | "CHECKED_OUT";

interface ChartData {
  date: string;
  present: number;
}

interface SalarySummary {
  month: string;
  monthly_salary: number;
  present_days: number;
  half_days: number;
  absent_days: number;
  payable_salary: number;
}

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const [attendanceStatus, setAttendanceStatus] =
    useState<AttendanceStatus>("NOT_CHECKED_IN");

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [salary, setSalary] = useState<SalarySummary | null>(null);

  // 🔹 Month & Year state
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

//camera
const [startVerification, setStartVerification] = useState(false);
const [faceImage, setFaceImage] = useState<string | null>(null);
//location
const [location, setLocation] = useState<{
  lat: number;
  lng: number;
} | null>(null);

  // const getAuthHeader = () => {
  //   const token = localStorage.getItem("token");
  //   return { Authorization: `Bearer ${token}` };
  // };

  useEffect(() => {
    fetchTodayStatus();
    fetchMonthlySummary();
    fetchSalarySummary();
  }, [month, year]);

  /* -------------------- API CALLS -------------------- */

  // const fetchTodayStatus = async () => {
  //   const res = await fetch("http://localhost:5000/attendance/today", {
  //     headers: getAuthHeader()
  //   });
  //   const data = await res.json();
  //   setAttendanceStatus(data.status);
  // };
  const fetchTodayStatus = async () => {
  const { data } = await getTodayStatus();
  setAttendanceStatus(data.status);
};

  // const fetchMonthlySummary = async () => {
  //   const res = await fetch(
  //     "http://localhost:5000/attendance/monthly-summary",
  //     { headers: getAuthHeader() }
  //   );
  //   const data = await res.json();
  //   setChartData(data);
  // };
const fetchMonthlySummary = async () => {
  try {
    const { data } = await getMonthlySummary();
    setChartData(data);
  } catch (err) {
    toast.error("Failed to load monthly summary");
  }
};
  // const fetchSalarySummary = async () => {
  //   const res = await fetch(
  //     `http://localhost:5000/attendance/salary/my-summary?month=${month}&year=${year}`,
  //     { headers: getAuthHeader() }
  //   );

  //   const data = await res.json();
  //   if (!res.ok) {
  //     toast.error(data.message);
  //     return;
  //   }
  //   setSalary(data);
  // };
const fetchSalarySummary = async () => {
  try {
    const { data } = await getSalarySummary(month, year);
    setSalary(data);
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Salary load failed");
  }
};
  /* -------------------- ACTIONS -------------------- */

  // const handleCheckIn = async () => {
  //   const res = await fetch("http://localhost:5000/attendance/checkin", {
  //     method: "POST",
  //     headers: getAuthHeader()
  //   });
  //   const data = await res.json();
  //   if (!res.ok) return toast.error(data.message);
  //   toast.success("Checked in");
  //   setAttendanceStatus("CHECKED_IN");
  // };
// const handleCheckIn = async () => {
//   if (!faceImage || !location) {
//     toast.error("Face & Location required");
//     return;
//   }

//   const res = await fetch("http://localhost:5000/attendance/checkin", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...getAuthHeader()
//     },
//     body: JSON.stringify({
//       faceImage,
//       latitude: location.lat,
//       longitude: location.lng
//     })
    
//   });

//   const data = await res.json();
//   if (!res.ok) return toast.error(data.message);

//   toast.success("Checked in successfully");
//   setAttendanceStatus("CHECKED_IN");

// // RESET
//   setStartVerification(false);
//   setFaceImage(null);
//   setLocation(null);
  
// };


const handleCheckIn = async () => {
  if (!faceImage || !location) {
    toast.error("Face & Location required");
    return;
  }
  try{
  await checkIn({
    faceImage,
    latitude: location.lat,
    longitude: location.lng
  });
  toast.success("Checked in successfully");
  setAttendanceStatus("CHECKED_IN");

    // RESET
    setFaceImage(null);
    setLocation(null);
    setStartVerification(false);
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Checkin failed");
  }
};

  // const handleCheckOut = async () => {
  //   const res = await fetch("http://localhost:5000/attendance/checkout", {
  //     method: "POST",
  //     headers: getAuthHeader()
  //   });
  //   const data = await res.json();
  //   if (!res.ok) return toast.error(data.message);
  //   toast.success("Checked out");
  //   setAttendanceStatus("CHECKED_OUT");
  // };
// const handleCheckOut = async () => {
//   if (!faceImage || !location) {
//     toast.error("Face & Location required");
//     return;
//   }

//   const res = await fetch("http://localhost:5000/attendance/checkout", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...getAuthHeader()
//     },
//     body: JSON.stringify({
//       faceImage,
//       latitude: location.lat,
//       longitude: location.lng
//     })
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     toast.error(data.message);
//     return;
//   }

//   toast.success("Checked out successfully");
//   setAttendanceStatus("CHECKED_OUT");

//   // RESET
//   setFaceImage(null);
//   setLocation(null);
//   setStartVerification(false);
// };
const handleCheckOut = async () => {
  if (!faceImage || !location) {
    toast.error("Face & Location required");
    return;
  }

  try {
    await checkOut({
      faceImage,
      latitude: location.lat,
      longitude: location.lng
    });

    toast.success("Checked out successfully");
    setAttendanceStatus("CHECKED_OUT");

    // RESET
    setFaceImage(null);
    setLocation(null);
    setStartVerification(false);
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Checkout failed");
  }
};

  const handleFaceCapture = (image: string) => {
  setFaceImage(image);
  toast.success("Face captured successfully");
};

const handleLocationCapture = (lat: number, lng: number) => {
  setLocation({ lat, lng });
};


  /* -------------------- UI -------------------- */

  return (
    <div className="emp-dashboard">
      <h2>Employee Dashboard</h2>

      {/* TODAY ATTENDANCE */}
      <div className="today-card">
        <h3>Today's Attendance</h3>

        {/* {attendanceStatus === "NOT_CHECKED_IN" && (
          <button onClick={handleCheckIn}>Check In</button>
        )} */}
        

    {/* {attendanceStatus === "NOT_CHECKED_IN" && (
      <>
      <CameraCapture onCapture={handleFaceCapture} />
        <LocationCapture onLocation={handleLocationCapture} />
  
    {faceImage && location && (
      <p style={{ color: "green" }}>✔ Face & location captured successfully</p>
    )}

    <button
      onClick={handleCheckIn}
      disabled={!faceImage}
    >
      Check In
    </button>
  </>
)} */}

{attendanceStatus === "NOT_CHECKED_IN" && (
  <>
    {!startVerification && (
      <button
        className="checkin-btn"
        onClick={() => setStartVerification(true)}
      >
        Check In
      </button>
    )}

    {startVerification && (
      <div className="verification-card">
        <h4 className="verification-title">Employee Verification</h4>

        {/* FACE */}
        <div className="verification-step">
          <div className="step-header">
            <span>Face Verification</span>
            <span className={faceImage ? "status-success" : "status-pending"}>
              {faceImage ? "Verified" : "Pending"}
            </span>
          </div>

          {!faceImage && (
            <CameraCapture onCapture={handleFaceCapture} />
          )}
        </div>

        {/* LOCATION */}
        <div className="verification-step">
          <div className="step-header">
            <span>Location Verification</span>
            <span className={location ? "status-success" : "status-pending"}>
              {location ? "Verified" : "Pending"}
            </span>
          </div>

          {!location && (
            <LocationCapture onLocation={handleLocationCapture} />
          )}
        </div>

        <button
          className="confirm-btn"
          disabled={!faceImage || !location}
          onClick={handleCheckIn}
        >
          Confirm Check-In
        </button>
      </div>
    )}
  </>
)}

        {faceImage && (
          <img
            src={faceImage}
            alt="Captured Face"
            width={150}
            style={{ marginTop: "10px", borderRadius: "10px" }}
          />
        )}
        {/* {attendanceStatus === "CHECKED_IN" && (
          <button onClick={handleCheckOut}>Check Out</button>
        )} */}
{attendanceStatus === "CHECKED_IN" && (
  <>
    {!startVerification && (
      <button
        className="checkout-btn"
        onClick={() => setStartVerification(true)}
      >
        Check Out
      </button>
    )}

    {startVerification && (
      <div className="verification-card">
        <h4 className="verification-title">Checkout Verification</h4>

        {/* FACE */}
        <div className="verification-step">
          <div className="step-header">
            <span>Face Verification</span>
            <span className={faceImage ? "status-success" : "status-pending"}>
              {faceImage ? "Verified" : "Pending"}
            </span>
          </div>

          {!faceImage && (
            <CameraCapture onCapture={handleFaceCapture} />
          )}
        </div>

        {/* LOCATION */}
        <div className="verification-step">
          <div className="step-header">
            <span>Location Verification</span>
            <span className={location ? "status-success" : "status-pending"}>
              {location ? "Verified" : "Pending"}
            </span>
          </div>

          {!location && (
            <LocationCapture onLocation={handleLocationCapture} />
          )}
        </div>

        <button
          className="confirm-btn"
          disabled={!faceImage || !location}
          onClick={handleCheckOut}
        >
          Confirm Check-Out
        </button>
      </div>
    )}
  </>
)}

        {attendanceStatus === "CHECKED_OUT" && (
          <p className="done">✔ Attendance Completed</p>
        )}
      </div>

      {/* MONTHLY ATTENDANCE CHART */}
      <div className="chart-card">
        <h3>Monthly Attendance Summary</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="present"
              stroke="#4CAF50"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

  
     {/*SALARY SUMMARY */}
      <div className="salary-card">
      <div className="salary-header">
        <h3>Salary Summary</h3>

        <div className="salary-filter">
          <select value={month} onChange={e => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select value={year} onChange={e => setYear(Number(e.target.value))}>
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {salary && (
        <>
          <div className="salary-grid">
            <div><span>Monthly Salary</span><strong>₹ {salary.monthly_salary}</strong></div>
            <div><span>Present Days</span><strong>{salary.present_days}</strong></div>
            <div><span>Half Days</span><strong>{salary.half_days}</strong></div>
            <div><span>Absent Days</span><strong>{salary.absent_days}</strong></div>

            <div className="payable">
              <span>Payable Salary</span>
              <strong>₹ {salary.payable_salary}</strong>
            </div>
          </div>

        {/*VIEW DETAILS BUTTON */}
      <button
        className="view-salary-btn"
        onClick={() =>
          navigate(`/employee/salary?month=${month}&year=${year}`)
        }
      >
        View Details →
      </button>
    </>
      )}
    </div>
    </div>
  );
};

export default EmployeeDashboard;
