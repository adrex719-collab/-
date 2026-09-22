import { Permit } from "./domain";

export function canActivate(p: Permit): boolean {
  return p.status === "ISSUED" && p.authorizationApproved &&
    (!p.requiresLoto || p.lotoApplied) &&
    (!p.requiredGasTest || p.gasTestPassed);
}

export function canSuspend(p: Permit): boolean {
  return p.status === "ACTIVE";
}

export function canResume(p: Permit): boolean {
  return p.status === "SUSPENDED";
}

export function canReleaseLoto(p: Permit): boolean {
  return (p.status === "ACTIVE" || p.status === "SUSPENDED" || p.status === "RESUMED") && p.lotoApplied;
}

export function canClose(p: Permit): boolean {
  return p.status === "RESUMED" && (!p.requiresLoto || p.lotoReleased);
}

export function startDeadlinePassed(p: Permit, now: Date): boolean {
  if (!p.issuedAt) return false;
  return now.getTime() > new Date(p.issuedAt).getTime() + 2 * 60 * 60 * 1000;
}
