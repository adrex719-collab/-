# Multi-Branch Scope Boundary

## Canonical model
One Organization may contain multiple Regions/Branches, Sites/Areas and Units/Teams.
Operational records remain single-master records and carry scope references; they are not duplicated per branch.

Canonical scope dimensions:
- organizationId
- regionId (optional where the organization has no regional layer)
- branchId
- siteId
- unitId

## Rules
1. A person, contractor, asset, permit, inspection, incident, CAPA and report is never duplicated merely because it is visible in multiple branches.
2. Every new operational record must have a branch scope; site/unit are more specific scope dimensions.
3. Queries must be scope-aware. A branch user receives only records inside the authorized scope.
4. Central HSE users may have an aggregate scope spanning multiple branches.
5. Moving a person/asset between branches changes assignment/scope history; it does not create a second master record.
6. Authorization/Scope (C03) is the security boundary. Domains consume the resolved scope; they do not implement their own parallel permission model.
7. Reporting supports branch → region → organization aggregation without changing the underlying master data.

## PTW
PTW is explicitly scope-bound. A permit must identify its branch and may identify site/unit. The server must filter list/read operations by the caller's authorized scope.

## Migration
Existing TEST/SEED records may remain without the new scope fields during migration. No operational record is silently assigned to a branch. New records must provide branch scope.
