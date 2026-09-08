# Users

## Current users (observed from the product)

**Confirmed:** The application has **no user accounts**. Anyone with the URL on a browser can use it. There is no login, role, or permission model.

The **de facto user** of the current product is a **timekeeper / volunteer** operating a single device during a race or training session.

### De facto roles implied by UI

| Implied role | What they do today | Evidence |
| --- | --- | --- |
| Timekeeper | Configure race, start clock, record splits / TT taps, finish race, view results | `/` race flow |
| Results viewer (same device) | Open past races, sort, copy results | `/races`, `/race/:id` |
| Local admin (same device) | Clear all local race data | `/admin` |

There is **no** club admin, athlete, coach, or public portal role in code.

---

## Target customers (who pays)

**Proposed** paying customers:

- Local triathlon clubs
- Athletics / running clubs
- Cycling clubs
- Small race organisers
- Coaches / training groups (lower willingness-to-pay; possible freemium)

**Unknown:** Which segment has strongest willingness to pay; what price point; annual vs per-event pricing.

---

## Target users (who operates)

| User | Job on race day | Notes |
| --- | --- | --- |
| Timekeeper volunteer | Capture times accurately and quickly | Primary operator |
| Event organiser | Set up race parameters, publish results | May or may not be the timekeeper |
| Club administrator | Manage seasons, members, access | **Missing** today |
| Coach | Time intervals / TTs in training | Partially served by TT mode |
| Athlete | Check personal results | **Missing** today |

Customers and users are often different people: a club may pay while volunteers operate the tool.
