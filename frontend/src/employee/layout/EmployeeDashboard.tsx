import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    fetchTodayStatus();
    fetchMonthlySummary();
    fetchSalarySummary();
  }, [month, year]);

  /* -------------------- API CALLS -------------------- */

  const fetchTodayStatus = async () => {
    const res = await fetch("http://localhost:5000/attendance/today", {
      headers: getAuthHeader()
    });
    const data = await res.json();
    setAttendanceStatus(data.status);
  };

  const fetchMonthlySummary = async () => {
    const res = await fetch(
      "http://localhost:5000/attendance/monthly-summary",
      { headers: getAuthHeader() }
    );
    const data = await res.json();
    setChartData(data);
  };

  const fetchSalarySummary = async () => {
    const res = await fetch(
      `http://localhost:5000/attendance/salary/my-summary?month=${month}&year=${year}`,
      { headers: getAuthHeader() }
    );

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message);
      return;
    }
    setSalary(data);
  };

  /* -------------------- ACTIONS -------------------- */

  const handleCheckIn = async () => {
    const res = await fetch("http://localhost:5000/attendance/checkin", {
      method: "POST",
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message);
    toast.success("Checked in");
    setAttendanceStatus("CHECKED_IN");
  };

  const handleCheckOut = async () => {
    const res = await fetch("http://localhost:5000/attendance/checkout", {
      method: "POST",
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message);
    toast.success("Checked out");
    setAttendanceStatus("CHECKED_OUT");
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="emp-dashboard">
      <h2>Employee Dashboard</h2>

      {/* TODAY ATTENDANCE */}
      <div className="today-card">
        <h3>Today's Attendance</h3>

        {attendanceStatus === "NOT_CHECKED_IN" && (
          <button onClick={handleCheckIn}>Check In</button>
        )}

        {attendanceStatus === "CHECKED_IN" && (
          <button onClick={handleCheckOut}>Check Out</button>
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
