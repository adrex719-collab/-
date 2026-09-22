# Historical Import Workbook Specification

The business-facing workbook is a raw intake tool. It is not a database export and must not require technical IDs.

## Required workbook sheets
1. آموزش — training history and hours
2. حوادث — historical incidents
3. بازرسی — historical inspections
4. CAPA — corrective/preventive actions
5. معاینات — occupational examinations
6. مانورها — emergency drills
7. مجوزها — historical permits
8. محیط‌زیست — environmental history
9. سایر — other historical HSE records

## Common fields
Where applicable:
- سال
- تاریخ
- شعبه/منطقه
- واحد
- کد پرسنلی
- نام و نام خانوادگی
- شماره/مرجع سند
- توضیحات

## Data entry rule
Copy historical values faithfully. Do not invent missing values. Leave unknown fields blank and explain them in توضیحات when useful.

## Import-side fields
The import engine, not the business user, adds:
- import_batch_id
- source_file
- source_sheet
- source_row
- historical classification
- mapping status
- validation status
- exception reason

## Special requirement: training hours
Training records must preserve the original course/date/person/hours information so annual and branch totals can be reconstructed after import.

## Special requirement: incidents
Historical incident records must preserve original incident date, branch/site, person when available, classification, consequence and source reference.

## Reconciliation
Every source row ends in exactly one controlled state:
IMPORTED | EXCEPTION | DUPLICATE_REVIEW | REJECTED

No silent loss.
