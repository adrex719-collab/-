# D08 PTW — Next Gate

## Closed implementation controls

1. C03 server identity/role/scope resolution — PASS
   - Convex resolves the authenticated user server-side with Convex Auth.
   - userProfiles is the single role/scope profile boundary.
   - Branch access is denied unless the authenticated profile contains the branch or has explicit CENTRAL_HSE aggregate scope.
   - PTW scoped APIs enforce permission by transition.
   - Executable Convex tests cover unauthenticated access, cross-branch denial, authorized branch read, and PTW creation.

2. Historical dry-run/reconciliation implementation — PASS
   - runtime/historical/importer.ts implements deterministic source keys, HISTORICAL classification, validation, person matching exceptions, duplicate review, reconciliation, and import approval blocking unresolved exceptions.
   - Regression coverage is included under TESTS/historical/.

3. GitHub PTW Runtime Gate — PASS
   - Latest verified commit d3c5bf6a9278055f2d7b416df2b94bcb9126b9a7.
   - PTW Runtime Gate and Pages deployment checks passed.

## Remaining control

4. UI → Convex → authorization/scope end-to-end — OPEN
   - Dashboard is wired to listScoped, createScoped, and updateStateScoped.
   - Server-side denial/authorization behavior is executable and verified.
   - Final browser E2E with a provisioned production-style user profile remains before D08 promotion.

Status: NOT PROMOTED.

When control 4 passes, D08 becomes the reference vertical slice and the same execution contract is promoted to the next domain.
