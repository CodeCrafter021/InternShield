import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { redirectUriFor } from "../services/oauth.js";
import { waitForBackend } from "../services/api.js";

export default function OAuthCallback() {
  const { provider } = useParams();
  const [params] = useSearchParams();
  const { oauthLogin, verifyLoginOtp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [slow, setSlow] = useState(false);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [challengeToken, setChallengeToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const ran = useRef(false); // StrictMode runs effects twice; a code can be used only once

  useEffect(() => {
    if (!slow) return undefined;
    const timer = setInterval(() => setWaitSeconds((seconds) => seconds + 1), 1000);
    return () => clearInterval(timer);
  }, [slow]);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = params.get("code");
    const state = params.get("state");
    const saved = sessionStorage.getItem("oauth_state");
    sessionStorage.removeItem("oauth_state");

    if (params.get("error")) return setError("Sign-in was cancelled.");
    if (!code || !state || state !== saved) return setError("Invalid sign-in request. Please try again.");

    (async () => {
      // 1) wait until the (free, sleeping) server is really awake
      const up = await waitForBackend({ onWaiting: () => setSlow(true) });
      if (!up) {
        setError("The server did not start in time. Please go back and try again in a minute.");
        return;
      }
      // 2) only now send the one-time login code
      try {
        const result = await oauthLogin(provider, code, redirectUriFor(provider));
        if (result?.twoFactorRequired) {
          setChallengeToken(result.challengeToken);
          return;
        }
        navigate("/dashboard", { replace: true });
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []); // eslint-disable-line

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14, color: "#cbd5e1" }}>
      {error && !challengeToken ? (
        <>
          <p style={{ maxWidth: 420, textAlign: "center" }}>{error}</p>
          <button onClick={() => navigate("/login", { replace: true })} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#0ea5e9", color: "#fff", cursor: "pointer" }}>
            Back to login
          </button>
        </>
      ) : (
        <>
          {challengeToken ? (
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                setError("");
                setVerifying(true);
                try {
                  await verifyLoginOtp(challengeToken, otpCode);
                  navigate("/dashboard", { replace: true });
                } catch (e) {
                  setError(e.message);
                } finally {
                  setVerifying(false);
                }
              }}
              style={{ display: "flex", flexDirection: "column", gap: 12, width: "min(360px, 90vw)" }}
            >
              <p>Enter the 6-digit code from your authenticator app.</p>
              {error && <p role="alert">{error}</p>}
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                aria-label="Authenticator code"
                required
                style={{ padding: 12, borderRadius: 8 }}
              />
              <button type="submit" disabled={verifying || otpCode.length !== 6} style={{ padding: 10, borderRadius: 10 }}>
                {verifying ? "Verifying…" : "Verify & sign in"}
              </button>
            </form>
          ) : (
            <p>Signing you in…</p>
          )}
          {slow && !challengeToken && (
            <p style={{ maxWidth: 360, textAlign: "center", fontSize: ".85rem", color: "#8f94a9" }}>
              {waitSeconds < 90
                ? `The server is starting after inactivity. Sign-in will continue automatically (${waitSeconds}s).`
                : `The server is taking longer than usual to start. Sign-in is still retrying (${waitSeconds}s).`}
            </p>
          )}
        </>
      )}
    </div>
  );
}