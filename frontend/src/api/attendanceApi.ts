import API from "./axiosInstance";

export const getTodayStatus = () =>
  API.get("/attendance/today");

// * CHECK-IN */
export const checkIn = (data: {
  faceImage: string;
  latitude: number;
  longitude: number;
}) =>
  API.post("/attendance/checkin", data);

/* CHECK-OUT */
export const checkOut = (data: {
  faceImage: string;
  latitude: number;
  longitude: number;
}) =>
  API.post("/attendance/checkout", data);

export const getMonthlySummary = () =>
  API.get("/attendance/monthly-summary");

export const getSalarySummary = (month: number, year: number) =>
  API.get(`/attendance/salary/my-summary?month=${month}&year=${year}`);

export const applyLeave = (data: any) =>
  API.post("/attendance/apply", data);

export const getMyLeaves = () =>
  API.get("/attendance/my-leaves");

export const registerFace = (faceImage: string) => {
  return API.post("/attendance/register-face", {
    faceImage: faceImage
  });
};


export const downloadPayslip = (month: string, year: string) =>
  API.get(
    `/attendance/salary/payslip?month=${month}&year=${year}`,
    {
      responseType: "blob" // 🔥 MOST IMPORTANT
    }
  );
export const getMyAttendance = () =>
  API.get("/attendance/employee");
