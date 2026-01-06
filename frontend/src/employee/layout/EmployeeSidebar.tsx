import { NavLink, useNavigate } from "react-router-dom";
import "./EmployeeLayout.css";

const EmployeeSidebar = () => {
  const navigate = useNavigate();
const today = new Date();
const month = today.getMonth() + 1;
const year = today.getFullYear();
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="employee-sidebar">
      <h3 className="logo">Employee</h3>

      <nav>
        <NavLink to="/employee/dashboard">Dashboard</NavLink>
        <NavLink to="/employee/attendance">Attendance</NavLink>
        <NavLink to="/employee/apply">Apply Leave</NavLink>
        <NavLink to="/employee/my-leaves">My Leaves</NavLink>
        <NavLink to={`/employee/salary?month=${month}&year=${year}`}>
  Salary
</NavLink>
<NavLink to="/employee/register-face">Register Face</NavLink>
      </nav>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </aside>
  );
};

export default EmployeeSidebar;
