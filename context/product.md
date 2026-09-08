# Product purpose

## Status labels used here

Statements are marked **Confirmed**, **Partial**, **Proposed**, or **Unknown**.

---

## What Split Times is

**Confirmed:** Split Times is a browser application for recording timing data during races — specifically:

1. **Mass start races** with multiple sequential stages/splits per runner (shared clock)
2. **Time trials** with staggered per-runner start and finish taps

**Confirmed:** Athletes are represented as sequential bib numbers (`1..N`), not named athlete profiles.

**Confirmed:** Persistence is local to the browser (IndexedDB via localForage).

---

## Problem it solves (current)

**Confirmed (by capability):** A timekeeper can use a phone or tablet in a browser to:

- Start a shared race clock
- Record successive split/stage times for numbered runners
- Or start/finish individual time-trial runners
- View and copy results
- Keep past races on that device

**Proposed problem framing for commercialisation:** Clubs and small race organisers need affordable, low-ceremony split timing that does not require professional chip-timing infrastructure, paper/spreadsheet chaos, or complex general-purpose race software.

That commercial framing is **not yet validated** with paying customers — see [`../product/value-proposition.md`](../product/value-proposition.md).

---

## What it is not (today)

**Confirmed absent:**

- Multi-organisation SaaS
- User accounts / authentication
- Athlete registration / membership
- Categories, age groups, gender classifications as first-class data
- Chip / RFID / photoelectric integrations
- Multi-device live synchronisation
- Server-side race database
- Billing / subscriptions
- Public results websites with URLs independent of a device

---

## Intended customers vs users

| Role | Pays? | Uses day-to-day? | Current support |
| --- | --- | --- | --- |
| Club / organiser (organisation) | Likely payer | Sometimes | **Missing** as a concept |
| Event organiser / race director | Sometimes | Setup | **Partial** — race setup exists, no org model |
| Timekeeper / volunteer | No | Race day | **Confirmed** — primary actual user of current UI |
| Coach | Sometimes | Training timing | **Partial** — TT mode helps; no coach features |
| Athlete | No | View results | **Missing** as a role; results are device-local |
| Public spectator | No | View results | **Missing** |

See [`users.md`](users.md) and [`../product/target-users.md`](../product/target-users.md).

---

## Application identity

| Field | Value | Evidence |
| --- | --- | --- |
| Product name (UI) | Split Times | `app/routes/_index.tsx` meta title |
| README name | Simple Split Times | Application `README.md` |
| npm / Arc name | `split-times-a104` | `package.json`, `app.arc` |
| Source repo | `daryl-sf/split-times` | Git remote |
| Author | Daryl Findlay | Git history |
