import { Permit, PermitStatus } from "./domain";

export function canActivate(p: Permit): boolean {
  return p.status === "ISSUED" && p.authorizationApproved &&
    (!p.requiresLoto || p.lotoReleased === false) &&
    (!p.requiredGasTest || p.gasTestPassed);
}

export function canClose(p: Permit): boolean {
  return ["ACTIVE","SUSPENDED","RESUMED"].includes(p.status) &&
    (!p.requiresLoto || p.lotoReleased);
}

export function startDeadlinePassed(p: Permit, now: Date): boolean {
  if (!p.issuedAt || p.workStartedAt) return false;
  return now.getTime() - new Date(p.issuedAt).getTime() > 2 * 60 * 60 * 1000;
}
