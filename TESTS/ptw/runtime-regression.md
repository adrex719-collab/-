# PTW Runtime Tests

The test contract verifies the separation between LOTO application (required before activation) and LOTO release (required before closure).

## Covered
- activation denied without applied LOTO
- activation allowed with applied LOTO + authorization + gas PASS
- two-hour reissue guard
- LOTO release only after activation
- close denied until LOTO is released
- close allowed after LOTO release

Data is synthetic TEST/SEED only.
