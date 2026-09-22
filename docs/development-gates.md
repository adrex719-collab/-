# Development Gates

1. Target Architecture freeze
2. PTW field contracts
3. Direct dependency contracts
4. Source/form mapping
5. Runtime materialization
6. Scenario tests
7. Authorization boundary tests
8. Gate approval
9. Promote next domain

هر داده آزمایشی باید صریحاً TEST/SEED علامت‌گذاری شود و وارد production نشود.


## Universal Module Completion Gate — Historical Data

Every module must address historical data before it can be marked COMPLETE. This is a mandatory gate, not an optional later enhancement.

For each module:
1. Identify historical datasets relevant to the module.
2. Define a simple business-facing raw Excel intake sheet/package.
3. Define mapping from the raw intake to Target schema.
4. Preserve source year/file/sheet/row and import batch traceability.
5. Validate person, organization and scope matching without silently creating duplicates.
6. Run import reconciliation: source rows = imported + exception/review/rejected rows.
7. Test historical reporting/totals where applicable.
8. Record the historical-import gate result before promoting the module.

A module may have no historical dataset only when that determination is explicitly recorded with evidence. Historical data is classified HISTORICAL and is never mixed with TEST/SEED or current OPERATIONAL data.
