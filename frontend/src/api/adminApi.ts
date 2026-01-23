import API from "./axiosInstance";

export const addEmployee = (data: any) =>
  API.post("/admin/add-employee", data);

export const getEmployees = (params: any) =>
  API.get("/admin/employees", { params });

export const getEmployeeById = (id: string) =>
  API.get(`/admin/employees/${id}`);

export const updateEmployee = (id: string, data: any) =>
  API.put(`/admin/employees/${id}`, data);

export const deactivateEmployee = (id: number) =>
  API.put(`/admin/employee/${id}/deactivate`);

export const getAdminKPIs = () =>
  API.get("/admin/dashboard/kpis");

export const getWeeklyAttendance = () =>
  API.get("/admin/dashboard/weekly-attendance");

export const getTodayStatusAdmin = () =>
  API.get("/admin/dashboard/today-status");

export const getDepartmentWise = () =>
  API.get("/admin/dashboard/department-wise");

/* Attendance Report */
export const getAttendanceReport = (params: {
  fromDate?: string;
  toDate?: string;
  department?: string;
}) =>
  API.get("/admin/attendance-report", { params });
/* Admin Salary Report */
export const getAdminSalaryReport = (month: number, year: number) =>
  API.get("/admin/salary-report", {
    params: { month, year }
  });

export const downloadAdminPayslip = (
  employeeId: number,
  month: number,
  year: number
) =>
  API.get("/admin/payslip", {
    params: { employeeId, month, year },
    responseType: "blob"
  });
export const getAllLeaves = async () => {
  const res = await API.get("/admin/all");
  return res.data;
};

export const updateLeaveStatus = async (
  leaveId: number,
  status: string
) => {
  const res = await API.put(`/admin/${leaveId}/status`, { status });
  return res.data;
};