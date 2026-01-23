import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./EmployeeSalary.css";
import {
  getSalarySummary,
  downloadPayslip
} from "../../api/attendanceApi";

interface SalaryDetails {
  month: string;
  employee_id: number;
  monthly_salary: number;
  present_days: number;
  half_days: number;
  absent_days: number;
  payable_salary: number;
}

const EmployeeSalary = () => {
  const [salary, setSalary] = useState<SalaryDetails | null>(null);
  const [params] = useSearchParams();

  const month = params.get("month");
  const year = params.get("year");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSalary();
  }, [month, year]);

  // const fetchSalary = async () => {
  //   if (!month || !year) return;

  //   const res = await fetch(
  //     `http://localhost:5000/attendance/salary/my-summary?month=${month}&year=${year}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     }
  //   );

  //   const data = await res.json();
  //   if (!res.ok) return toast.error(data.message);

  //   setSalary(data);
  // };

const fetchSalary = async () => {
  if (!month || !year) return;

  try {
    const { data } = await getSalarySummary(+month, +year);
    setSalary(data);
  } catch (err: any) {
    toast.error(err.response?.data?.message);
  }
};

//   const downloadPayslip = async () => {
//   const token = localStorage.getItem("token");

//   const res = await fetch(
//     `http://localhost:5000/attendance/salary/payslip?month=${month}&year=${year}`,
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
//   a.download = `Payslip-${month}-${year}.pdf`;
//   document.body.appendChild(a);
//   a.click();

//   a.remove();
//   window.URL.revokeObjectURL(url);
// };

const downloadPDF = async () => {
  if (!month || !year) return;

  try {
    const res = await downloadPayslip(month, year);

    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Payslip-${month}-${year}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to download payslip");
  }
};
  return (
    <div className="salary-page">
      <h2>Salary Details</h2>

      {salary && (
        <div className="salary-detail-card">
          <h3>Month: {salary.month}</h3>

          <div className="salary-info">
            <p><b>Employee ID:</b> {salary.employee_id}</p>
            <p><b>Monthly Salary:</b> ₹ {salary.monthly_salary}</p>
            <p><b>Present Days:</b> {salary.present_days}</p>
            <p><b>Half Days:</b> {salary.half_days}</p>
            <p><b>Absent Days:</b> {salary.absent_days}</p>
          </div>

          <div className="salary-total">
            Payable Salary: ₹ {salary.payable_salary}
          </div>
          <button
          className="download-btn"
          onClick={downloadPDF}
        >
          Download Payslip PDF
        </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalary;
