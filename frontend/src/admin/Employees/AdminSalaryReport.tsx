import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./AdminSalaryReport.css";
import {
  getAdminSalaryReport,
  downloadAdminPayslip
} from "../../api/adminApi";
interface SalaryRow {
  employee_id: number;
  full_name: string;
  monthly_salary: number;
  present_days: number;
  half_days: number;
  absent_days: number;
  payable_salary: number;
}

const AdminSalaryReport = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [salaries, setSalaries] = useState<SalaryRow[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSalaryReport();
  }, [month, year]);

  // const fetchSalaryReport = async () => {
  //   const res = await fetch(
  //     `http://localhost:5000/admin/salary-report?month=${month}&year=${year}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     }
  //   );

  //   const data = await res.json();
  //   if (!res.ok) return toast.error(data.message);

  //   setSalaries(data);
  // };
const fetchSalaryReport = async () => {
  try {
    const res = await getAdminSalaryReport(month, year);
    setSalaries(res.data);
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to load salary report");
  }
};


//   const downloadPayslip = async (employeeId: number) => {
//   const res = await fetch(
//     `http://localhost:5000/admin/payslip?employeeId=${employeeId}&month=${month}&year=${year}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   if (!res.ok) {
//     const data = await res.json();
//     toast.error(data.message);
//     return;
//   }

//   const blob = await res.blob();
//   const url = window.URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `Payslip-${employeeId}-${month}-${year}.pdf`;
//   document.body.appendChild(a);
//   a.click();

//   a.remove();
//   window.URL.revokeObjectURL(url);
// };

const downloadPayslip = async (employeeId: number) => {
  try {
    const res = await downloadAdminPayslip(employeeId, month, year);

    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Payslip-${employeeId}-${month}-${year}.pdf`;
    a.click();
  } catch (err: any) {
    toast.error("Failed to download payslip");
  }
};


  return (
    <div className="admin-salary-page">
      <h2>Employee Salary Report</h2>

      {/* FILTER */}
      <div className="salary-filter">
        <select value={month} onChange={e => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select value={year} onChange={e => setYear(Number(e.target.value))}>
          {[2024, 2025, 2026].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <table className="salary-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Monthly Salary</th>
            <th>Present</th>
            <th>Half</th>
            <th>Absent</th>
            <th>Payable</th>
            <th>Action</th>
            
          </tr>
        </thead>

        <tbody>
          {salaries.map(emp => (
            <tr key={emp.employee_id}>
              <td>{emp.full_name}</td>
              <td>₹ {emp.monthly_salary}</td>
              <td>{emp.present_days}</td>
              <td>{emp.half_days}</td>
              <td>{emp.absent_days}</td>
              <td className="payable">₹ {emp.payable_salary}</td>
              <td>
                <button
                className="payslip-btn"
                onClick={() => downloadPayslip(emp.employee_id)}
                >
                Payslip
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSalaryReport;
