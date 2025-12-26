import { useState } from "react";
import "./Leave.css";
import { toast } from "react-toastify";

const ApplyLeave = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const applyLeave = async () => {
    if (!fromDate || !toDate || !reason) {
      toast.error("All fields required");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/attendance/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        start_date: fromDate,
        end_date: toDate,
        reason,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Leave applied successfully");
    setFromDate("");
    setToDate("");
    setReason("");
  };

  return (
    <div className="leave-page">
      <h2>Apply Leave</h2>

      <div className="leave-card">
        <label>From Date</label>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />

        <label>To Date</label>
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />

        <label>Reason</label>
        <textarea
          placeholder="Reason for leave"
          value={reason}
          onChange={e => setReason(e.target.value)}
        />

        <button onClick={applyLeave}>Apply Leave</button>
      </div>
    </div>
  );
};

export default ApplyLeave;
