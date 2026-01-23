import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from "recharts";
import "./AdminDashboard.css";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  getAdminKPIs,
  getWeeklyAttendance,
  getTodayStatusAdmin,
  getDepartmentWise
} from "../../api/adminApi";
const AdminDashboard = () => {
const [kpiData, setKpiData] = useState<any>({});
const [attendanceTrend, setAttendanceTrend] = useState([]);
const [todayStatus, setTodayStatus] = useState([]);
const [departmentData, setDepartmentData] = useState([]);
const COLORS = ["#4CAF50", "#F44336", "#FFC107"];
useEffect(() => {
  fetchDashboardData();
}, []);
const fetchDashboardData = async () => {
    try {
      const [
        kpiRes,
        weeklyRes,
        todayRes,
        deptRes
      ] = await Promise.all([
        getAdminKPIs(),
        getWeeklyAttendance(),
        getTodayStatusAdmin(),
        getDepartmentWise()
      ]);

      setKpiData(kpiRes.data);
      setAttendanceTrend(weeklyRes.data);
      setTodayStatus(todayRes.data);
      setDepartmentData(deptRes.data);
    } catch (err: any) {
      toast.error("Failed to load dashboard data");
    }
  };

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
