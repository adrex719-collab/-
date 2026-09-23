# PTW Completion Gate

D08 PTW cannot be promoted until all of the following are PASS:

- [x] Target permit schema
- [x] Lifecycle/state guards
- [x] C03 branch scope on create/read/state change
- [x] Authorization boundary
- [x] LOTO/Gas Test prerequisites
- [x] Suspension/resume/close guards
- [x] Historical intake specification exists
- [x] TEST/SEED classification
- [x] Runtime regression tests
- [x] Multi-branch scope regression tests
- [x] Server-backed C03 identity/role resolution (not just caller-supplied branch)
- [x] Historical import dry-run and reconciliation implementation
- [x] PTW UI integration
- [ ] **Source-evidence taxonomy is implemented in runtime/backend without flattening linked/specialized permits**
- [ ] Production user/profile provisioning
- [ ] End-to-end UI → Auth → C03 Scope → PTW → Convex scenario
- [ ] GitHub Runtime Gate green on the final PTW commit

## Source-evidence constraint

The source review establishes three relationship classes inside one D08 engine:

- Primary work permits: cold, hot, confined-space, excavation, vehicle entry, road closure.
- Supplemental linked permit: electrical, linked to a primary permit.
- Specialized controlled permit: radiography, with specialist/HSE/Technical Inspection controls.

The current implementation must not be promoted while it represents these as eight unrelated independent permit types.

Status: **NOT PROMOTED** until all unchecked controls are closed.
