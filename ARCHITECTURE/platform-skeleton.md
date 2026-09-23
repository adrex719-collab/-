# ایمن بندر — Target Platform Skeleton

## Canonical hierarchy
CORE → DOMAIN → GROUP → MODULE → SUBMODULE

## Frozen target registry
CORE=25 · DOMAIN=29 · GROUP=567 · MODULE=384 · SUBMODULE=0 · TOTAL=1005

The exact frozen registry is authoritative. Counts are not permission to invent capabilities.

## Runtime layers
1. Presentation — Persian UX, dashboards and workflows
2. Application — use cases and orchestration
3. Domain — HSE business logic
4. CORE — shared engines and cross-domain capabilities
5. Data — target schema and persistence
6. Integration — controlled data exchange
7. Historical Import — Excel intake, mapping, validation, reconciliation
8. Evidence & Audit — immutable traceability
9. AI / Offline Intelligence — bounded assistance over authorized data

## Core boundary
CORE owns reusable engines. Domains consume CORE capabilities and own business semantics. No domain may create a parallel authorization, workflow, risk, inspection, incident, CAPA, repository/data-store, search, reporting, or audit engine.

## Global rules
- One Source of Truth.
- Every operational record is scope-aware.
- C03 is the identity/access/scope security boundary.
- C11 is the centralized qualification/authorization authority.
- Historical data is HISTORICAL, never TEST/SEED.
- UI is never the security boundary.
- Material actions require evidence/audit where applicable.
- Production data is never silently converted to TEST/SEED.

## Vertical-slice contract
Architecture → Target Schema → Runtime → Authorization/Scope → Workflow → Evidence/Audit → Historical Import → Tests → Gate.

## Reference implementation
D08 PTW is the first reference vertical slice. Once promoted, its proven patterns become platform contracts rather than D08-owned parallel engines.
