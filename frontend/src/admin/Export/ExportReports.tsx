import { useState } from "react";
import "./ExportReports.css";

const ExportReports = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const token = localStorage.getItem("token");

 const download = async (type: "pdf" | "excel") => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/export/attendance/${type}?from=${from}&to=${to}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    alert("Failed to download file");
    return;
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance.${type === "pdf" ? "pdf" : "xlsx"}`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};


  return (
    <div className="export-page">
      <h2>Export Attendance Report</h2>

      <div className="export-card">
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <input type="date" value={to} onChange={e => setTo(e.target.value)} />

        <div className="export-buttons">
          <button className="excel" onClick={() => download("excel")}>
            Export Excel
          </button>
          <button className="pdf" onClick={() => download("pdf")}>
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportReports;
