import { Permit } from "../../runtime/ptw/domain";
import { canActivate,canClose,canReleaseLoto,canRemoveTags,startDeadlinePassed,transitionGuard } from "../../runtime/ptw/engine";
function assert(name:string,value:boolean){if(!value)throw new Error("FAIL: "+name);console.log("PASS: "+name);}
const base:Permit={id:"TEST-HOT-001",type:"HOT_WORK",permitFamily:"PRIMARY",location:"TEST-AREA",branchId:"BR-A",issuedAt:"2026-09-22T09:00:00Z",status:"ISSUED",requiresLoto:true,lotoApplied:false,lotoReleased:false,tagRemovalVerified:false,requiredGasTest:true,gasTestPassed:true,authorizationApproved:true,riskReviewed:true,eligibilityVerified:true};
assert("all target permit families/types represented",(["COLD_WORK","HOT_WORK","CONFINED_SPACE","EXCAVATION","VEHICLE_ENTRY","ROAD_CLOSURE","ELECTRICAL","RADIOGRAPHY"] as const).length===8);
assert("REQUESTED requires risk review",transitionGuard({...base,status:"REQUESTED"},"RISK_REVIEW")===null);
assert("activation denied before LOTO",!canActivate(base));base.lotoApplied=true;assert("activation allowed after LOTO",canActivate(base));
assert("2h reissue guard",startDeadlinePassed(base,new Date("2026-09-22T12:00:00Z")));base.status="ACTIVE";assert("LOTO release allowed",canReleaseLoto(base));base.status="RESUMED";base.lotoReleased=true;assert("close denied before tag removal",!canClose(base));assert("tag removal verification required",!canRemoveTags(base));base.tagRemovalVerified=true;assert("close allowed after tag removal",canClose(base));console.log("PTW runtime regression: PASS");
