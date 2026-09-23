# D08 PTW — Source Evidence Taxonomy

Status: SOURCE-EVIDENCE REVIEWED

## Evidence set

The following company-controlled documents were reviewed from the project reference ZIP:

- WI-HS-12 — دستورالعمل صدور پروانه کار در سیستم HSE-MS
- WI-HS-33 — دستورالعمل صدور پروانه کار برقی
- WI-HS-13 — دستورالعمل ایمنی پرتونگاری
- FO-HS-04 — فرم بررسی پروانه های کار صادر شده
- FO-HS-13 — مجوز پرتونگاری عسلویه
- FO-HS-14 — مجوز پرتونگاری بندر ماهشهر
- FO-HS-50 — فرم مجوز پرتونگاری سایت مخازن

## Source-derived taxonomy

WI-HS-12 explicitly defines the general work-permit procedure for:

1. Hot work
2. Cold work
3. Confined-space entry
4. Vehicle entry
5. Excavation

Its appendices are explicitly separated into:

- 5-1: hot work, vehicle entry and cold work permit form
- 5-2: vehicle-entry permit form
- 5-3: excavation and road-closure special permit form

Therefore road closure is a distinct operational permit form/family within the D08 PTW model, while the source does not establish it as a separate independent engine.

WI-HS-33 explicitly states that an electrical permit:

- concerns electrical isolation of equipment or work on electrical installations;
- must be issued together with a hot or cold work permit;
- does not replace other permits required by the nature of the work;
- requires a separate supplemental electrical permit when different work permits concern the same electrically isolated equipment.

Therefore Electrical is modeled as a linked/supplemental permit under the single D08 engine, not as an unrelated sibling engine.

WI-HS-13 explicitly requires non-fixed industrial radiography operations to have an operational permit completed at least 24 hours before the operation and approved by Technical Inspection and HSE. The permit must remain with the team during work. The source also requires a minimum two-person radiography team, controlled-area barriers/signage, and operational monitoring.

The company has dedicated radiography permit forms FO-HS-13, FO-HS-14 and FO-HS-50 with radiation-specific fields such as source strength, controlled/prohibited zones, radiography camera identification, radiation-warning equipment, dosimetry and specialist approvals.

Therefore Radiography is modeled as a specialized controlled permit/authorization family inside D08, with its own extension fields and approval/control requirements, while remaining on the same PTW platform and lifecycle/audit backbone.

## Target relationship

D08 — Permit to Work

- Primary work permit families
  - COLD_WORK
  - HOT_WORK
  - CONFINED_SPACE
  - EXCAVATION
  - VEHICLE_ENTRY
  - ROAD_CLOSURE

- Supplemental / linked permit
  - ELECTRICAL_PERMIT
    - linked to a primary permit
    - electrical isolation / lock-off controls

- Specialized controlled permit
  - RADIOGRAPHY_PERMIT
    - specialist authorization and HSE/Technical Inspection approvals
    - radiation-specific controls and evidence

## Non-negotiable modeling rule

Do not flatten these source relationships into one undifferentiated enum of eight independent permit types. There remains one D08 Permit Engine. Permit family, relationship type, specialized controls, linked permits and evidence are data/behavior within that engine.

This document records source evidence only. It does not replace the Target Architecture or introduce a second permit engine.
