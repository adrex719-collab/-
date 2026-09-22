# Runtime Boundary

## Source of Truth
GitHub is the canonical source for application code and Target Architecture.

## Runtime
Macaly is the execution/preview environment. It must not become a second manually maintained codebase.

## Flow
GitHub → controlled build/sync → Macaly Runtime

No feature is implemented twice. No production secrets are stored in GitHub.

## PTW
The server-side PTW transition guards are canonicalized here and must remain enforced at the runtime/backend boundary.
