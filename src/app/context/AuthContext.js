"use client";
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Cookies from "js-cookie";
import { authApi } from "@/app/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      if (error?.response?.status === 401) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  const login = async (credentials) => {
    try {
      const { tokens, user: userData } = await authApi.login(credentials);

      if (tokens) {
        Cookies.set("accessToken", tokens.access, { secure: true });
        Cookies.set("refreshToken", tokens.refresh, { secure: true });
      }

      // Parse and store full user object
      const userObj = {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        // Add other relevant user fields
      };

      setUser(userObj);
      setIsAuthenticated(true);
      return { tokens, user: userObj };
    } catch (error) {
      throw error;
    }
  };

  const logout = useCallback(() => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      loading,
      isAuthenticated,
      checkAuth,
    }),
    [user, login, logout, loading, isAuthenticated, checkAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
