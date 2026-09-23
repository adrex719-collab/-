# CORE

CORE is the shared platform capability layer.

The frozen target has 25 CORE, C01–C25. See CORE-MANIFEST.md for the canonical list.

All domains consume CORE capabilities rather than recreating them.

### Mandatory boundaries
- C03 owns identity, role, access and scope enforcement.
- C09 owns shared workflow/approval.
- C11 owns qualification/training/examination/authorization.
- C12 owns the shared risk engine.
- C13 owns shared inspection.
- C14 owns shared event/incident.
- C20 owns evidence/audit.
- C17 owns KPI/reporting/analytics.
- C16 owns global search.

No domain-specific master may duplicate these engines.
