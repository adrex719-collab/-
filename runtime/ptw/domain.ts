export type PermitStatus = "DRAFT"|"REQUESTED"|"RISK_REVIEW"|"PENDING_APPROVAL"|"ISSUED"|"ACTIVE"|"SUSPENDED"|"RESUMED"|"CLOSED"|"CANCELLED"|"EXPIRED";
export type PermitType = "COLD_WORK"|"HOT_WORK"|"CONFINED_SPACE"|"EXCAVATION";
export interface Permit { id:string; type:PermitType; location:string; issuedAt?:string; workStartedAt?:string; status:PermitStatus; requiresLoto:boolean; lotoReleased:boolean; requiredGasTest:boolean; gasTestPassed:boolean; authorizationApproved:boolean; }
