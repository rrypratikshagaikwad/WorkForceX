import API from "./axiosInstance";

export const applyLeave = (data: {
  start_date: string;
  end_date: string;
  reason: string;
}) => API.post("/attendance/apply", data);

export const getMyLeaves = () =>
  API.get("/attendance/my-leaves");

export const getLeaveRequests = () =>
  API.get("/leaves");

export const approveLeave = (id: number) =>
  API.put(`/leaves/${id}/approve`);

export const rejectLeave = (id: number) =>
  API.put(`/leaves/${id}/reject`);