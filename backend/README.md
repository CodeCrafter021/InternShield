# InternShield

## Production backend

The production frontend is hosted at `https://intern-shield-five.vercel.app` and
the API is hosted on Render. Set `CORS_ORIGINS` in the Render environment to
include the exact frontend origin (without a trailing slash), for example:

```text
CORS_ORIGINS=https://intern-shield-five.vercel.app
```

Render's free web services sleep after inactivity. The first API request can
take a minute or two while the service starts, so sign-up, sign-in, and OAuth
may appear to wait. For users to sign in immediately at any time, run the API
on an always-on Render instance or another host that does not sleep when idle.

Keep the existing database and OAuth environment variables configured when
changing the instance type or host; never commit their secret values.

## Account security settings

Password reset codes are delivered through SMTP and expire after 10 minutes.
Configure these backend environment variables on the API host before enabling
password resets:

```text
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM=no-reply@example.com
MAIL_SMTP_AUTH=true
MAIL_STARTTLS=true
```

The code is never returned by the API or stored in plaintext. Password reset
revokes all active sessions. Authenticator setup uses standard TOTP and works
with Google Authenticator, Microsoft Authenticator, Authy, and compatible apps.
Active sessions and account preferences are stored in the configured database.
