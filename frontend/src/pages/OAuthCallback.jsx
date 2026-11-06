import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { redirectUriFor } from "../services/oauth.js";

export default function OAuthCallback() {
  const { provider } = useParams();
  const [params] = useSearchParams();
  const { oauthLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const ran = useRef(false); // StrictMode runs effects twice; a code can be used only once

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = params.get("code");
    const state = params.get("state");
    const saved = sessionStorage.getItem("oauth_state");
    sessionStorage.removeItem("oauth_state");

    if (params.get("error")) return setError("Sign-in was cancelled.");
    if (!code || !state || state !== saved) return setError("Invalid sign-in request. Please try again.");

    oauthLogin(provider, code, redirectUriFor(provider))
      .then(() => navigate("/dashboard", { replace: true }))
      .catch((e) => setError(e.message));
  }, []); // eslint-disable-line

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14, color: "#cbd5e1" }}>
      {error ? (
        <>
          <p>{error}</p>
          <button onClick={() => navigate("/login", { replace: true })} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#0ea5e9", color: "#fff", cursor: "pointer" }}>
            Back to login
          </button>
        </>
      ) : (
        <p>Signing you in…</p>
      )}
    </div>
  );
}
