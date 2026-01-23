import api from "./axiosInstance";

export const getEmployees = () =>
  api.get("/employees");

export const getEmployeeById = (id: number) =>
  api.get(`/employees/${id}`);

export const addEmployee = (data: any) =>
  api.post("/employees", data);

export const updateEmployee = (id: number, data: any) =>
  api.put(`/employees/${id}`, data);

export const deleteEmployee = (id: number) =>
  api.delete(`/employees/${id}`);
