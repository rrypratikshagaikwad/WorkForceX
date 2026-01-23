import API from "./axiosInstance";

export const loginUser = (data: {
  email: string;
  password: string;
}) => API.post("/auth/login", data);