import { useEffect, useState } from "react";
import "./AttendanceReport.css";
import { toast } from "react-toastify";

interface Attendance {
  attendance_id: number;
  date: string;
  check_in: string;
  check_out: string;
  attendance_status: string;
  full_name: string;
  department: string;
}

const AttendanceReport = () => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/admin/attendance-report?fromDate=${fromDate}&toDate=${toDate}&department=${department}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setRecords(data);

    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="attendance-report-page">
      <h2>Attendance Report</h2>

      {/* FILTERS */}
      <div className="filters">
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />

        <select value={department} onChange={e => setDepartment(e.target.value)}>
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Account">Account</option>
          <option value="Civil">Civil</option>
        </select>

        <button className="apply-btn" onClick={fetchReport}>Apply</button>
      </div>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Department</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r) => (
            <tr key={r.attendance_id}>
              <td>{r.date}</td>
              <td>{r.full_name}</td>
              <td>{r.department}</td>
              <td>{r.check_in || "-"}</td>
              <td>{r.check_out || "-"}</td>
              <td className={`status ${r.attendance_status}`}>
                {r.attendance_status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceReport;
