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

  async function login(arg1, arg2, options) {
    const session = await authService.login(arg1, arg2, options);
    if (!session?.twoFactorRequired) setUser(authService.getSession());
    return session;
  }

  async function register(arg1, arg2, arg3, options) {
    const session = await authService.register(arg1, arg2, arg3, options);
    setUser(session);
    return session;
  }

  async function oauthLogin(provider, code, redirectUri) {
    const session = await authService.oauthLogin(provider, code, redirectUri);
    if (!session?.twoFactorRequired) setUser(authService.getSession());
    return session;
  }

  async function verifyLoginOtp(challengeToken, code) {
    const session = await authService.verifyLoginOtp(challengeToken, code);
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
    setUser(null);
    return authService.logout();
  }

  const value = {
    user,
    loading,
    login,
    register,
    oauthLogin,
    verifyLoginOtp,
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
