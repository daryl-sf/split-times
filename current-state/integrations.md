# Integrations (current)

| Integration | Status | Evidence |
| --- | --- | --- |
| AWS (Architect deploy: Lambda, HTTP API, static) | Confirmed | `app.arc`, deploy workflow |
| GitHub Actions CI/CD | Confirmed | `.github/workflows/deploy.yml` |
| localForage / IndexedDB | Confirmed | dependency + usage |
| Screen Wake Lock API | Partial | `useWakeLock.ts` |
| Clipboard API (`navigator.clipboard`) | Confirmed | `SplitTime.tsx` copy |
| Chip timing / RFID | Missing | — |
| Payment / Stripe etc. | Missing | — |
| Email / SMS | Missing | — |
| Analytics (product) | Missing | — |
| Error tracking (Sentry etc.) | Missing | — |
| Identity providers | Missing | — |
| Calendar / club management tools | Missing | — |

**Unknown:** Whether production AWS account has extra monitoring integrations outside the repo.
