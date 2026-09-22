# Platform Skeleton — Execution Contract

The skeleton is now the canonical implementation frame. New features are added inside these boundaries rather than as parallel subsystems.

## Request path

UI → Application Use Case → Domain Service → CORE Engine → Data Repository

Cross-cutting:
- C03 resolves authorization and scope before protected operations.
- C09 controls approval/workflow where applicable.
- C20 records material evidence/audit.
- C17 serves reporting/analytics.
- Historical Import handles HISTORICAL intake outside operational UI.

## Read path

Authorized Scope → Query/Data Access → Domain Projection → Persian UI

Every protected read must apply the resolved scope server-side.

## Write path

Command → Identity/Scope Check → Domain Rules → CORE Rules/Workflow → Persistence → Audit

A successful client response is never treated as authorization evidence.

## Module completion

Each module must provide the implementation template in `module-template.md`, including historical intake and reconciliation.

## First reference

D08 PTW is the reference vertical slice. Its patterns are reusable, but its business rules are not copied into unrelated domains.
