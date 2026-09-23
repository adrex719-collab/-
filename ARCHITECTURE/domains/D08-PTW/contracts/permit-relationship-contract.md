# D08 PTW — Permit Relationship Contract

Status: TARGET CONTRACT — PRE-PROMOTION

## 1. Single-engine rule

There is exactly one D08 Permit Engine.

The engine supports three relationship classes:

1. PRIMARY
2. SUPPLEMENTAL / LINKED
3. SPECIALIZED / CONTROLLED

These are relationship semantics, not three engines.

## 2. Primary permits

The source-supported primary work families are:

- COLD_WORK
- HOT_WORK
- CONFINED_SPACE
- EXCAVATION
- VEHICLE_ENTRY
- ROAD_CLOSURE

A primary permit represents the main work authorization for one defined work activity.

## 3. Supplemental electrical permit

ELECTRICAL_PERMIT is a supplemental permit.

Required relationship:

- parentPermitId → a primary permit
- relationshipType = SUPPLEMENTAL
- primary permit remains authoritative for the work activity
- electrical permit adds electrical isolation / lock-off / earthing / authorized-electrical-person controls
- more than one electrical supplemental permit may exist when the source procedure requires separate isolation packages for different jobs

The electrical permit must not be representable as a standalone replacement for the primary permit.

## 4. Specialized radiography permit

RADIOGRAPHY_PERMIT is a specialized controlled permit.

It remains on the D08 lifecycle/audit backbone but has a specialized extension:

- radiography contractor/team
- minimum team rule from the approved procedure
- advance-submission rule from the approved procedure
- HSE approval
- Technical Inspection approval
- radiography equipment/camera identity
- source information
- controlled/prohibited area data
- radiation-warning controls
- dosimetry
- monitoring/calibration evidence
- emergency controls
- specialist authorization/evidence

Numeric radiation limits are rule-version data and must not be hard-coded until validated by the responsible radiation-protection authority.

## 5. Shared lifecycle

All permit families use the same authoritative lifecycle engine:

REQUESTED
→ PENDING_APPROVAL
→ ISSUED
→ ACTIVE
→ SUSPENDED
→ RESUMED
→ CLOSED

Cancellation/expiry are controlled terminal branches.

Family-specific controls are preconditions/guards within this lifecycle.

## 6. Dependency boundaries

- C03 owns identity, role, scope and authorization.
- C09 owns generic workflow/approval behavior.
- C11 owns competency/qualification/authorization validity.
- D09 owns LOTO/energy-isolation execution.
- C08/C20 own evidence/audit behavior.
- D08 owns permit semantics and permit-family business rules.

D08 must not create parallel authorization, workflow, LOTO, evidence or audit engines.

## 7. Minimum relationship fields

Target permit model must support:

- permitFamily
- relationshipType
- parentPermitId (optional for primary; required for supplemental)
- rootPermitId (resolved root of a linked permit chain)
- specializedProfile (optional)
- ruleSetId
- ruleSetVersion
- effectiveProcedureId
- effectiveProcedureRevision

These fields preserve the difference between operational data and the controlled rule/document version that governed it.

## 8. Promotion rule

D08 cannot be promoted if runtime/backend collapses:

- ELECTRICAL_PERMIT into an independent primary permit, or
- RADIOGRAPHY_PERMIT into a generic permit with no specialized controls.

The implementation must prove the relationship model with server-side tests.
