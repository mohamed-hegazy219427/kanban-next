import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Response interceptor for senior-level error handling/logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error(
      `[API Error] ${error.config.method?.toUpperCase()} ${error.config.url}:`,
      message,
    );
    return Promise.reject(error);
  },
);
