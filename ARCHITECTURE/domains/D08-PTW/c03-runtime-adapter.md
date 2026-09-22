# C03 Authorization Resolution — PTW Adapter

PTW must not trust a branch identifier supplied by the client as proof of authorization.

The runtime adapter must resolve:
- authenticated actor
- actor role
- organization scope
- authorized branch/region/site/unit scopes

before permitting protected PTW queries or mutations.

Until the identity/role provider is wired, the current branchId argument is treated only as a routing key, never as a security claim.

## Required production sequence
Authenticated actor → C03 scope resolution → PTW operation → C20 audit

## Temporary development rule
TEST/SEED scenarios may supply a branch fixture, but such fixtures cannot be promoted as production authorization.
