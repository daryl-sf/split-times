# Architecture principles

1. **Local-first race capture** — recording a split must not fail solely because the network failed (single-device MVP+).
2. **Server is source of truth for organisation archives** — once commercialised, clubs do not depend on one tablet’s IndexedDB.
3. **Incremental extraction** — pull domain logic into testable modules before introducing new infrastructure.
4. **Tenant isolation by design** — every server query is organisation-scoped.
5. **Append-oriented timing events** preferred over silent overwrites as soon as practical.
6. **Boring technology** — choose well-understood auth/DB/hosting over novel platforms.
7. **Document decisions in ADRs** when they are expensive to reverse.
8. **Keep Architect/Remix until they demonstrably block progress** — replace with evidence, not taste.
