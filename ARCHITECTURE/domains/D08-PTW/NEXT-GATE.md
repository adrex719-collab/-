# D08 PTW — Next Gate

## Current closed controls

1. **C03 server identity/role/scope boundary — IMPLEMENTED**
   - Convex Auth is now configured for the application.
   - PTW server functions resolve the authenticated actor with Convex Auth.
   - userProfiles remains the single role/scope profile boundary.
   - Branch access is denied unless the authenticated profile contains the branch or has explicit CENTRAL_HSE aggregate scope.
   - PTW scoped APIs enforce permissions by transition.
   - Client-supplied branchId is treated as a routing/scope key and is checked against the server-resolved profile.

2. **Historical dry-run/reconciliation implementation — PASS**
   - runtime/historical/importer.ts implements deterministic source keys, HISTORICAL classification, validation, person matching exceptions, duplicate review, reconciliation, and import approval blocking unresolved exceptions.
   - Regression coverage is included under TESTS/historical/.

3. **PTW UI integration — IMPLEMENTED**
   - The real Macaly dashboard is wired to listScoped, createScoped, and updateStateScoped.
   - The dashboard is protected by an authentication gate.
   - The Persian RTL UX patterns are represented in Figma and applied to the Macaly runtime.

## Remaining gates

4. **Production user/profile provisioning — OPEN**
   - Authentication is configured, but a production-style user must have an explicit userProfiles record before operational PTW access is granted.
   - No automatic self-registration-to-privileged-role path is permitted.

5. **Browser E2E: UI → Auth → C03 Scope → PTW → Convex — OPEN**
   - Must be executed with a provisioned production-style profile.
   - Required cases: authorized branch read/create/state transition and cross-branch denial.
   - This is the final D08 promotion control.

6. **GitHub Runtime Gate — REVERIFY**
   - The previous PASS referenced an older commit.
   - Current commits must produce a fresh green Runtime Gate before D08 promotion.

**Status: NOT PROMOTED.**

D08 becomes the reference vertical slice only after controls 4–6 pass. No next-domain promotion before that gate.
