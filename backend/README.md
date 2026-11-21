# InternShield

## Production backend

The production frontend is hosted at `https://intern-shield-five.vercel.app` and
the API is hosted on Render. Set `CORS_ORIGINS` in the Render environment to
include the exact frontend origin (without a trailing slash), for example:

```text
CORS_ORIGINS=https://intern-shield-five.vercel.app
```

Render's free web services sleep after inactivity. The frontend now starts a
health check as soon as the authentication screen opens and again when OAuth
starts, overlapping server startup with the user's sign-in steps. If the
instance has already gone to sleep, the cold start can still take a minute or
two. To eliminate that wait, run the API on an always-on Render instance or
another host that does not sleep when idle.

Keep the existing database and OAuth environment variables configured when
changing the instance type or host; never commit their secret values.

## Account security settings

Password reset codes are delivered through SMTP and expire after 10 minutes.
Configure these backend environment variables on the API host before enabling
password resets or email notifications:

```text
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM=no-reply@example.com
MAIL_SMTP_AUTH=true
MAIL_STARTTLS=true
MAIL_NOTIFICATIONS_ENABLED=true
```

The code is never returned by the API or stored in plaintext. Password reset
revokes all active sessions. Authenticator setup uses standard TOTP and works
with Google Authenticator, Microsoft Authenticator, Authy, and compatible apps.
Active sessions, preferences, community alerts, and anonymous aggregate telemetry
are stored in the configured database. Existing users must explicitly enable
telemetry sharing in Settings; only the scan risk category is counted, never a
company name, account identifier, or uploaded document.

## Production setup for all Settings options

1. **Keep persistent storage configured on Render.** Set `DB_URL`, `DB_USER`,
   and `DB_PASSWORD` to the production PostgreSQL database. Settings, active
   sessions, submitted community reports, and telemetry aggregates are stored
   there; do not use an ephemeral or in-memory database for production.
2. **Configure email on the Render backend.** Add all `MAIL_*` variables above.
   Use an SMTP provider's host, port, username, and password, and use a sender
   address verified by that provider. Port `587` with STARTTLS is the normal
   choice. For Gmail, use an app password rather than the account password.
   Set `MAIL_NOTIFICATIONS_ENABLED=true` only after SMTP credentials are valid.
   This enables critical scam emails when a company's fifth community report
   arrives and a weekly report digest on Mondays at 09:00 UTC. No digest is sent
   when there are no reports in the previous seven days.
3. **Keep the API awake for scheduled email.** A scheduled digest only runs
   while the backend process is running. Use an always-on Render instance (or
   another always-running host) if weekly delivery must be reliable.
4. **Point Vercel at the API.** Set `VITE_API_URL` to the backend origin, for
   example `https://internshield-backend-latest.onrender.com`, and set the
   backend's `CORS_ORIGINS` to the exact deployed frontend origin:
   `https://intern-shield-five.vercel.app`. Redeploy the frontend after changing
   Vercel environment variables.
5. **Test each setting after deployment.**
   - Password & Security: request a reset code and confirm it arrives by email.
   - Shield Privacy & 2FA: scan the QR with an authenticator app, enable using
     its current six-digit code, then sign in again to verify the challenge.
   - Incognito: verify a company and confirm it is not added to local history.
     Telemetry is off for incognito checks even when aggregate telemetry is
     enabled.
   - Active Sessions: sign in from another browser, confirm it appears, then
     revoke it from the first browser.
   - Alerts & Notifications: change each toggle and reload Settings to confirm
     it persists. Community reports appear in-app; email alerts require the
     SMTP settings and `MAIL_NOTIFICATIONS_ENABLED=true` above.

Never commit database, JWT, or SMTP secrets to the repository.
