export type PermitStatus = "REQUESTED"|"RISK_REVIEW"|"PENDING_APPROVAL"|"ISSUED"|"ACTIVE"|"SUSPENDED"|"RESUMED"|"CLOSED"|"CANCELLED"|"EXPIRED";
export type PermitFamily = "PRIMARY"|"SUPPLEMENTAL"|"SPECIALIZED";
export type PermitType = "COLD_WORK"|"HOT_WORK"|"CONFINED_SPACE"|"EXCAVATION"|"VEHICLE_ENTRY"|"ROAD_CLOSURE"|"ELECTRICAL"|"RADIOGRAPHY";

export interface Permit {
  id:string; type:PermitType; permitFamily:PermitFamily; location:string;
  organizationId?:string; regionId?:string; branchId:string; siteId?:string; unitId?:string;
  parentPermitId?:string; rootPermitId?:string; specializedProfile?:string;
  ruleSetId?:string; ruleSetVersion?:string; effectiveProcedureId?:string; effectiveProcedureRevision?:string;
  issuedAt?:string; workStartedAt?:string; status:PermitStatus;
  requiresLoto:boolean; lotoApplied:boolean; lotoReleased:boolean; tagRemovalVerified:boolean;
  requiredGasTest:boolean; gasTestPassed:boolean; authorizationApproved:boolean;
  riskReviewed:boolean; eligibilityVerified:boolean;
}