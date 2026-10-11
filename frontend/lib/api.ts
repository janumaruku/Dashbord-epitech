import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  clearStoredUser,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post<{ token: string; refresh_token: string }>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    { refresh_token: refreshToken },
  );

  setTokens(response.data.token, response.data.refresh_token);
  return response.data.token;
}

function forceLogout() {
  clearTokens();
  clearStoredUser();
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/auth/login";
  }
}

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const url = originalRequest?.url ?? "";

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint))
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      forceLogout();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
