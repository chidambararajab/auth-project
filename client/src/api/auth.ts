import axiosInstance from "./axios";

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
 * Login user and get token from backed
 */
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/login/", data);
  return response.data;
};
