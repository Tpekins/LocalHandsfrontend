/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Role, User } from "../types";
import api from "../utils/api";
import { toast } from "sonner";

interface AuthContextType {
  currentUser: User | null;
  currentRole: Role;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    phoneNumber: string,
    email: string,
    password: string,
    role?: Role
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role>(Role.GUEST);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /* ---------------------------------------------------------------- */
  /* Helpers */
  /* ---------------------------------------------------------------- */
  const saveToken = (token: string) => localStorage.setItem("token", token);
  const clearToken = () => localStorage.removeItem("token");
  const getToken = () => localStorage.getItem("token");

  /* ---------------------------------------------------------------- */
  /* Profile fetch                                                     */
  /* ---------------------------------------------------------------- */
  const refreshProfile = async () => {
    try {
      const { data } = await api.get<User>("/auth/profile");
      setCurrentUser(data);
      setCurrentRole(data.role);
    } catch (err) {
      clearToken();
      setCurrentUser(null);
      setCurrentRole(Role.GUEST);
      console.error('refreshProfile failed, logging out', err);
      // Optionally force reload to clear any stale state
      window.location.reload();
    }
  };

  /* ---------------------------------------------------------------- */
  /* Bootstrap on mount: Rehydrate user session if token exists       */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    // Set token in API (if needed)
    // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    refreshProfile().finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------------- */
  /* Auth actions                                                     */
  /* ---------------------------------------------------------------- */
  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post<{ access_token: string; user: User }>(
        "/auth/login",
        { identifier, password }
      );
      saveToken(data.access_token);
      setCurrentUser(data.user);
      setCurrentRole(data.user.role);
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      return false;
    }
  };

  const register = async (
    name: string,
    phoneNumber: string,
    email: string,
    password: string,
    role?: Role
  ): Promise<{ success: boolean; message: string }> => {
    // Positive adjustment: basic client-side validation
    if (!name || !phoneNumber || !email || !password) {
      return { success: false, message: "Name, phone number, email, and password are required." };
    }
    try {
      await api.post("/auth/register", {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        password: password.trim(),
        ...(role ? { role } : {})
        
      });
      return { success: true, message: "Registration successful! Please log in." };
    } catch (error: any) {
      // Positive adjustment: clearer error handling
      let msg = error.response?.data?.message || "Registration failed.";
      if (Array.isArray(msg)) msg = msg.join(" ");
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    clearToken();
    setCurrentUser(null);
    setCurrentRole(Role.GUEST);
  };

  /* ---------------------------------------------------------------- */
  /* Profile update action                                            */
  /* ---------------------------------------------------------------- */
  const updateUser = async (data: Partial<User>): Promise<boolean> => {
    if (!currentUser) {
      toast.error("No user is logged in.");
      return false;
    }
    try {
      // PATCH /user/:id (or /user/me if available)
      const { data: updated } = await api.patch<User>(`/user/${currentUser.id}`, data);
      setCurrentUser(updated);
      toast.success("Profile updated successfully.");
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update profile.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      return false;
    }
  };

  /* ---------------------------------------------------------------- */
  /* Change password action                                           */
  /* ---------------------------------------------------------------- */
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully!');
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to change password.';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      return false;
    }
  };

  /* ---------------------------------------------------------------- */
  /* Provider value                                                   */
  /* ---------------------------------------------------------------- */
  const value: AuthContextType = {
    currentUser,
    currentRole,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
    updateUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
