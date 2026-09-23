import { Permit, PermitStatus } from "./domain";
export const canRiskReview=(p:Permit)=>p.status==="REQUESTED";
export const canApprove=(p:Permit)=>p.status==="RISK_REVIEW"&&p.riskReviewed&&p.eligibilityVerified;
export const canIssue=(p:Permit)=>p.status==="PENDING_APPROVAL"&&p.authorizationApproved;
export const canActivate=(p:Permit)=>p.status==="ISSUED"&&p.authorizationApproved&&(!p.requiresLoto||p.lotoApplied)&&(!p.requiredGasTest||p.gasTestPassed);
export const canSuspend=(p:Permit)=>p.status==="ACTIVE";
export const canResume=(p:Permit)=>p.status==="SUSPENDED";
export const canReleaseLoto=(p:Permit)=>(p.status==="ACTIVE"||p.status==="SUSPENDED"||p.status==="RESUMED")&&p.lotoApplied;
export const canRemoveTags=(p:Permit)=>p.status==="RESUMED"&&(!p.requiresLoto||p.lotoReleased);
export const canClose=(p:Permit)=>canRemoveTags(p)&&p.tagRemovalVerified;
export function startDeadlinePassed(p:Permit,now:Date){return !!p.issuedAt&&now.getTime()>new Date(p.issuedAt).getTime()+2*60*60*1000;}
export function transitionGuard(p:Permit,next:PermitStatus):string|null{
 const allowed:Record<PermitStatus,PermitStatus[]>={REQUESTED:["RISK_REVIEW","CANCELLED"],RISK_REVIEW:["PENDING_APPROVAL","CANCELLED"],PENDING_APPROVAL:["ISSUED","CANCELLED"],ISSUED:["ACTIVE","CANCELLED","EXPIRED"],ACTIVE:["SUSPENDED"],SUSPENDED:["RESUMED","CANCELLED"],RESUMED:["CLOSED","SUSPENDED"],CLOSED:[],CANCELLED:[],EXPIRED:[]};
 return allowed[p.status].includes(next)?null:"INVALID_TRANSITION";
}