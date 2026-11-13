import { warmUpBackend } from "./api.js";

// Starts the Google / GitHub sign-in by redirecting to the provider.
// The code we get back is exchanged on the BACKEND (client secrets never reach the browser).

const PROVIDERS = {
  google: {
    url: "https://accounts.google.com/o/oauth2/v2/auth",
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: "openid email profile",
    extra: { response_type: "code", prompt: "select_account" },
  },
  github: {
    url: "https://github.com/login/oauth/authorize",
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
    scope: "read:user user:email",
    extra: {},
  },
};

export function redirectUriFor(provider) {
  return `${window.location.origin}/auth/callback/${provider}`;
}

export function startOAuth(provider) {
  const cfg = PROVIDERS[provider];
  if (!cfg || !cfg.clientId) {
    throw new Error(`${provider} sign-in is not configured yet.`);
  }
  const state = crypto.randomUUID();
  sessionStorage.setItem("oauth_state", state);
  warmUpBackend();

  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: redirectUriFor(provider),
    scope: cfg.scope,
    state,
    ...cfg.extra,
  });
  window.location.assign(`${cfg.url}?${params.toString()}`);
}
