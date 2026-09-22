# Historical Import Runtime Contract

The historical import boundary is a first-class platform capability, not a per-module script.

## Pipeline
INTAKE → VALIDATE → MATCH → MAP → DRY-RUN → APPROVE → IMPORT → RECONCILE → AUDIT

## States
- RECEIVED
- VALIDATED
- EXCEPTION
- DUPLICATE_REVIEW
- APPROVED
- IMPORTED
- RECONCILED
- REJECTED

## Invariants
1. Every source row has a deterministic source key: file + sheet + row, combined with import batch.
2. A source row is never silently discarded.
3. HISTORICAL data never becomes TEST/SEED.
4. Person matching never silently creates a duplicate master.
5. Import is idempotent for the same source key and batch.
6. Operational current-state fields are not changed by historical import unless an explicit domain rule permits it.
7. Reconciliation must account for every source row.
8. Every imported record retains source traceability.

## Module contract
Each module supplies only its business mapping and validation rules. The pipeline, audit, reconciliation and classification mechanisms remain shared platform capabilities.
