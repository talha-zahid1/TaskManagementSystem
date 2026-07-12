import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user_id: number;
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
}

interface AuthContextType {
  userId: number | null;
  username: string | null;
  loading: boolean;
  login: (access: string, refresh: string, username?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const decodeAndSetUserId = (accessToken: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);
      setUserId(decoded.user_id);
    } catch (error) {
      console.error("Failed to decode token:", error);
      setUserId(null);
      localStorage.clear();
    }
  };

  useEffect(() => {
    const initAuth = () => {
      const access = localStorage.getItem("access");
      const savedUsername = localStorage.getItem("username");
      if (access) {
        decodeAndSetUserId(access);
        setUsername(savedUsername);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (access: string, refresh: string, username?: string) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    if (username) {
      localStorage.setItem("username", username);
      setUsername(username);
    }
    decodeAndSetUserId(access);
  };

  const logout = () => {
    localStorage.clear();
    setUserId(null);
    setUsername(null);
  };

  const isAuthenticated = !!userId;

  return (
    <AuthContext.Provider value={{ userId, username, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
