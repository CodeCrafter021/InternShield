# InternShield — Frontend

React + Vite frontend for InternShield, built from the project plan PDF and
the animated UI reference. Runs fully standalone (mock auth + mock
verification data) — no backend required to try it out.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## What's in here

- **Login / Register** — real client-side auth flow (`src/services/authService.js`)
  backed by `localStorage`, so creating an account and signing in actually
  works end-to-end today.
- **Dashboard** — stat cards, an animated bar chart, and a company search box
  that runs the (mocked) verification engine.
- **Verification result page** — scanning animation → GREEN / YELLOW / RED
  risk result with evidence, matching section 9 of the project plan.
- **Glassmorphism design system** — see `src/styles/index.css` for the color
  tokens, gradients, and reusable `.glass` / `.glass-card` classes.

## Connecting the real Spring Boot backend later

Every service file (`authService.js`, `verificationService.js`) has the real
`api.post(...)` / `api.get(...)` call commented directly above the mock
logic it replaces — the function signatures won't change, so no other file
needs to be touched. Set `VITE_API_URL` in a `.env` file (see
`.env.example`) once the backend is running.

## Folder structure

```
src/
  components/   Reusable UI: Navbar, GlassButton, RiskBadge, EvidenceCard,
                AnimatedBackground, AiScannerCard, LoadingScreen, charts...
  pages/        Home, Login, Register, Dashboard, VerificationResult, NotFound
  context/      AuthContext (who's logged in)
  services/     api.js (axios), authService.js, verificationService.js
  hooks/        useScrollReveal.js
  styles/       index.css (design tokens + global styles)
```
