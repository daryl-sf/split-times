# Split Times — Product Context Repository

This repository is the **product memory** for **Split Times** (also referred to in the application README as “Simple Split Times”).

It stores the durable context needed to understand, maintain, improve, and eventually commercialise the product — without requiring every reader to reverse-engineer the application source code.

---

## Important

This repository describes the product and its intended evolution.

The application source repository remains the **source of truth for implementation**:

- **Application:** [github.com/daryl-sf/split-times](https://github.com/daryl-sf/split-times)
- **App name (Architect):** `split-times-a104`
- **UI title:** “Split Times”

Where this repository conflicts with the code, the discrepancy should be **recorded and resolved** rather than silently ignored.

Do **not** treat speculative future ideas here as implemented behaviour.

---

## What this repository is for

Use this repository to answer:

| Question | Start here |
| --- | --- |
| What is the product? | [`context/product.md`](context/product.md) |
| Who is it for? | [`context/users.md`](context/users.md), [`product/target-users.md`](product/target-users.md) |
| How does it work today? | [`current-state/`](current-state/) |
| What business rules exist? | [`context/business-rules.md`](context/business-rules.md) |
| What should it become? | [`product/vision.md`](product/vision.md) |
| What is missing? | [`gaps/`](gaps/) |
| What should we work on next? | [`roadmap/`](roadmap/) |
| What decisions were made? | [`decisions/`](decisions/) |
| How should coding agents work? | [`agents/`](agents/) |
| Ready-made MVP build prompt | [`prompts/create-commercial-mvp.md`](prompts/create-commercial-mvp.md) |

---

## Application summary (today)

**Confirmed:** Split Times is a browser-based tool for recording runner split times during mass-start races and for timing staggered time trials.

It is primarily a **client-side** Remix application. Race data is stored in the browser via **localForage / IndexedDB**. There is no user authentication, no multi-tenant organisation model, and no server-side race database in the current application.

It is deployed to AWS with Architect + GitHub Actions.

**Current product status:** Functional personal/club-volunteer tool. **Not** commercially ready.

**Current roadmap status:** Stabilise → Commercial MVP → Professionalise → Expand. See [`roadmap/README.md`](roadmap/README.md).

---

## How documentation is organised

| Directory | Purpose | State |
| --- | --- | --- |
| `context/` | Durable product/domain understanding | Mix of current + durable |
| `current-state/` | Evidence-based description of what exists **today** | Current only |
| `product/` | Desired commercial product direction | Target / proposed |
| `requirements/` | Explicit requirements with stable IDs | Current + target, labelled |
| `gaps/` | Missing capabilities, debt, risks | Assessment |
| `architecture/` | Current vs target architecture + principles | Separated |
| `roadmap/` | Prioritised now / next / later / backlog | Planning |
| `decisions/` | Architecture Decision Records (ADRs) | Decisions |
| `agents/` | Guidance for developers and coding agents | Process |
| `audits/` | Point-in-time assessments | Assessment |

### Evidence labels

Documentation uses these labels:

- **Confirmed** — Demonstrably present in the current application
- **Partial** — Present but incomplete or unreliable
- **Intended** — Planned or suggested by code/comments/history, not implemented
- **Proposed** — Future recommendation
- **Unknown** — Insufficient evidence

### Authoritative documents

| Concern | Authoritative source |
| --- | --- |
| Implementation behaviour | Application repository code |
| Product intent / roadmap | This repository |
| Architecture decisions | `decisions/ADR-*.md` |
| Requirements | `requirements/*.md` (by ID) |
| Feature inventory (current) | `current-state/feature-inventory.md` |
| Agent operating rules | `agents/coding-agent-context.md` |

When code and docs disagree: update the docs (or fix the code deliberately) and note the change.

---

## How developers and coding agents should use this repository

1. Read [`agents/coding-agent-context.md`](agents/coding-agent-context.md) first.
2. Check [`roadmap/now.md`](roadmap/now.md) and relevant ADRs before changing behaviour.
3. Inspect the application repository for implementation truth.
4. After behaviour changes, update the matching documents here (see [`agents/workflow.md`](agents/workflow.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md)).

---

## Current vs target

Throughout this repository:

- **Current** describes the application as it exists in [daryl-sf/split-times](https://github.com/daryl-sf/split-times).
- **Target** describes the intended commercial product.

Never collapse those two into a single ambiguous statement.

---

## Publishing note

See [`HOSTING.md`](HOSTING.md) for temporary hosting on the `product-context` branch and how to promote this to `daryl-sf/split-times-product-context`.

This product-context repository is intended to live at:

`github.com/daryl-sf/split-times-product-context`

If it is initially hosted as a branch or subtree of the application repository (due to GitHub App / permissions constraints), treat that as a temporary hosting arrangement and promote it to a standalone repository as soon as practical.

---

## Licence / ownership

**Unknown** in-repo. Application and this context are owned by the Split Times author (Daryl). Formal licensing for commercial distribution is not yet defined — see [`gaps/commercial-gaps.md`](gaps/commercial-gaps.md).
