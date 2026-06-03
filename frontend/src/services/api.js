import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Unwrap { success, data } envelope so components can use res.data directly
api.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      response.data.success !== undefined &&
      response.data.data !== undefined
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
