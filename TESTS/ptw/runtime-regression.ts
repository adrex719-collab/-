import { Permit } from "../runtime/ptw/domain";
import { canActivate, canClose, canReleaseLoto, startDeadlinePassed } from "../runtime/ptw/engine";

function assert(name:string, value:boolean){ if(!value) throw new Error("FAIL: "+name); console.log("PASS: "+name); }

const base: Permit = {
  id:"TEST-HOT-001", type:"HOT_WORK", location:"TEST-AREA",
  issuedAt:"2026-09-22T09:00:00Z", status:"ISSUED",
  requiresLoto:true, lotoApplied:false, lotoReleased:false,
  requiredGasTest:true, gasTestPassed:true, authorizationApproved:true
};

assert("activation denied before LOTO applied", !canActivate(base));
base.lotoApplied=true;
assert("activation allowed after LOTO applied", canActivate(base));
assert("2h reissue guard", startDeadlinePassed(base,new Date("2026-09-22T12:00:00Z")));
base.status="ACTIVE";
assert("LOTO release allowed after activation", canReleaseLoto(base));
assert("close denied before LOTO release", !canClose(base));
base.lotoReleased=true;
assert("close allowed after LOTO release", canClose(base));
console.log("PTW runtime regression: PASS");
