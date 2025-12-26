import { Outlet } from "react-router-dom";
import EmployeeSidebar from "./EmployeeSidebar";
import "./EmployeeLayout.css";

const EmployeeLayout = () => {
  return (
    <div className="employee-layout">
      <EmployeeSidebar />
      <div className="employee-content">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;
