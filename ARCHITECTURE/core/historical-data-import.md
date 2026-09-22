# Historical Data Import Boundary

## Purpose
Historical HSE records that predate platform go-live are first collected in a controlled Excel intake package, then transformed/mapped by the data team into Target tables. Historical data is not entered manually record-by-record into the operational UI unless explicitly required.

## Canonical flow
Historical Excel → validation/mapping → import package → Target tables → reconciliation report → platform

## Rules
1. Historical records are clearly classified as HISTORICAL, not TEST/SEED and not new OPERATIONAL activity.
2. Original values are preserved; transformation must be traceable.
3. A source row must never silently disappear. Invalid/unmapped rows go to an exception report.
4. Each imported record keeps source metadata: source file, sheet, source row, historical period and import batch.
5. Person/Workforce remains one master. Historical training, incidents, examinations and similar records link to the existing person where confidently matched.
6. Where a historical person cannot be matched safely, the row is held for resolution; no duplicate person is silently created.
7. Import is repeatable and idempotent by import batch/source key.
8. Historical imports must not alter current operational status unless an explicit business rule says so.
9. The same pattern applies to all historical HSE datasets: training hours, incidents, inspections, permits, CAPA/actions, occupational health records, environmental records, emergency drills, etc.

## Excel intake
The Excel package is intentionally simple for the business office. The user supplies raw historical information; the implementation/data team performs mapping into Target schemas.

Minimum control columns where applicable:
- source_year
- source_file
- source_sheet
- source_row
- branch/region
- person_name or personnel_code
- date
- source_reference
- notes

No technical database IDs are required from the person preparing the Excel.

## Acceptance gate
Before import:
- row count reconciled
- required fields checked
- duplicates reviewed
- person matching reviewed
- branch/scope resolved
- date/year normalized
- exceptions reported
- dry-run result approved

After import:
- source row count = imported + rejected/exception rows
- totals reconciled by year/branch/category
- import batch recorded
- audit evidence retained
