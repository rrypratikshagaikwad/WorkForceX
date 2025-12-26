import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">WorkForceX</h2>

      <nav>
        <NavLink to="/admin/dashboard">Dashboard</NavLink>

        <div className="menu-title">Employees</div>
        <NavLink to="/admin/employees">View Employees</NavLink>
        <NavLink to="/admin/add-employee">Add Employee</NavLink>
        <NavLink to="/admin/salary-report">Salary Report</NavLink>
        <div className="menu-title">Attendance</div>
        <NavLink to="/admin/attendance">Attendance Report</NavLink>

        <div className="menu-title">Leaves</div>
         <NavLink to="/admin/manage-leaves">View Requests</NavLink>
        {/* <NavLink to="/admin/leaves">Leave Requests</NavLink> */}
        <NavLink to="/admin/export">Export Reports</NavLink>
      </nav>

    </div>
  );
};

export default Sidebar;
