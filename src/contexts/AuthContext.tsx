/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UserRole, User } from "../types";
import api from "../utils/api";
import { toast } from "sonner";

/*
 * AuthContext – central authentication state for the entire application.
 *
 * CONNECTION MAP (Frontend ↔ Backend ↔ Database):
 *
 *   login()     → api.post("/auth/login")               → POST /api/auth/login
 *     Backend: auth.controller.ts => auth.service.ts => bcrypt.compare()
 *     DB:      queries User table by email/phone, returns user + JWT
 *
 *   register()  → api.post("/auth/register")            → POST /api/auth/register
 *     Backend: auth.controller.ts => user.service.ts => bcrypt.hash()
 *     DB:      INSERT into User + Profile tables
 *
 *   refreshProfile() → api.get("/auth/profile")         → GET /api/auth/profile
 *     Backend: auth.controller.ts => JwtAuthGuard => user.service.findOne(id)
 *     DB:      SELECT from User with include: { profile }
 *
 *   changePassword() → api.post("/auth/change-password")→ POST /api/auth/change-password
 *     Backend: auth.controller.ts => JwtAuthGuard => auth.service.changePassword()
 *     DB:      UPDATE User SET passwordHash = ...
 *
 *   updateUser() → api.patch(`/user/${id}`)            → PATCH /api/user/:id
 *     Backend: user.controller.ts => JwtAuthGuard => user.service.update()
 *     DB:      UPDATE User SET name/email/phone/role
 *
 * Token storage: localStorage key "token"
 * Axios interceptor (src/utils/api.ts): auto-attaches Bearer token on every request
 */

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; role?: UserRole }>;
  register: (
    name: string,
    phoneNumber: string,
    email: string,
    password: string,
    role?: UserRole
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
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
      setCurrentRole(null);
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
  const login = async (identifier: string, password: string): Promise<{ success: boolean; role?: UserRole }> => {
    try {
      const { data } = await api.post<{ access_token: string; user: User }>(
        "/auth/login",
        { identifier, password }
      );
      saveToken(data.access_token);
      setCurrentUser(data.user);
      setCurrentRole(data.user.role);
      return { success: true, role: data.user.role };
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      return { success: false };
    }
  };

  const register = async (
    name: string,
    phoneNumber: string,
    email: string,
    password: string,
    role?: UserRole
  ): Promise<{ success: boolean; message: string }> => {
    if (!name || !phoneNumber || !email || !password) {
      return { success: false, message: "Name, phone number, email, and password are required." };
    }
    try {
      const cleanPhone = phoneNumber.replace(/\s+/g, '');
      await api.post("/auth/register", {
        name: name.trim(),
        phoneNumber: cleanPhone,
        email: email.trim(),
        password: password.trim(),
        ...(role ? { role } : {})

      });
      return { success: true, message: "Registration successful! Please log in." };
    } catch (error: any) {
      const data = error.response?.data;
      let msg = data?.message || "Registration failed.";
      if (Array.isArray(msg)) msg = msg.join(" ");
      if (data?.errors) {
        const fields = data.errors.map((e: any) => `${e.field}: ${Object.values(e.constraints || {}).join(', ')}`).join('; ');
        msg = msg + ' — ' + fields;
      }
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    clearToken();
    setCurrentUser(null);
    setCurrentRole(null);
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
      const allowedFields: Partial<Pick<User, 'name' | 'email' | 'phoneNumber' | 'role'>> = {};
      if (data.name !== undefined) allowedFields.name = data.name;
      if (data.email !== undefined) allowedFields.email = data.email;
      if (data.phoneNumber !== undefined) allowedFields.phoneNumber = data.phoneNumber;
      if (data.role !== undefined) allowedFields.role = data.role;

      const { data: updated } = await api.patch<User>(`/user/${currentUser.id}`, allowedFields);
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
