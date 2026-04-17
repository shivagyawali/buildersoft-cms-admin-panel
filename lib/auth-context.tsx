"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { authApi } from "./api";
import { User } from "@/types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await authApi.getProfile();
      setUser(res.data.data ?? res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const payload = res.data.data ?? res.data;
    const { accessToken, refreshToken, user: u } = payload;
    Cookies.set("accessToken", accessToken, { expires: 7 });
    if (refreshToken) Cookies.set("refreshToken", refreshToken, { expires: 30 });
    setUser(u);
  };

  const register = async (firstName: string, lastName: string, email: string, password: string, role: string) => {
    const res = await authApi.register({ firstName, lastName, email, password, role });
    const payload = res.data.data ?? res.data;
    const { accessToken, refreshToken, user: u } = payload;
    Cookies.set("accessToken", accessToken, { expires: 7 });
    if (refreshToken) Cookies.set("refreshToken", refreshToken, { expires: 30 });
    setUser(u);
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser(null);
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}