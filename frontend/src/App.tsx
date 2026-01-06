// import { Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import EmployeeDashboard from "./pages/EmployeeDashboard";
// import ViewAttendance from "./pages/ViewAttendance";
// // Admin
// import AdminLayout from "./admin/Layout/AdminLayout";
// import AdminDashboard from "./admin/AdminDashboard";
// // import ViewEmployees from "./admin/Employees/ViewEmployees";
// import AddEmployee  from "./admin/Employees/AddEmployee";
// // import AttendanceReport from "./admin/Attendance/AttendanceReport";
// // import LeaveRequests from "./admin/Leaves/LeaveRequests";
// // import ExportReports from "./admin/Export/ExportReports";


// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<LoginPage />} />
//       {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
//       <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
//       <Route path="/employee/attendance" element={<ViewAttendance />} />
      
//      <Route path="/admin" element={<AdminLayout />}>
//     <Route path="dashboard" element={<AdminDashboard />} />
//     {/* <Route path="employees" element={<ViewEmployees />} /> */}
//     <Route path="add-employee" element={<AddEmployee />} />
//     {/* <Route path="attendance" element={<AttendanceReport />} /> */}
//     {/* <Route path="leaves" element={<LeaveRequests />} /> */}
//     {/* <Route path="export" element={<ExportReports />} /> */}
// </Route>

// </Routes>

    
    
//   );
// }

// export default App;
import { Routes, Route } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import EmployeeDashboard from "./employee/layout/EmployeeDashboard";
import EmployeeLayout from "./employee/layout/EmployeeLayout";
import ViewAttendance from "./employee/pages/ViewAttendance";
import MyLeaves from "./employee/pages/MyLeaves";
import ApplyLeave from "./employee/pages/ApplyLeave";
import EmployeeSalary from "./employee/pages/EmployeeSalary";
import RegisterFace from "./employee/pages/RegisterFace";

// Admin
import AdminLayout from "./admin/Layout/AdminLayout";
import AdminDashboard from "./admin/Layout/AdminDashboard";
import AddEmployee from "./admin/Employees/AddEmployee";
import ViewEmployees from "./admin/Employees/ViewEmployees";
import EditEmployee from "./admin/Employees/EditEmployee";
import AttendanceReport from "./admin/Attendance/AttendanceReport";
import ExportReports from "./admin/Export/ExportReports";
import ManageLeaves from "./admin/Leaves/ManageLeaves";
import AdminSalaryReport from "./admin/Employees/AdminSalaryReport";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTE */}
      <Route path="/" element={<LoginPage />} />

     
      {/* <Route path="/employee/dashboard" element={<EmployeeDashboard />} /> */}
      {/* <Route path="/employee/attendance" element={<ViewAttendance />} /> */}

      {/* ADMIN ROUTES (WITH LAYOUT) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="add-employee" element={<AddEmployee />} />
        <Route path="employees" element={<ViewEmployees />} />
        <Route path="employees/:id/edit" element={<EditEmployee />} />
        <Route path="attendance" element={<AttendanceReport />} />
        <Route path="export" element={<ExportReports />} />
        <Route path="manage-leaves" element={<ManageLeaves />} />
        <Route path="salary-report" element={<AdminSalaryReport/>} />
      </Route>
       {/* EMPLOYEE ROUTES */}
    <Route path="/employee" element={<EmployeeLayout />}>
    <Route path="dashboard" element={<EmployeeDashboard />} />
    <Route path="attendance" element={<ViewAttendance />} />
    <Route path="my-leaves" element={<MyLeaves/>} />
    <Route path="apply" element={<ApplyLeave/>} />
    <Route path="salary" element={<EmployeeSalary />} />
    <Route path="register-face" element={<RegisterFace />} />
</Route>

    </Routes>
  );
}

export default App;
