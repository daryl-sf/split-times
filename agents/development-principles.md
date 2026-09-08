# Development principles

1. **Prefer incremental change over rewrites** — the timing UI already works; extend it.
2. **Preserve existing behaviour unless deliberately changing it** — especially split math and undo.
3. **Protect timing data integrity** — never add “convenient” deletes or overwrites of durable history without safeguards.
4. **Do not bypass authorisation** — when auth lands, every org-scoped query must enforce it.
5. **Add tests for critical business rules** — split apply, undo, finish, TT, sorting, persistence keys.
6. **Document significant architectural decisions** — add/update ADRs in this repository.
7. **Do not introduce unnecessary infrastructure** — justify new services against club scale.
8. **Keep the product appropriate for its actual scale** — clubs, not Olympic chip timing.
9. **Treat race-day reliability as a core requirement** — network loss, battery loss, mis-taps.
10. **Update product context when behaviour changes** — feature inventory, requirements, journeys.
11. **Separate current vs target in docs and in PRs** — do not describe Proposed work as shipped.
12. **Avoid drive-by refactors** unrelated to the task.
