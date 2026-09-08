# Infrastructure (current)

## Hosting

| Item | Value | Status |
| --- | --- | --- |
| Framework deploy | Architect (`@architect/architect`) | Confirmed |
| AWS region | `eu-west-1` | Confirmed (`app.arc`) |
| Runtime | `nodejs20.x` | Confirmed (`app.arc`) |
| HTTP | `/*` → `server` | Confirmed |
| Static | `@static` | Confirmed |
| Timeout | 30s | Confirmed |
| Stack naming | Derived from `split-times-a104` (e.g. SplitTimesA104Staging/Production per README) | Confirmed (docs) |

## Environments

| Branch | Deploy target | Status |
| --- | --- | --- |
| `dev` | Staging | Confirmed (workflow) |
| `main` | Production | Confirmed (workflow) |
| PRs | CI only | Confirmed |

## Secrets (deploy)

README documents GitHub secrets `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and Arc env `ARC_APP_SECRET`, `SESSION_SECRET`.

**Unknown:** Whether these are currently configured and whether production is actively serving traffic.

## Local development

- `npm run dev` → Remix dev + `arc sandbox -e testing`
- Observed sandbox URL in analysis: `http://localhost:3333`

## Observability / backups

| Concern | Current |
| --- | --- |
| App metrics/APM | Missing in repo |
| Log aggregation | Unknown (AWS defaults possible) |
| Backups of race data | N/A server-side; **no** device backup feature |
| IaC beyond Architect | `sam.yaml` generated/ignored locally per `.gitignore` |

## CI Node version drift

**Partial:** `package.json` engines `>=20`, `app.arc` `nodejs20.x`, but GitHub Actions uses `node-version: 18`.
