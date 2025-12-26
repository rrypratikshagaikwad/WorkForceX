import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from "recharts";
import "./AdminDashboard.css";
import { useEffect, useState } from "react";
const AdminDashboard = () => {
const [kpiData, setKpiData] = useState<any>({});
const [attendanceTrend, setAttendanceTrend] = useState([]);
const [todayStatus, setTodayStatus] = useState([]);
const [departmentData, setDepartmentData] = useState([]);

  // const kpiData = {
  //   totalEmployees: 120,
  //   presentToday: 95,
  //   absentToday: 15,
  //   onLeave: 10
  // };

  // const attendanceTrend = [
  //   { day: "Mon", present: 90 },
  //   { day: "Tue", present: 92 },
  //   { day: "Wed", present: 88 },
  //   { day: "Thu", present: 94 },
  //   { day: "Fri", present: 95 },
  // ];

  // const todayStatus = [
  //   { name: "Present", value: 95 },
  //   { name: "Absent", value: 15 },
  //   { name: "On Leave", value: 10 },
  // ];

  // const departmentData = [
  //   { department: "IT", employees: 40 },
  //   { department: "HR", employees: 20 },
  //   { department: "Sales", employees: 35 },
  //   { department: "Production", employees: 25 },
  // ];

  const COLORS = ["#4CAF50", "#F44336", "#FFC107"];
useEffect(() => {
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  fetch("http://localhost:5000/admin/dashboard/kpis", { headers })
    .then(res => res.json())
    .then(setKpiData);

  fetch("http://localhost:5000/admin/dashboard/weekly-attendance", { headers })
    .then(res => res.json())
    .then(setAttendanceTrend);

  fetch("http://localhost:5000/admin/dashboard/today-status", { headers })
    .then(res => res.json())
    .then(setTodayStatus);

  fetch("http://localhost:5000/admin/dashboard/department-wise", { headers })
    .then(res => res.json())
    .then(setDepartmentData);

}, []);

  return (
    <div className="admin-dashboard">

      {/* KPI CARDS */}
      <div className="kpi-cards">
        <div className="kpi-card">
          <h4>Total Employees</h4>
          <p>{kpiData.totalEmployees || 0}</p>
        </div>

        <div className="kpi-card green">
          <h4>Present Today</h4>
          <p>{kpiData.presentToday || 0}</p>
        </div>

        <div className="kpi-card red">
          <h4>Absent</h4>
          <p>{kpiData.absentToday || 0}</p>
        </div>

        <div className="kpi-card yellow">
          <h4>On Leave</h4>
          <p>{kpiData.onLeave || 0}</p>
        </div>
      </div>

      {/* CHART ROW 1 */}
      <div className="charts-row">

        {/* LINE CHART */}
        <div className="chart-card">
          <h3>Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrend}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="present" stroke="#4CAF50" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="chart-card">
          <h3>Today's Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={todayStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {todayStatus.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="chart-card">
        <h3>Department-wise Employees</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentData}>
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="employees" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default AdminDashboard;
