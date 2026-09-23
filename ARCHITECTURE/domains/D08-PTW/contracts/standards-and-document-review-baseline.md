# D08 PTW — Standards & Document Review Baseline

Status: REQUIRED ARCHITECTURE CONTROL

## 1. Principle

D08 is not complete merely because the current company forms have been digitized. The Target must be based on:

1. applicable Iranian law, regulator requirements and Ministry of Petroleum requirements;
2. binding company/NPC requirements where applicable;
3. current international standards and recognized industry guidance;
4. the actual operational hazards and site-specific controls;
5. auditable evidence, authorization and competency requirements.

International standards are a benchmark and design input. They do not silently override applicable Iranian law or binding corporate/regulatory requirements. Where requirements differ, the applicable legal/regulatory hierarchy must be resolved by HSE/Legal/Technical authority and recorded.

## 2. Current source-document review finding

The project source set contains:

- WI-HS-12 — PTW general instruction: revision metadata indicates an older revision history and requires a controlled current-version review before being treated as the authoritative procedure.
- WI-HS-13 — industrial radiography safety: document header shows revision 0 and requires a current regulatory/technical review before operational promotion.
- WI-HS-33 — electrical work permit: document header shows revision 0 and requires a current electrical-safety review before operational promotion.
- FO-HS-04 and permit forms: forms must be reviewed for field completeness, approval roles, evidence, traceability and digital workflow suitability rather than copied 1:1.

A document marked old, revision 0, or containing historical references is not automatically wrong; it is a trigger for controlled review.

## 3. International baseline to evaluate

### Management system / risk

- ISO 45001:2018 + Amendment 1:2024 — OH&S management system, operational control, worker participation, risk, emergency preparedness, incident/improvement and contractor/procurement interfaces.
- ISO 31000:2018 — risk-management principles and process. ISO states this edition remains current after 2023 review; a third edition is under development, so the Target must maintain a standards-watch record rather than hard-code an obsolete future reference.

### Hot work

- NFPA 51B:2024 — fire prevention during welding, cutting and other hot work.

### Electrical safety / hazardous energy

- NFPA 70E:2024 — electrical safety in the workplace.
- OSHA 1910.147 — hazardous energy control / lockout-tagout as a recognized benchmark for documented energy-control procedures, authorization, verification, training and group/contractor interfaces.
- Applicable IEC/Ministry of Petroleum electrical requirements must be mapped separately where they govern the actual installation/work.

### Confined space

- OSHA 1910.146 / applicable local equivalent as a benchmark for permit-required confined-space controls.
- NFPA 350 — safe confined-space entry and work guidance.
- Rescue, atmospheric testing, attendant, isolation, ventilation and entry authorization must be modeled as controls, not merely checkboxes.

### Excavation / ground disturbance

- OSHA 1926 Subpart P is a useful benchmark for excavation hazards, protective systems, competent-person examination and cave-in protection.
- Site-specific engineering/geotechnical requirements and applicable Iranian construction/industrial requirements take precedence where binding.

### Road / vehicle safety

- ISO 39001:2012 + current amendment status — road traffic safety management system benchmark.
- Site traffic-management requirements, vehicle authorization, route control, barriers, pedestrian interface and road-closure emergency access must be represented in the digital control model.

### Industrial radiography

- IAEA GSR Part 3 — International Basic Safety Standards for radiation protection and safety of radiation sources.
- IAEA SSG-11 — Radiation Safety in Industrial Radiography.
- ALARA, source/accountability, controlled areas, access control, dosimetry, competent personnel, emergency response and source security must be represented as first-class controls/evidence.
- Applicable Iranian radiation regulator requirements remain mandatory and must be explicitly mapped.

## 4. Target documentation model

Each controlled HSE/PTW document must have:

- document_id
- title_fa
- document_type
- owner
- approving_authority
- revision
- effective_date
- review_due_date
- supersedes_document_id
- applicable_sites/regions
- legal/regulatory references
- normative references
- source evidence
- change history
- status: DRAFT / UNDER_REVIEW / APPROVED / EFFECTIVE / SUPERSEDED / WITHDRAWN
- standards_watch status

## 5. Mandatory gap-review questions

For every PTW family ask:

1. Is the legal/regulatory basis current?
2. Is the company/NPC basis current?
3. Is the referenced international standard current, superseded, or under revision?
4. Are hazards complete for the actual operation?
5. Are authorization and competency requirements explicit?
6. Is isolation/energy control explicit?
7. Are atmospheric-testing requirements explicit where applicable?
8. Are emergency/rescue requirements explicit?
9. Are contractor interfaces explicit?
10. Are simultaneous/overlapping work conflicts controlled?
11. Are changes in conditions/work scope able to force suspension/revalidation?
12. Are evidence, approvals, timestamps and identities auditable?
13. Are validity/expiry/reissue rules machine-enforceable?
14. Can the requirement be represented without creating a second engine or parallel registry?

## 6. Document revision rule

Where source documents are incomplete, ambiguous, outdated, or inconsistent with current legal/technical requirements, the project must not silently patch the software around them.

Instead:

SOURCE → GAP REVIEW → NORMATIVE/LEGAL MAPPING → DRAFT REVISION → HSE/TECHNICAL/LEGAL APPROVAL → EFFECTIVE DOCUMENT → PLATFORM RULES

The platform must then reference the approved effective revision and preserve the historical revision used at the time of each permit.

## 7. Critical D08 implications

The digital PTW engine must support policy-driven controls rather than hard-code today's forms. This includes:

- configurable permit families and linked permits;
- role/competency-based authorization;
- risk and control requirements;
- isolation/LOTO dependencies;
- gas-test requirements and evidence;
- specialist approvals;
- validity and reissue rules;
- simultaneous-work conflict checks;
- suspension/revalidation after condition change;
- contractor and external-party interfaces;
- emergency/rescue controls;
- complete audit/evidence history;
- effective-document/revision traceability.

No D08 promotion is allowed until the applicable document-review gaps are closed or explicitly accepted by the authorized HSE/technical governance process.
