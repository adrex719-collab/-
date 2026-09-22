# D08 PTW — Historical Intake Mapping

## Required business sheets
The office may submit PTW history using the shared historical workbook package.

Minimum PTW fields:
- source_year
- date
- branch/region
- site/area
- unit where known
- permit/reference number
- permit type
- work location
- requester/contractor
- authorization/approval reference
- LOTO indicator
- gas-test indicator
- status at source
- source reference
- notes

## Mapping
Business fields map to the D08 Target Permit schema. Technical IDs are resolved during import.

## Matching
Person/contractor matching uses existing masters where confidence is sufficient. Ambiguous matches become DUPLICATE_REVIEW/EXCEPTION; no silent duplicate is created.

## Reconciliation
Every source row ends as IMPORTED, EXCEPTION, DUPLICATE_REVIEW or REJECTED, with import batch and source row traceability.
