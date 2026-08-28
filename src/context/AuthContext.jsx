import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = authService.getSession();
    setUser(existing);
    setLoading(false);
  }, []);

  async function login(arg1, arg2) {
    const session = await authService.login(arg1, arg2);
    setUser(session);
    return session;
  }

  async function register(arg1, arg2, arg3) {
    const session = await authService.register(arg1, arg2, arg3);
    setUser(session);
    return session;
  }

  async function updateProfile(profileData) {
    if (!user) throw new Error("No active user session.");
    const updated = await authService.updateUserProfile(user.id, profileData);
    setUser(updated);
    return updated;
  }

  async function requestOtp(email) {
    return await authService.requestPasswordResetOtp(email || user?.email);
  }

  async function resetPassword(email, otp, newPassword) {
    return await authService.resetPasswordWithOtp(email || user?.email, otp, newPassword);
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    requestOtp,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an <AuthProvider>");
  return ctx;
}

