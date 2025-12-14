import axios, { AxiosError } from "axios";
import {
  getAccessToken,
  handleTokenStorage,
  clearTokens,
} from "@/lib/jwt/jwt.utils";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: "application/json, text/plain, */*",
  },
});

// ----- Refresh token flow -----
let isRefreshing = false as boolean;
let refreshPromise: Promise<string> | null = null;





// Attach/refresh access token for each request (client-only)
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") return config;
    try {
      const finalToken = getAccessToken();
      if (finalToken) {
        (config.headers =
          config.headers ?? {}).Authorization = `Bearer ${finalToken}`;
      }
    } catch {
    }

    const method = (config.method || "").toLowerCase();
    const hasBody = ["post", "put", "patch"].includes(method);
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;
    const headers = (config.headers = config.headers ?? {});

    if (isFormData) {
      delete headers["Content-Type"];
    } else if (hasBody && config.data != null && !("Content-Type" in headers)) {
      headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);



axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalConfig: any = error.config || {};

    if (status === 401 && typeof window !== "undefined") {
      if (!originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const newAccess = await getAccessToken();
        } catch {
        }
      }

      clearTokens();
      window.location.href = "/signin";
      return Promise.reject(error);
    }

    if (status === 403 && typeof window !== "undefined") {
      window.location.href = "/forbidden";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
