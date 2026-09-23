# CORE Contract Matrix — Target Platform

## Purpose
This file defines ownership boundaries for the frozen 25 CORE. It is an architecture contract, not a feature checklist.

| CORE | Owner responsibility | Must be consumed by Domains | Parallel engine prohibited |
|---|---|---|---|
| C01 | Organization, hierarchy, master organizational data | All scoped domains | Domain organization master |
| C02 | Person, workforce, employee/contractor identity records | People, PTW, PPE, health, contractors | Domain person master |
| C03 | Identity, roles, permissions, scope, SoD | All operational domains | Domain authorization/security |
| C04 | Location, area, site, unit, presence | All location-aware domains | Domain location master |
| C05 | Asset/equipment master and lifecycle identity | Equipment, inspection, fire, marine | Domain asset master |
| C06 | Item/material master | PPE, warehouse, environment, procurement | Domain material master |
| C07 | External parties and organizations | Contractor, supplier, marine, procurement | Domain party master |
| C08 | Document, record and knowledge lifecycle | All evidence/document domains | Domain repository |
| C09 | Workflow and approval orchestration | PTW, CAPA, incident, governance, MOC | Domain workflow engine |
| C10 | Tasks, actions, obligations and due dates | CAPA, inspections, incidents, governance | Domain task engine |
| C11 | Qualification, training, examination and operational authorization | PTW, driving, diving, contractor, specialized work | Domain authorization master |
| C12 | Shared risk evaluation and controls | PTW, operations, incidents, MOC, emergency | Domain risk engine |
| C13 | Shared inspection execution and findings | Inspection, assets, health, environment | Domain inspection engine |
| C14 | Event/incident lifecycle and classification | Incident, emergency, marine, environment | Domain incident engine |
| C15 | Notifications, alerts, escalation and delivery policy | All time-sensitive domains | Domain notification engine |
| C16 | Global authorized search/index | All domains | Domain search engine |
| C17 | KPI, reporting, analytics and aggregation | Management and operational domains | Domain reporting engine |
| C18 | Rules, decision tables and policy evaluation | PTW, authorization, compliance, operations | Hard-coded duplicate rules |
| C19 | Automation, scheduled/background execution | Reports, alerts, renewals, imports | Domain automation scheduler |
| C20 | Evidence, audit trail, provenance and material-action trace | All controlled domains | Domain audit trail |
| C21 | Context/scenario/time/shift/operational context | Dashboards, workflows, AI, reports | Domain context model |
| C22 | Integration, import/export and controlled exchange | External systems and historical intake | Direct uncontrolled integration |
| C23 | Offline AI/intelligence under authorization and evidence boundaries | Search, reporting, decision support | Domain AI silo |
| C24 | Daily work queues, operational execution patterns and action center | All staff-facing operational workflows | Domain-specific work shell |
| C25 | Data classification, sensitive-data policy and access constraints | Health, medical, personnel, investigation, security-sensitive records | Domain sensitivity policy |

## D08 reference wiring

D08 currently proves these boundaries directly:
- C03: scope, permission, SoD and server authorization boundary
- C08: procedure/rule/evidence references
- C09: lifecycle/approval states
- C11: requester and approver eligibility
- C12: risk-review gate
- C17: reporting surface
- C20: evidence requirements

D08 operational controls also establish integration points for:
- C10: action center and closure obligations
- C15: lifecycle notifications (foundation contract pending)
- C16: permit search (foundation contract pending)
- C18: permit rule evaluation
- C19: automated validity/renewal/escalation (foundation contract pending)
- C21: shift/time/context
- C22: controlled historical intake
- C23: bounded AI reporting/decision support
- C24: operational work queue/action center
- C25: data-classification enforcement

## Implementation rule

A new Domain can request a CORE capability through a contract. It may not copy the implementation.

A CORE capability becomes executable only when its contract, schema, runtime boundary, authorization boundary, tests and audit requirements exist.

## Promotion gate

CORE foundation → D08 reference slice → CORE contract hardening → Domain implementation.

No D01/D02/... implementation should introduce a second engine for a capability already owned by CORE.
