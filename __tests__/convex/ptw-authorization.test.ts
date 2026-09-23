import { describe, it, expect } from "vitest"
import { convexTest } from "convex-test"
import schema from "../../convex/schema"
import { api } from "../../convex/_generated/api"

function makeT(){ return convexTest(schema, import.meta.glob("../../convex/**/*.*s")) }

const FULL_SCOPE = { organizationId:"ORG-DEMO", regionId:"REG-DEMO", branchId:"BR-A", siteId:"SITE-DEMO", unitId:"UNIT-DEMO" }

async function seedProfile(t:any, role:"CENTRAL_HSE"|"BRANCH_MANAGER"|"HSE_SUPERVISOR"|"HSE_STAFF"|"OPERATIONS_STAFF"|"CONTRACTOR", scope:{organizationId:string;regionIds:string[];branchIds:string[];siteIds:string[];unitIds:string[]}){
  return await t.run(async(ctx:any)=>{
    const userId=await ctx.db.insert("users",{})
    await ctx.db.insert("userProfiles",{userId,identitySubject:userId,role,organizationId:scope.organizationId,regionIds:scope.regionIds,branchIds:scope.branchIds,siteIds:scope.siteIds,unitIds:scope.unitIds,active:true})
    return userId
  })
}

const FULL_MATCH = { organizationId:"ORG-DEMO", regionIds:["REG-DEMO"], branchIds:["BR-A"], siteIds:["SITE-DEMO"], unitIds:["UNIT-DEMO"] }

describe("D08 PTW C03 authorization boundary",()=>{
 it("denies unauthenticated branch reads",async()=>{
   const t=makeT()
   const result=await t.query(api.permits.listScoped,FULL_SCOPE)
   expect(result).toMatchObject({ok:false,code:"UNAUTHENTICATED"})
 })
 it("denies authenticated user outside branch scope",async()=>{
   const t=makeT(); const user=await seedProfile(t,"HSE_STAFF",{...FULL_MATCH,branchIds:["BR-B"]})
   const result=await t.withIdentity({subject:user}).query(api.permits.listScoped,FULL_SCOPE)
   expect(result).toMatchObject({ok:false,code:"BRANCH_SCOPE_DENIED"})
 })
 it("allows read inside full authorized scope",async()=>{
   const t=makeT(); const user=await seedProfile(t,"HSE_STAFF",FULL_MATCH)
   const result=await t.withIdentity({subject:user}).query(api.permits.listScoped,FULL_SCOPE)
   expect(result).toMatchObject({ok:true,permits:[]})
 })
 it("enforces role permission on PTW creation",async()=>{
   const t=makeT(); const user=await seedProfile(t,"CONTRACTOR",FULL_MATCH)
   const result=await t.withIdentity({subject:user}).mutation(api.permits.createScoped,{permitId:"T-001",type:"HOT_WORK",location:"AREA-A",...FULL_SCOPE,activityDescription:"Hot work",requester:"R-1",responsiblePerson:"RP-1",requiresLoto:true,requiredGasTest:true,dataClass:"OPERATIONAL"})
   expect(result).toMatchObject({ok:true})
 })

 // --- Org/Region/Site/Unit DENY matrix (this closes the "branch-only" gap) ---
 it("denies wrong organization",async()=>{
   const t=makeT(); const user=await seedProfile(t,"HSE_STAFF",{...FULL_MATCH,organizationId:"ORG-OTHER"})
   const result=await t.withIdentity({subject:user}).query(api.permits.listScoped,FULL_SCOPE)
   expect(result).toMatchObject({ok:false,code:"ORGANIZATION_SCOPE_DENIED"})
 })
 it("denies wrong region",async()=>{
   const t=makeT(); const user=await seedProfile(t,"HSE_STAFF",{...FULL_MATCH,regionIds:["REG-OTHER"]})
   const result=await t.withIdentity({subject:user}).query(api.permits.listScoped,FULL_SCOPE)
   expect(result).toMatchObject({ok:false,code:"REGION_SCOPE_DENIED"})
 })
 it("denies wrong site",async()=>{
   const t=makeT(); const user=await seedProfile(t,"HSE_STAFF",{...FULL_MATCH,siteIds:["SITE-OTHER"]})
   const result=await t.withIdentity({subject:user}).query(api.permits.listScoped,FULL_SCOPE)
   expect(result).toMatchObject({ok:false,code:"SITE_SCOPE_DENIED"})
 })
 it("denies wrong unit",async()=>{
   const t=makeT(); const user=await seedProfile(t,"HSE_STAFF",{...FULL_MATCH,unitIds:["UNIT-OTHER"]})
   const result=await t.withIdentity({subject:user}).query(api.permits.listScoped,FULL_SCOPE)
   expect(result).toMatchObject({ok:false,code:"UNIT_SCOPE_DENIED"})
 })
 it("CENTRAL_HSE bypasses all scope restrictions",async()=>{
   const t=makeT(); const user=await seedProfile(t,"CENTRAL_HSE",{organizationId:"ORG-OTHER",regionIds:[],branchIds:[],siteIds:[],unitIds:[]})
   const result=await t.withIdentity({subject:user}).query(api.permits.listScoped,FULL_SCOPE)
   expect(result).toMatchObject({ok:true})
 })

 // --- Read-visibility (record-level) filtering: reader has branch access but NOT the record's site ---
 // creator is CENTRAL_HSE so it can legitimately author a record tagged with a site outside the
 // normal demo scope (a regular-scope user could never author it in the first place - requireScope
 // would already reject that at create time, which is correct and covered implicitly above).
 it("filters out a permit whose site is outside the reader's site scope even with correct branch",async()=>{
   const t=makeT()
   const creator=await seedProfile(t,"CENTRAL_HSE",{organizationId:"ORG-DEMO",regionIds:[],branchIds:[],siteIds:[],unitIds:[]})
   const created=await t.withIdentity({subject:creator}).mutation(api.permits.createScoped,{permitId:"SITE-VIS-001",type:"COLD_WORK",location:"AREA-B",...FULL_SCOPE,siteId:"SITE-OTHER",activityDescription:"Cold work",requester:"R-1",responsiblePerson:"RP-1",requiresLoto:false,requiredGasTest:false,dataClass:"OPERATIONAL"})
   expect(created).toMatchObject({ok:true})
   const reader=await seedProfile(t,"HSE_STAFF",FULL_MATCH) // has BR-A but NOT SITE-OTHER
   const result:any=await t.withIdentity({subject:reader}).query(api.permits.listScoped,FULL_SCOPE)
   expect(result.ok).toBe(true)
   expect(result.permits.find((p:any)=>p.permitId==="SITE-VIS-001")).toBeUndefined()
 })
 it("shows a permit whose site matches the reader's site scope",async()=>{
   const t=makeT()
   const creator=await seedProfile(t,"HSE_SUPERVISOR",FULL_MATCH)
   await t.withIdentity({subject:creator}).mutation(api.permits.createScoped,{permitId:"SITE-VIS-002",type:"COLD_WORK",location:"AREA-B",...FULL_SCOPE,activityDescription:"Cold work",requester:"R-1",responsiblePerson:"RP-1",requiresLoto:false,requiredGasTest:false,dataClass:"OPERATIONAL"})
   const reader=await seedProfile(t,"HSE_STAFF",FULL_MATCH)
   const result:any=await t.withIdentity({subject:reader}).query(api.permits.listScoped,FULL_SCOPE)
   expect(result.permits.find((p:any)=>p.permitId==="SITE-VIS-002")).toBeDefined()
 })
})


describe("C11 PTW eligibility evaluator",()=>{
 it("does not manufacture eligibility without a centralized operational authorization",async()=>{
   const t=makeT(); const user=await seedProfile(t,"HSE_STAFF",FULL_MATCH)
   const result=await t.withIdentity({subject:user}).query(api.authorization.evaluateMyPtwEligibility,{permitType:"HOT_WORK",...FULL_SCOPE})
   expect(result.decision).toBe("AUTHORIZATION_MISSING")
 })
 it("returns eligible only from an active centralized PTW authorization",async()=>{
   const t=makeT(); const user=await seedProfile(t,"HSE_STAFF",FULL_MATCH)
   await t.run(async(ctx:any)=>ctx.db.insert("operationalAuthorizations",{subjectUserId:user,organizationId:"ORG-DEMO",regionIds:["REG-DEMO"],branchIds:["BR-A"],siteIds:["SITE-DEMO"],unitIds:["UNIT-DEMO"],authorizationType:"PTW",permitTypes:["HOT_WORK"],qualificationRefs:[],trainingRefs:[],status:"ACTIVE",evidenceRefs:["AUTH-EVID-1"],version:"1",updatedAt:Date.now()}))
   const result=await t.withIdentity({subject:user}).query(api.authorization.evaluateMyPtwEligibility,{permitType:"HOT_WORK",...FULL_SCOPE})
   expect(result.decision).toBe("ELIGIBLE")
   expect(result.authorizationVersion).toBe("1")
 })
 it("detects missing qualification and training requirements",async()=>{
   const t=makeT(); const user=await seedProfile(t,"HSE_STAFF",FULL_MATCH)
   await t.run(async(ctx:any)=>ctx.db.insert("operationalAuthorizations",{subjectUserId:user,organizationId:"ORG-DEMO",regionIds:["REG-DEMO"],branchIds:["BR-A"],siteIds:["SITE-DEMO"],unitIds:["UNIT-DEMO"],authorizationType:"PTW",permitTypes:["CONFINED_SPACE"],qualificationRefs:["Q-CS"],trainingRefs:["T-CS"],status:"ACTIVE",evidenceRefs:["AUTH-EVID-2"],version:"2",updatedAt:Date.now()}))
   const q=await t.withIdentity({subject:user}).query(api.authorization.evaluateMyPtwEligibility,{permitType:"CONFINED_SPACE",...FULL_SCOPE,requiredQualificationRefs:["Q-CS","Q-GAS"],requiredTrainingRefs:["T-CS","T-REFRESH"]})
   expect(q.decision).toBe("QUALIFICATION_MISSING")
 })
})


describe("D08 server-enforced eligibility, approval authorization and SoD",()=>{
 it("requires requester eligibility before approval queue",async()=>{
   const t=makeT(); const user=await seedProfile(t,"CENTRAL_HSE",FULL_MATCH)
   const created=await t.withIdentity({subject:user}).mutation(api.permits.createScoped,{permitId:"ELIG-GATE-001",type:"HOT_WORK",location:"AREA-A",...FULL_SCOPE,activityDescription:"Hot work",requester:"Requester",responsiblePerson:"RP",requiresLoto:false,requiredGasTest:false,dataClass:"OPERATIONAL"})
   expect(created).toMatchObject({ok:true})
   const row:any=await t.withIdentity({subject:user}).query(api.permits.listScoped,FULL_SCOPE)
   const permit=row.permits.find((p:any)=>p.permitId==="ELIG-GATE-001")
   const pending=await t.withIdentity({subject:user}).mutation(api.permits.updateStateScoped,{id:permit._id,...FULL_SCOPE,status:"RISK_REVIEW",authorizationApproved:false,lotoApplied:false,lotoReleased:false,gasTestPassed:false,tagRemovalVerified:false,riskReviewed:true})
   expect(pending).toMatchObject({ok:true})
   const blocked=await t.withIdentity({subject:user}).mutation(api.permits.updateStateScoped,{id:permit._id,...FULL_SCOPE,status:"PENDING_APPROVAL",authorizationApproved:false,lotoApplied:false,lotoReleased:false,gasTestPassed:false,tagRemovalVerified:false,riskReviewed:true})
   expect(blocked).toMatchObject({ok:false,code:"ACTIVE_PTW_AUTHORIZATION_NOT_FOUND"})
 })
 it("requires a separate approver authorization and rejects requester-as-approver",async()=>{
   const t=makeT(); const requester=await seedProfile(t,"CENTRAL_HSE",FULL_MATCH); const approver=await seedProfile(t,"HSE_SUPERVISOR",FULL_MATCH)
   await t.run(async(ctx:any)=>{
     await ctx.db.insert("operationalAuthorizations",{subjectUserId:requester,organizationId:"ORG-DEMO",regionIds:["REG-DEMO"],branchIds:["BR-A"],siteIds:["SITE-DEMO"],unitIds:["UNIT-DEMO"],authorizationType:"PTW",permitTypes:["HOT_WORK"],qualificationRefs:[],trainingRefs:[],status:"ACTIVE",evidenceRefs:["REQ-AUTH"],version:"1",updatedAt:Date.now()})
     await ctx.db.insert("operationalAuthorizations",{subjectUserId:approver,organizationId:"ORG-DEMO",regionIds:["REG-DEMO"],branchIds:["BR-A"],siteIds:["SITE-DEMO"],unitIds:["UNIT-DEMO"],authorizationType:"PTW_APPROVER",permitTypes:["HOT_WORK"],qualificationRefs:[],trainingRefs:[],status:"ACTIVE",evidenceRefs:["APR-AUTH"],version:"3",updatedAt:Date.now()})
   })
   const created=await t.withIdentity({subject:requester}).mutation(api.permits.createScoped,{permitId:"SOD-001",type:"HOT_WORK",location:"AREA-A",...FULL_SCOPE,activityDescription:"Hot work",requester:"Requester",responsiblePerson:"RP",requiresLoto:false,requiredGasTest:false,dataClass:"OPERATIONAL"})
   expect(created).toMatchObject({ok:true})
   const row:any=await t.withIdentity({subject:requester}).query(api.permits.listScoped,FULL_SCOPE); const id=row.permits.find((p:any)=>p.permitId==="SOD-001")._id
   await t.withIdentity({subject:requester}).mutation(api.permits.updateStateScoped,{id,...FULL_SCOPE,status:"RISK_REVIEW",authorizationApproved:false,lotoApplied:false,lotoReleased:false,gasTestPassed:false,tagRemovalVerified:false,riskReviewed:true})
   await t.withIdentity({subject:requester}).mutation(api.permits.updateStateScoped,{id,...FULL_SCOPE,status:"PENDING_APPROVAL",authorizationApproved:false,lotoApplied:false,lotoReleased:false,gasTestPassed:false,tagRemovalVerified:false,riskReviewed:true})
   const sod=await t.withIdentity({subject:requester}).mutation(api.permits.updateStateScoped,{id,...FULL_SCOPE,status:"ISSUED",authorizationApproved:false,lotoApplied:false,lotoReleased:false,gasTestPassed:false,tagRemovalVerified:false,riskReviewed:true})
   expect(sod).toMatchObject({ok:false,code:"SOD_REQUESTER_CANNOT_APPROVE"})
   const issued=await t.withIdentity({subject:approver}).mutation(api.permits.updateStateScoped,{id,...FULL_SCOPE,status:"ISSUED",authorizationApproved:false,lotoApplied:false,lotoReleased:false,gasTestPassed:false,tagRemovalVerified:false,riskReviewed:true})
   expect(issued).toMatchObject({ok:true})
 })
})
