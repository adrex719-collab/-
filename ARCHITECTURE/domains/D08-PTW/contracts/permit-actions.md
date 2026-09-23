# PTW Actions

## Core lifecycle

- request
- riskReview
- approve
- issue
- activate
- suspend
- resume
- close
- cancel

## Permit-family actions / controls

### Primary permit
Primary permit follows the common D08 lifecycle and work-specific controls.

### Electrical supplemental permit
- createLinkedElectricalPermit
- performElectricalIsolation
- lockOff
- verifyIsolation
- releaseElectricalIsolation

An electrical permit must reference a primary permit. It cannot substitute for the primary hot/cold permit required by the source procedure.

### Radiography specialized permit
- submitRadiographyPermit
- specialistReview
- technicalInspectionApproval
- hseApproval
- activateRadiographyOperation
- suspendRadiographyOperation
- closeRadiographyOperation

Radiography activation requires its specialized approvals and controls before operation.

## Common guards

- Approval requires authorization.
- Activation requires a separately authorized activation action.
- Active work requires required LOTO/gas-test evidence where applicable.
- Close is blocked until required isolation/tag-removal/release conditions are satisfied.
- A permit is limited to one work activity; different work requires separate permits.
- Normal permit validity is one work shift.
- If work does not start within 2 hours after issuance, reissue is required.
- Excavation uses explicit duration.
- Regional maximums are enforced server-side: Asaluyeh 12 hours and Mahshahr 8 hours where applicable.
- Electrical supplemental permits require their linked primary permit.
- Radiography requires source-defined specialist controls and approvals.
