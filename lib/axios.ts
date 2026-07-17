import axios, { AxiosInstance, AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const session = await getSession();
        if (session?.user?.refreshToken) {
          const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken: session.user.refreshToken,
          });

          const tokenPayload = (response.data as any)?.data ?? response.data;
          const newAccessToken = tokenPayload?.accessToken;
          const newRefreshToken = tokenPayload?.refreshToken;

          if (newAccessToken) {
            // Update session with new token(s)
            session.user.accessToken = newAccessToken;
            if (newRefreshToken) {
              session.user.refreshToken = newRefreshToken;
            }

            // Retry original request with new token
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Token refresh failed, logout user
        await signOut({ redirect: true, callbackUrl: "/auth/login" });
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.error("Forbidden: You do not have permission to access this resource");
    }

    if (error.response?.status === 500) {
      console.error("Server error: Something went wrong on the server");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
