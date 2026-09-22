# Application Layer

The Application layer orchestrates use cases without owning reusable engines.

## Responsibilities
- receive commands/queries
- resolve authenticated actor and authorized scope through C03
- invoke Domain services
- invoke CORE workflow/rules where required
- persist through the Target data boundary
- emit audit/evidence events

## Prohibitions
- no duplicate authorization engine
- no direct UI security decisions
- no domain-specific copy of CORE engines
