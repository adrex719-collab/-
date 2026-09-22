# C03 — Scope & Authorization Contract

## Purpose
C03 is the single security boundary for organization, region/branch, site/area and unit scope. Domains consume resolved authorization scope and do not create parallel permission logic.

## Required behavior
- Every new operational record declares a branch scope.
- Reads are filtered by the caller's authorized scope.
- Writes and state transitions verify record scope against the caller's authorized scope.
- Central HSE roles may receive an explicitly authorized aggregate scope.
- Cross-branch access is denied unless the caller's resolved scope includes both branches.
- Person/Workforce remains one master; branch transfer changes scope/history, not identity.
- Scope is auditable with actor, timestamp and resolved scope.

## PTW enforcement
PTW must enforce C03 scope at both query/read and mutation/state-transition boundaries. UI filtering is not a security control.

## Completion gate
A domain/module using scoped records is not COMPLETE until scope-aware read, write and cross-scope denial tests exist.
