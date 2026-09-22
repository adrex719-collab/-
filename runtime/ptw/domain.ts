export type PermitStatus = "REQUESTED"|"PENDING_APPROVAL"|"ISSUED"|"ACTIVE"|"SUSPENDED"|"RESUMED"|"CLOSED"|"CANCELLED"|"EXPIRED";
export type PermitType = "COLD_WORK"|"HOT_WORK"|"CONFINED_SPACE"|"EXCAVATION";

export interface Permit {
  id:string;
  type:PermitType;
  location:string;
  organizationId?:string;
  regionId?:string;
  branchId:string;
  siteId?:string;
  unitId?:string;
  issuedAt?:string;
  workStartedAt?:string;
  status:PermitStatus;
  requiresLoto:boolean;
  lotoApplied:boolean;
  lotoReleased:boolean;
  requiredGasTest:boolean;
  gasTestPassed:boolean;
  authorizationApproved:boolean;
}
