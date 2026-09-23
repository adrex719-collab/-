# D08 Browser E2E Evidence — 2026-09-23

## Scope
Authenticated browser QA against the current Macaly production preview built from the canonical GitHub source.

## Evidence

### 1. Primary Permit
- Unique location: `QA-E2E-REL-20260923`
- Type: HOT_WORK / کار گرم
- Result: persisted successfully
- Permit ID observed: `PTW-1790156023196`
- Initial state: REQUESTED / درخواست شده
- Scope observed: `ORG-DEMO / REG-DEMO / BR-A / SITE-DEMO / UNIT-DEMO`

### 2. Electrical Supplemental Permit
- Unique location: `QA-E2E-ELECTRICAL-20260923`
- Type: ELECTRICAL / کار برقی
- Parent selected: `PTW-1790156023196 — QA-E2E-REL-20260923`
- Result: persisted successfully
- Permit ID observed: `PTW-1790156287932`
- Initial state: REQUESTED / درخواست شده
- Server relationship validation accepted a real Primary → Supplemental Electrical relationship.

### 3. Radiography Specialized Permit
- Unique location: `QA-E2E-RADIOGRAPHY-20260923`
- Type: RADIOGRAPHY / رادیوگرافی
- Result: persisted successfully
- Permit ID observed: `PTW-1790156296400`
- Initial state: REQUESTED / درخواست شده
- The application supplies `specializedProfile=RADIOGRAPHY` for this type and the server accepted the create operation.

## Important limitation
The browser identity used for this run is `HSE_STAFF`. That role can create permits and transition REQUESTED → PENDING_APPROVAL, but cannot issue/approve them. Therefore this evidence closes creation/relationship E2E, not the full approval-to-close lifecycle.

## Related automated evidence
- `ptw-authorization.test.ts`: 11/11
- `ptw-relationship.test.ts`: 4/4
- `page.test.tsx`: 3/3
- Total: 18/18
- Production build: PASS

## Gate conclusion
Browser relationship scenarios are now evidenced for:
- Primary → Electrical Supplemental
- Radiography → Specialized Profile

Cross-branch denial remains covered by server-side automated authorization tests; no fake browser PASS is recorded.
