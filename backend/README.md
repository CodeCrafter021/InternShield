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
