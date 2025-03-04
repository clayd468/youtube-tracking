import { ReactNode, createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import {
  AUTH_LOGIN_URL,
  AUTH_REGISTER_URL,
  REGISTER_SUCCESS,
} from "@/constants";
import { notifySuccess } from "../lib/notify";

interface User {
  username: string;
  password: string;
}

interface AuthContextType {
  user: string | null;
  login: (data: User) => Promise<void>;
  logout: () => void;
  register: (data: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage("user", null);

  const login = async (data: User) => {
    try {
      const response = await fetch(AUTH_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (res.status === 200) {
        setUser(res.data.accessToken);
        navigate("/home");
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
      throw err; // Rethrow error for the caller to handle
    }
  };

  const register = async (data: User) => {
    try {
      const response = await fetch(AUTH_REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (res.status === 200) {
        setUser(res.data.accessToken);
        notifySuccess(REGISTER_SUCCESS);
        navigate("/login");
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
      throw err; // Rethrow error for the caller to handle
    }
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      logout,
      register,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
