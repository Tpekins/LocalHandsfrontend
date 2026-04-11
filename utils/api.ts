import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

/*
  Axios instance configured with base URL from Vite env and an
  interceptor that adds the JWT token (stored in localStorage under
  "token") to every request. It also handles generic API errors by
  displaying a toast notification using `sonner`.
*/

const baseURL: string =
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:3000/api";

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // we rely on Bearer token, not cookies
});

// REQUEST INTERCEPTOR – attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR – global error handler
api.interceptors.response.use(
  (response: any) => response,
  (error: AxiosError<any>) => {
    // Show human-friendly error via sonner. You can customise per status.
    if (error.response) {
      const msg = (error.response.data as { message?: string })?.message;
      toast.error(msg || "An unexpected error occurred.");
      // Example: logout on 401 if desired
      if (error.response.status === 401) {
        // Optionally clear token and refresh – left to AuthContext
        localStorage.removeItem("token");
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

export default api;
