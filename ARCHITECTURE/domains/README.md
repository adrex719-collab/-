# DOMAIN Layer

Domains contain HSE business semantics and operational processes.

Canonical hierarchy:

DOMAIN → GROUP → MODULE → SUBMODULE

The frozen target has 29 DOMAIN, D01–D29. See DOMAIN-MANIFEST.md.

A domain may not create a parallel CORE engine. Shared concerns are delegated to CORE.

D08 — PTW is the first reference implementation. No subsequent domain is promoted without the same vertical-slice gate.
