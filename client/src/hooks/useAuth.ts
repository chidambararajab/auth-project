/**
 * manages authentication state and provides auth utils
 */
import { useNavigate } from "react-router-dom";

interface UseAuthReturn {
  isLoggedIn: boolean;
  token: string | null;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();

  // Gett token from localStorage
  const token = localStorage.getItem("access_token");
  const isLoggedIn = !!token;

  /**
   * Logout & Removes tokens from localStorage and redirects to login
   */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return {
    isLoggedIn,
    token,
    logout,
  };
};
