# D08 PTW — Document Gap Matrix

Status: **GAP REVIEW — SOURCE EVIDENCE BASELINE**

Date: 2026-09-22

## 1. Purpose

This matrix is the controlled bridge between the existing company documents and the D08 Target PTW contract.

It does **not** silently rewrite company procedures. Each row distinguishes:

- what is actually supported by the supplied source documents;
- what is missing, ambiguous, or requires controlled review;
- the external benchmark that should be considered;
- what should become a platform rule only after the governing document/rule is approved;
- the owner/approval point needed before operational enforcement.

### Evidence set reviewed

- WI-HS-12 — دستورالعمل صدور پروانه کار در سیستم HSE-MS
- WI-HS-33 — دستورالعمل صدور پروانۀ کار برقی
- WI-HS-13 — دستورالعمل ایمنی پرتونگاری
- FO-HS-04 — فرم بررسی پروانه های کار صادر شده
- FO-HS-13 — مجوز پرتونگاری عسلویه
- FO-HS-14 — مجوز پرتونگاری بندر ماهشهر
- FO-HS-50 — فرم مجوز پرتونگاری سایت مخازن

---

## 2. Status vocabulary

| Status | Meaning |
|---|---|
| CONFIRMED | Explicitly supported by the supplied company source |
| REVIEW_REQUIRED | Source is present but governance, revision, applicability, or detailed criteria require controlled review |
| GAP_CANDIDATE | The source does not provide enough detail for a complete executable rule; this is not proof that no separate document exists |
| PLATFORM_MAPPING | The requirement is sufficiently clear to map into the platform, subject to governing-document approval |
| NOT_FLATTENED | Relationship must remain explicit in the target model |

---

## 3. Gap matrix

| ID | Source / section | Verified source content | Gap / ambiguity | Current benchmark / reference | Document revision need | Target platform rule | Owner / approval | Priority |
|---|---|---|---|---|---|---|---|---|
| D08-G01 | WI-HS-12 header + revision table | Header shows revision «یک» while the revision table also contains date 1402/11/22 and later empty revision rows. | Controlled revision metadata is internally ambiguous and must not be assumed to identify the effective revision. | ISO 45001 management-system document control principles; company controlled-document procedure to be identified. | Reconcile revision number, change history, effective date, review date, superseded version, and applicable sites. | Permit records must store the effective procedure/revision used at issuance. | Document Control + HSE owner + approver | P0 |
| D08-G02 | WI-HS-12 §§0–1 | Procedure covers hot, cold, confined-space entry, vehicle entry and excavation; scope says all petrochemical complexes. | Road closure appears as a distinct special form in §5-3 but is not developed as a full procedural section in the supplied text. | Site/legal requirements; excavation/traffic-control requirements to be mapped by jurisdiction/site. | Create or identify controlled requirements for road closure, traffic control, barriers, alternate routes, emergency access, duration and closure/reopening criteria. | ROAD_CLOSURE remains a primary D08 family but requires its own rule profile/checklist. | HSE + Operations + Site/traffic owner | P0 |
| D08-G03 | WI-HS-12 §§4-1–4-10 | No repair/project work without permit; issuer/site supervisor and executing supervisor sign; issuer inspects site; permit completed before work. | Exact role/authorization matrix, delegation rules, and scope boundaries are not fully formalized in the supplied text. | ISO 45001 role/responsibility framework; C03 Authorization target contract. | Define role names, delegation, separation-of-duty, authorization expiry/revocation and site scope. | Server-side permission + hierarchical scope + SoD; no client-only authorization. | HSE governance + C03 owner | P0 |
| D08-G04 | WI-HS-12 §§4-23, 4-31 | One person cannot be both executing responsible person and area/facility supervisor; one permit per work. | Need formal conflict-of-interest rule for all role combinations, not only the explicitly stated pair. | C03 authorization / SoD; ISO 45001 governance. | Expand and approve SoD matrix for issuer, area supervisor, executor, reviewer, HSE approver and specialist roles. | Block prohibited signer combinations server-side and record reason/audit evidence. | HSE governance + Authorization owner | P0 |
| D08-G05 | WI-HS-12 §§4-15–4-19 | Gas testing is required where flammable/explosive materials may exist; confined-space entry requires O2, flammable/explosive and toxic-gas testing; gas testers need HSE authorization. | Exact test parameters, units, acceptance limits, instrument identity/calibration, test frequency, tester competency and evidence format are not fully defined in supplied WI-HS-12. | OSHA 1910.146 atmospheric testing; current site/process limits must govern. | Define test matrix by permit family/hazard, acceptance thresholds, pre-start/retest/continuous rules, instrument calibration evidence and tester authorization. | Gas-test record is structured evidence linked to permit; activation is blocked when required test/evidence is missing. | HSE / Process Safety / Industrial Hygiene | P0 |
| D08-G06 | WI-HS-12 §§4-12–4-14 | Confined-space work requires standby/watch support; breathing apparatus and fire-brigade standby where necessary; special HSE/fire presence may be required. | Rescue method, entrant/attendant/supervisor roles, rescue capability, communications and emergency-plan criteria are not fully defined here. | OSHA 1910.146; NFPA 350 as benchmark. | Identify the governing confined-space/rescue procedure and close missing criteria through controlled revision. | CONFINED_SPACE profile requires linked rescue/standby controls and evidence where rule conditions trigger them. | HSE + Emergency Response | P0 |
| D08-G07 | WI-HS-12 §§4-26, 4-28 | Operations is responsible for depressurization, isolation, draining, steaming, gas freeing etc.; adjacent equipment must be fully isolated; valves alone are insufficient and proper blind isolation is required. | Isolation boundary, isolation-point inventory, verification, lock/tag identity and group/shift handover are not fully specified in WI-HS-12. | OSHA 1910.147 for hazardous-energy-control benchmark; D09 LOTO contract. | Align PTW isolation requirements with the approved LOTO/energy-isolation procedure and define verification evidence. | PTW references/links LOTO; LOTO remains one Core-backed D09 engine, not duplicated inside D08. | Operations + Electrical + HSE / D09 owner | P0 |
| D08-G08 | WI-HS-12 §§4-24, 4-32, 4-35 | Permit maximum one work shift; next shift requires a new permit; if work has not started within 2 hours, reissue is required; permit closes after work/shift. | Conditions for extension, early expiry, suspension, reissue and handover need a complete lifecycle policy. | Company rule is controlling; workflow/authorization benchmark from C09/C03. | Approve complete lifecycle including expiry, suspension, resume, reissue and shift handover. | Existing runtime lifecycle is retained, but all transition guards must be tied to approved rules and audit evidence. | HSE governance + Workflow owner | P0 |
| D08-G09 | WI-HS-12 §4-25 | If conditions change and work becomes unsafe, work must stop and the issue be reported. | Exact trigger, authority to suspend, reassessment/revalidation and restart approval are not fully specified. | ISO 45001 operational control; site risk-management procedure. | Define stop-work, reassessment, reauthorization and restart evidence. | SUSPENDED state requires reason; RESUMED requires authorized transition; risk/control reassessment can be required by rule profile. | HSE + Operations | P0 |
| D08-G10 | WI-HS-12 §4-29, §4-33 | Excavation areas are marked; after excavation, separate cold/hot permit is required for subsequent work. | Excavation protective-system criteria, depth/soil/utility controls, inspection frequency and road-closure interaction are not contained in supplied WI-HS-12. | OSHA 1926 Subpart P as an external benchmark; applicable local/company excavation rules take precedence. | Identify/create dedicated excavation safety procedure and approval criteria. | EXCAVATION has mandatory rule fields including explicit duration and linked controls; do not infer protective-system limits from the platform alone. | HSE + Civil/Engineering + Operations | P0 |
| D08-G11 | WI-HS-12 §4-34 | Any vehicle entering units requires a specific vehicle-entry permit. | Vehicle-entry eligibility, route, escort, vehicle condition, ignition/parking controls and validity details are not fully specified. | ISO 39001 can be a management benchmark; site traffic rules govern. | Controlled vehicle-entry checklist and site-specific restrictions required. | VEHICLE_ENTRY uses a dedicated rule profile and evidence checklist. | Operations + HSE + Security/Traffic | P1 |
| D08-G12 | WI-HS-33 §§5-1–5-5 | Electrical permit is required for electrical isolation/work; it must accompany hot/cold permit; additional permits may be required; separate supplemental electrical permit may be needed for different jobs on the same isolated equipment. | Source clearly establishes a linked/supplemental relationship, but target data contract/runtime must represent parent/child permit relationships explicitly. | NFPA 70E current edition should be checked at controlled-document review; electrical legal/company rules remain controlling. | Revise WI-HS-33 to define relationship, isolation package, authorization, testing/verification, lock-off, earthing, handover and release. | ELECTRICAL_PERMIT is SUPPLEMENTAL and must link to a primary permit; it cannot become an unrelated eighth engine. | Electrical Maintenance + HSE | P0 |
| D08-G13 | WI-HS-33 §§5-7–5-20 | PPE/equipment checks, stop condition, padlocks, lock-off, HV earthing, authorized electrical personnel and HSE approval are explicitly described. | Detailed authorization lifecycle, competency/qualification validity, personal/group locks and verification evidence need a unified rule set. | OSHA 1910.147 benchmark plus applicable electrical safety requirements; current NFPA 70E edition to be mapped during review. | Harmonize WI-HS-33 with D09 LOTO and C11 Authorization; remove duplicate rule definitions where Core should own them. | C11 owns authorization; D09 owns LOTO; D08 stores links/evidence and blocks permit progression when required dependencies fail. | Electrical + HSE + C11/D09 owners | P0 |
| D08-G14 | WI-HS-13 §6-4 and FO-HS-13/14/50 | Non-fixed radiography permit must be completed at least 24h before operation and approved by Technical Inspection and HSE; permit accompanies team; minimum two radiographers; controlled area and monitoring are required. | Specialized approval chain and radiography-specific evidence must be represented without flattening into generic permit fields. | IAEA GSR Part 3 / SSG-11; applicable Iranian radiation-protection law and regulator requirements take precedence. | Review current legal references, competency/licensing requirements, source/equipment controls, area boundaries, dosimetry, emergency response and approval roles. | RADIOGRAPHY_PERMIT is SPECIALIZED; dedicated extension data + specialist approvals + radiation evidence are required. | HSE Radiation Protection + Technical Inspection + legal/regulatory owner | P0 |
| D08-G15 | WI-HS-13 §6-1–6-2 | Radiography contractor must provide camera documents, calibration evidence, half-life data, worker radiation-protection certificates, health-physics responsible-person documents, procedures and monitoring/emergency equipment lists. | Validity periods, verification authority, document expiry and contractor/person matching are not fully defined as executable rules. | IAEA safety framework; applicable regulator requirements. | Define controlled evidence list, validity, verification, rejection/exception and renewal process. | C08 Evidence + C11 Authorization + D08 specialized precondition checks. | Radiation Protection + HSE + Contractor Management | P0 |
| D08-G16 | WI-HS-13 §6-4–6-8 | Radiography requires barriers/signage, watchman where needed, dose-rate measurement after first exposure, monitoring, source storage/security and incident response. | Thresholds and calculation rules in the legacy document require controlled technical/legal validation before becoming hard-coded software limits. | IAEA GSR Part 3 / SSG-11 and current national requirements. | Do not copy legacy numeric thresholds into software until radiation-protection authority validates them. | Platform stores measured values and approved limits by rule/version; limits are versioned configuration, not hard-coded UI constants. | Radiation Protection Specialist + regulator/legal review | P0 |
| D08-G17 | FO-HS-04 | Form is a review record covering permit number, issuer, work details, shift, gas test, hazards, precautions, start/completion approval, package closure and notes. | This is a review/inspection record, not the primary permit. | Audit/evidence model; ISO 45001 documented information. | Define FO-HS-04 as Permit Review/Inspection record and update its controlled fields if needed. | Create linked PermitReview/PermitInspection evidence record; do not map FO-HS-04 to the Permit entity itself. | HSE Audit/Inspection owner | P1 |
| D08-G18 | WI-HS-12 §4-20 | Three paper copies/colors are required: white issuer, yellow executor, green HSE/fire. | Physical color-copy distribution is a legacy implementation mechanism and should not be treated as the target system-of-record model. | Digital records/audit principles; company document-control requirements. | Confirm whether legal/site requirements still require physical copies; define controlled print representation if needed. | Single authoritative permit record with recipient/access/audit trail; optional controlled print copies are derived artifacts. | Document Control + HSE + Legal | P1 |
| D08-G19 | WI-HS-12 §4-27 | Hot work in central/independent workshops located in safe areas does not require a permit. | Exact definition of “safe area”, workshop qualification, exclusions and change-of-condition triggers are not supplied. | Site risk assessment and applicable fire/process safety requirements. | Define and approve the exemption criteria; include periodic review of exempt locations. | Exemption is rule-driven and scope/location based; never a UI checkbox that bypasses authorization. | HSE + Operations | P0 |
| D08-G20 | WI-HS-12 §4-30–4-36 | Consultation is advised when safety is uncertain; separate permit per work; close after completion/shift; housekeeping must be verified. | Evidence requirements and closure acceptance criteria are not fully structured. | ISO 45001 operational control and evidence principles. | Define minimum closure checklist, acceptance evidence and exception handling. | CLOSED requires closure evidence/notes and required dependency release; closure is audited. | HSE + Operations | P1 |
| D08-G21 | WI-HS-13 header + §5 | Document references ISO 45001:2018 and older radiation-protection/legal references; header/revision metadata is inconsistent with the displayed revision history. | Current legal/normative status must be revalidated; legacy numeric limits must not be assumed current. | ISO 45001:2018 remains current with Amendment 1:2024; ISO/DIS 45001 is under development. IAEA GSR Part 3/SSG-11 are benchmarks. | Controlled standards/legal review and new revision history required. | Store rule/limit provenance and effective revision; no silent substitution of newer standards into company rules. | HSE standards/legal + Radiation Protection | P0 |
| D08-G22 | WI-HS-33 header | Document explicitly shows revision zero. | Current applicability/effective status is not established by the supplied source alone. | Current applicable electrical safety requirements and company document-control system. | Verify effective status, superseded versions and current legal/normative references before production enforcement. | Procedure revision is part of rule provenance for permit records. | Document Control + Electrical + HSE | P0 |
| D08-G23 | All supplied documents | Several requirements depend on other procedures (confined-space entry, work-at-height, emergency, LOTO, electrical, radiation, etc.). | Supplied D08 evidence set is not sufficient to prove the complete cross-procedure control chain. | Target architecture dependency model. | Build a dependency register and close/accept each external dependency before D08 promotion. | D08 may reference Core/Domain engines; it must not duplicate their authoritative logic. | Architecture + HSE governance | P0 |

---

## 4. What is already safe to encode

The following rules are sufficiently explicit in the supplied documents to remain in the executable D08 contract, subject to final controlled-document approval:

1. **One permit per work.**
2. **Permit must be completed before work starts.**
3. **Normal permit validity is one work shift.**
4. **If work does not start within 2 hours of issue, reissue is required.**
5. **Permit must be closed after completion or shift end.**
6. **Confined-space work has mandatory atmospheric-testing controls described by the source.**
7. **Electrical permit is supplemental/linked, not an independent parallel PTW engine.**
8. **Radiography is a specialized controlled permit family with specialist approvals and radiation-specific evidence.**
9. **Excavation can require a separate subsequent cold/hot permit.**
10. **A permit exemption cannot be implemented as an uncontrolled UI bypass.**

---

## 5. Rules that must NOT yet be hard-coded as fixed numeric limits

Until the responsible technical/legal authority validates the governing document:

- radiation dose thresholds from the legacy WI-HS-13;
- gas-test acceptance thresholds not explicitly approved for the relevant site/process;
- detailed excavation protective-system thresholds;
- electrical approach/distances/limits copied from legacy tables;
- any site-specific exception or exemption that is not backed by a controlled effective document.

The platform should store these as **versioned rule parameters with provenance**, not as permanent constants in frontend/backend code.

---

## 6. Required controlled-document workflow

For every REVIEW_REQUIRED / GAP_CANDIDATE item:

**SOURCE → GAP REVIEW → LEGAL/NORMATIVE MAPPING → DRAFT REVISION → APPROVAL → EFFECTIVE DOCUMENT → PLATFORM RULE → TEST → AUDIT**

No production rule should be introduced merely because an international benchmark mentions it.

Conversely, an existing company rule should not be treated as current merely because it exists in the source ZIP.

---

## 7. Promotion blockers for D08

D08 must remain **NOT PROMOTED** until at minimum:

- [ ] D08-G01 document-control/revision ambiguity is resolved.
- [ ] D08-G02 road-closure requirements are governed.
- [ ] D08-G05 gas-testing rule matrix is approved.
- [ ] D08-G06 confined-space/rescue dependency is resolved.
- [ ] D08-G07 PTW/LOTO boundary is approved.
- [ ] D08-G10 excavation safety dependency is resolved.
- [ ] D08-G12/D08-G13 electrical linked-permit model is implemented and tested.
- [ ] D08-G14–G16 radiography specialization and numeric-limit provenance are approved.
- [ ] D08-G19 exemption criteria are controlled.
- [ ] Source taxonomy is implemented in runtime/backend without flattening linked/specialized permits.
- [ ] Authenticated Browser E2E passes against the deployed application.
- [ ] Production authorization/profile provisioning is verified.
- [ ] Fresh GitHub PTW Runtime Gate passes.

---

## 8. External benchmark note

The external references in this matrix are **benchmarks for gap review**, not automatic replacements for Iranian law, Ministry of Petroleum/National Iranian Petrochemical Company requirements, regulator requirements, or approved company procedures.

For example, ISO 45001:2018 remains current and has Amendment 1:2024, while ISO/DIS 45001 is still under development. OSHA 1910.147 and 1910.146 are useful benchmark references for hazardous-energy and confined-space controls, but they are not silently adopted as the company's legal requirements.

The final governing hierarchy is:

**Applicable law/regulator → Ministry/NPC/company mandatory requirements → approved site procedure → Target Architecture/platform rules → international benchmark where applicable.**
