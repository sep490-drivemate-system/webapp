import axios, { AxiosError } from "axios";
import {
  getAccessToken,
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
// Note: These variables are reserved for future token refresh implementation
// const isRefreshing = false;
// const refreshPromise: Promise<string> | null = null;





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
    const originalConfig = error.config as { _retry?: boolean } | undefined;

    if (status === 401 && typeof window !== "undefined") {
      if (!originalConfig?._retry) {
        if (originalConfig) {
          originalConfig._retry = true;
        }
        try {
          await getAccessToken();
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
