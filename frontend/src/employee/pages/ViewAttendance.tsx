import { useEffect, useState } from "react";
import "./ViewAttendance.css";
import { toast } from "react-toastify";
import { getMyAttendance } from "../../api/attendanceApi";
interface Attendance {
  date: string;
  check_in: string;
  check_out: string;
  attendance_status: string;
}

const ViewAttendance = () => {
  const [records, setRecords] = useState<Attendance[]>([]);

useEffect(() => {
  // const fetchAttendance = async () => {
  //   const token = localStorage.getItem("token");

  //   const res = await fetch("http://localhost:5000/attendance/employee", {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   const data = await res.json();
  //   setRecords(data);
  // };
 const fetchAttendance = async () => {
    try {
      const res = await getMyAttendance();
      setRecords(res.data);
    } catch (err) {
      toast.error("Failed to load attendance");
    }
  };
  fetchAttendance();
}, []);



  return (
    <div className="attendance-page">
      <h2>My Attendance</h2>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map((row, index) => (
            <tr key={index}>
              <td>{row.date}</td>
              <td>{row.check_in || "-"}</td>
              <td>{row.check_out || "-"}</td>
              <td>{row.attendance_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAttendance;
