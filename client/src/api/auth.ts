/**
 * Authentication API layer
 * All auth-related API calls using axios instance
 */
import axiosInstance from "./axios";

// Type definitions for API requests and responses
export interface RegisterData {
  username: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterResponse {
  message: string;
}

/**
 * Register a new user
 * @param data - User registration data (username, password)
 * @returns Promise with success message
 */
export const registerUser = async (
  data: RegisterData
): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>(
    "/register/",
    data
  );
  return response.data;
};

/**
 * Login user and get JWT tokens
 * @param data - User login credentials (username, password)
 * @returns Promise with access and refresh tokens
 */
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/login/", data);
  return response.data;
};
