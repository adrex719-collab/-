import { Permit } from "./domain";
import { canActivate, canClose, canReleaseLoto, startDeadlinePassed } from "./engine";

export function runScenario(): string[] {
  const now = new Date("2026-09-22T12:00:00Z");
  const p: Permit = {
    id:"SEED-HOT-001", type:"HOT_WORK", location:"TEST-AREA", branchId:"BR-A", issuedAt:"2026-09-22T09:00:00Z",
    status:"ISSUED", requiresLoto:true, lotoApplied:true, lotoReleased:false,
    requiredGasTest:true, gasTestPassed:true, authorizationApproved:true
  };
  const results:string[]=[];
  results.push(canActivate(p) === true ? "PASS: activation requires applied LOTO" : "FAIL: activation guard");
  results.push(startDeadlinePassed(p, now) === true ? "PASS: 2h reissue guard" : "FAIL: 2h reissue guard");
  p.status="ACTIVE";
  results.push(canReleaseLoto(p) === true ? "PASS: release allowed after active" : "FAIL: LOTO release guard");
  results.push(canClose(p) === false ? "PASS: close blocked before LOTO release" : "FAIL: close guard");
  p.lotoReleased=true;
  results.push(canClose(p) === true ? "PASS: close allowed after release" : "FAIL: close after release");
  return results;
}
