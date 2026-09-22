# Data Layer

The Data layer is the single persistence boundary for Target operational data.

## Rules
- one canonical store per platform capability
- schema follows Target Architecture
- every operational record is scope-aware where applicable
- HISTORICAL imports preserve source traceability
- TEST/SEED cannot silently become OPERATIONAL
- repositories do not become a second business-logic layer
