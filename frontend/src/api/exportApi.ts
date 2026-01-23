import API from "./axiosInstance";

export const downloadAttendance = (
  type: "pdf" | "excel",
  from: string,
  to: string
) =>
  API.get(`/export/attendance/${type}`, {
    params: { from, to },
    responseType: "blob"
  });
