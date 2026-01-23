import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // IMPORTANT
});

/* ============================
   REQUEST INTERCEPTOR
   (Auto attach token)
============================ */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ============================
   RESPONSE INTERCEPTOR
   (401 Auto Logout)
============================ */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 detected → logging out");

      localStorage.removeItem("token");
      localStorage.removeItem("user"); // if exists

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
