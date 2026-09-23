import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"
import { requireScope, can, canTransition, canSeeRecordScope } from "./authz"

const permitType=v.union(v.literal("COLD_WORK"),v.literal("HOT_WORK"),v.literal("CONFINED_SPACE"),v.literal("EXCAVATION"),v.literal("ELECTRICAL"),v.literal("VEHICLE_ENTRY"),v.literal("ROAD_CLOSURE"),v.literal("RADIOGRAPHY"))
const permitStatus=v.union(v.literal("REQUESTED"),v.literal("PENDING_APPROVAL"),v.literal("ISSUED"),v.literal("ACTIVE"),v.literal("SUSPENDED"),v.literal("RESUMED"),v.literal("CLOSED"),v.literal("CANCELLED"),v.literal("EXPIRED"))
type Status="REQUESTED"|"PENDING_APPROVAL"|"ISSUED"|"ACTIVE"|"SUSPENDED"|"RESUMED"|"CLOSED"|"CANCELLED"|"EXPIRED"

const permitDoc=v.object({
  _id:v.id("permits"),_creationTime:v.number(),permitId:v.string(),
  organizationId:v.optional(v.string()),regionId:v.optional(v.string()),branchId:v.optional(v.string()),siteId:v.optional(v.string()),unitId:v.optional(v.string()),
  type:permitType,
  permitFamily:v.optional(v.union(v.literal("PRIMARY"),v.literal("SUPPLEMENTAL"),v.literal("SPECIALIZED"))),
  relationshipType:v.optional(v.union(v.literal("PRIMARY"),v.literal("SUPPLEMENTAL"),v.literal("SPECIALIZED"))),
  parentPermitId:v.optional(v.id("permits")),rootPermitId:v.optional(v.id("permits")),
  specializedProfile:v.optional(v.string()),ruleSetId:v.optional(v.string()),ruleSetVersion:v.optional(v.string()),
  effectiveProcedureId:v.optional(v.string()),effectiveProcedureRevision:v.optional(v.string()),
  location:v.string(),activityDescription:v.optional(v.string()),requester:v.optional(v.string()),responsiblePerson:v.optional(v.string()),contractor:v.optional(v.string()),workDate:v.optional(v.string()),shift:v.optional(v.string()),hazards:v.optional(v.array(v.string())),controls:v.optional(v.array(v.string())),ppe:v.optional(v.array(v.string())),startAt:v.optional(v.string()),endAt:v.optional(v.string()),excavationDurationHours:v.optional(v.number()),
  status:permitStatus,authorizationApproved:v.boolean(),requiresLoto:v.boolean(),lotoApplied:v.boolean(),lotoReleased:v.boolean(),requiredGasTest:v.boolean(),gasTestPassed:v.boolean(),
  lotoEvidence:v.optional(v.string()),gasTestEvidence:v.optional(v.string()),suspensionReason:v.optional(v.string()),closureNotes:v.optional(v.string()),
  dataClass:v.union(v.literal("TEST/SEED"),v.literal("OPERATIONAL")),createdAt:v.number(),updatedAt:v.number()
})
const legacyPermitDoc=v.object({_id:v.id("permits"),_creationTime:v.number(),permitId:v.string(),organizationId:v.optional(v.string()),regionId:v.optional(v.string()),branchId:v.optional(v.string()),siteId:v.optional(v.string()),unitId:v.optional(v.string()),type:v.union(v.literal("COLD_WORK"),v.literal("HOT_WORK"),v.literal("CONFINED_SPACE"),v.literal("EXCAVATION")),location:v.string(),status:permitStatus,authorizationApproved:v.boolean(),requiresLoto:v.boolean(),lotoApplied:v.boolean(),lotoReleased:v.boolean(),requiredGasTest:v.boolean(),gasTestPassed:v.boolean(),dataClass:v.union(v.literal("TEST/SEED"),v.literal("OPERATIONAL")),createdAt:v.number(),updatedAt:v.number()})
const accessResult=v.union(v.object({ok:v.literal(true),permits:v.array(permitDoc)}),v.object({ok:v.literal(false),code:v.string(),permits:v.array(permitDoc)}))

function guardTransition(status:Status,next:Status,p:any){
  const allowed:Record<Status,Status[]>={REQUESTED:["PENDING_APPROVAL","CANCELLED"],PENDING_APPROVAL:["ISSUED","CANCELLED"],ISSUED:["ACTIVE","CANCELLED","EXPIRED"],ACTIVE:["SUSPENDED"],SUSPENDED:["RESUMED","CANCELLED"],RESUMED:["CLOSED","SUSPENDED"],CLOSED:[],CANCELLED:[],EXPIRED:[]}
  if(!allowed[status].includes(next))return"INVALID_TRANSITION"
  if(next==="ISSUED"&&!p.authorizationApproved)return"AUTHORIZATION_REQUIRED"
  if(next==="ACTIVE"){
    if(!p.authorizationApproved)return"AUTHORIZATION_REQUIRED"
    if(p.requiresLoto&&!p.lotoApplied)return"LOTO_REQUIRED"
    if(p.requiredGasTest&&!p.gasTestPassed)return"GAS_TEST_REQUIRED"
  }
  if(next==="CLOSED"&&p.requiresLoto&&!p.lotoReleased)return"LOTO_RELEASE_REQUIRED"
  return null
}
function permissionFor(next:Status){
  if(next==="PENDING_APPROVAL")return"ptw.approve"
  if(next==="ISSUED")return"ptw.issue"
  if(next==="ACTIVE")return"ptw.activate"
  if(next==="SUSPENDED"||next==="RESUMED")return"ptw.suspend_resume"
  if(next==="CLOSED")return"ptw.close"
  if(next==="CANCELLED")return"ptw.cancel"
  return"ptw.activate"
}
function familyFor(type:string){
  return type==="ELECTRICAL"?"SUPPLEMENTAL":type==="RADIOGRAPHY"?"SPECIALIZED":"PRIMARY"
}

export const list=query({
  args:{limit:v.optional(v.number())},returns:v.array(legacyPermitDoc),
  handler:async(ctx,args)=>{
    const userId=await getAuthUserId(ctx);if(!userId)return[]
    const profile=await ctx.db.query("userProfiles").withIndex("by_user",q=>q.eq("userId",userId)).unique();if(!profile||!profile.active)return[]
    const rows=await ctx.db.query("permits").order("desc").take(Math.min(args.limit??50,100))
    const visible=profile.role==="CENTRAL_HSE"?rows:rows.filter(p=>!!p.branchId&&profile.branchIds.includes(p.branchId!))
    return visible.filter(p=>["COLD_WORK","HOT_WORK","CONFINED_SPACE","EXCAVATION"].includes(p.type)) as any
  }
})

export const create=mutation({
  args:{permitId:v.string(),type:permitType,location:v.string(),requiresLoto:v.boolean(),requiredGasTest:v.boolean(),dataClass:v.union(v.literal("TEST/SEED"),v.literal("OPERATIONAL"))},
  returns:v.id("permits"),handler:async()=>{throw new Error("Use createScoped: C03 server scope is required.")}
})
export const updateState=mutation({
  args:{id:v.id("permits"),status:permitStatus,authorizationApproved:v.boolean(),lotoApplied:v.boolean(),lotoReleased:v.boolean(),gasTestPassed:v.boolean()},
  returns:v.null(),handler:async()=>{throw new Error("Use updateStateScoped: C03 server scope is required.")}
})

export const listScoped=query({
  args:{organizationId:v.string(),regionId:v.optional(v.string()),branchId:v.string(),siteId:v.optional(v.string()),unitId:v.optional(v.string()),limit:v.optional(v.number())},
  returns:accessResult,
  handler:async(ctx,args)=>{
    const access=await requireScope(ctx,{organizationId:args.organizationId,regionId:args.regionId,branchId:args.branchId,siteId:args.siteId,unitId:args.unitId})
    if(!access.ok)return{ok:false as const,code:access.code,permits:[]}
    if(!can(access.profile,"ptw.read"))return{ok:false as const,code:"FORBIDDEN",permits:[]}
    const rows=await ctx.db.query("permits").withIndex("by_branch_status",q=>q.eq("branchId",args.branchId)).order("desc").take(Math.min(args.limit??50,100))
    return{ok:true as const,permits:rows.filter(p=>canSeeRecordScope(access.profile,p))}
  }
})

export const createScoped=mutation({
  args:{
    permitId:v.string(),type:permitType,location:v.string(),organizationId:v.string(),regionId:v.optional(v.string()),branchId:v.string(),siteId:v.optional(v.string()),unitId:v.optional(v.string()),
    parentPermitId:v.optional(v.id("permits")),specializedProfile:v.optional(v.string()),ruleSetId:v.optional(v.string()),ruleSetVersion:v.optional(v.string()),effectiveProcedureId:v.optional(v.string()),effectiveProcedureRevision:v.optional(v.string()),
    activityDescription:v.optional(v.string()),requester:v.optional(v.string()),responsiblePerson:v.optional(v.string()),contractor:v.optional(v.string()),workDate:v.optional(v.string()),shift:v.optional(v.string()),hazards:v.optional(v.array(v.string())),controls:v.optional(v.array(v.string())),ppe:v.optional(v.array(v.string())),startAt:v.optional(v.string()),endAt:v.optional(v.string()),excavationDurationHours:v.optional(v.number()),
    requiresLoto:v.boolean(),requiredGasTest:v.boolean(),dataClass:v.union(v.literal("TEST/SEED"),v.literal("OPERATIONAL"))
  },
  returns:v.any(),
  handler:async(ctx,args)=>{
    const access=await requireScope(ctx,{organizationId:args.organizationId,regionId:args.regionId,branchId:args.branchId,siteId:args.siteId,unitId:args.unitId})
    if(!access.ok||!can(access.profile,"ptw.create"))return{ok:false,code:access.ok?"FORBIDDEN":access.code}
    if(!args.location.trim()||!args.activityDescription?.trim()||!args.requester?.trim()||!args.responsiblePerson?.trim())return{ok:false,code:"REQUIRED_FIELDS_MISSING"}
    if(args.type==="EXCAVATION"&&!args.excavationDurationHours)return{ok:false,code:"EXCAVATION_DURATION_REQUIRED"}
    if(args.type==="EXCAVATION"&&args.regionId==="REG-ASALUYEH"&&args.excavationDurationHours!>12)return{ok:false,code:"MAX_DURATION_12H"}
    if(args.type==="EXCAVATION"&&args.regionId==="REG-MAHSHAR"&&args.excavationDurationHours!>8)return{ok:false,code:"MAX_DURATION_8H"}

    const family=familyFor(args.type)
    let rootPermitId:typeof args.parentPermitId=undefined
    if(args.type==="ELECTRICAL"){
      if(!args.parentPermitId)return{ok:false,code:"PARENT_PERMIT_REQUIRED"}
      const parent=await ctx.db.get(args.parentPermitId)
      if(!parent)return{ok:false,code:"PARENT_PERMIT_NOT_FOUND"}
      if(parent.branchId!==args.branchId||parent.organizationId!==args.organizationId)return{ok:false,code:"PARENT_SCOPE_DENIED"}
      if(parent.type==="ELECTRICAL"||parent.type==="RADIOGRAPHY")return{ok:false,code:"INVALID_PARENT_PERMIT"}
      if(parent.status==="CANCELLED"||parent.status==="EXPIRED")return{ok:false,code:"PARENT_NOT_ACTIVE"}
      rootPermitId=parent.rootPermitId??args.parentPermitId
    }
    if(args.type==="RADIOGRAPHY"&&args.specializedProfile!=="RADIOGRAPHY")return{ok:false,code:"RADIOGRAPHY_PROFILE_REQUIRED"}

    const duplicate=await ctx.db.query("permits").withIndex("by_permit_id",q=>q.eq("permitId",args.permitId)).first()
    if(duplicate)return{ok:false,code:"DUPLICATE_PERMIT"}
    const now=Date.now()
    const id=await ctx.db.insert("permits",{...args,permitFamily:family,relationshipType:family,parentPermitId:args.parentPermitId,rootPermitId,specializedProfile:args.specializedProfile,ruleSetId:args.ruleSetId,ruleSetVersion:args.ruleSetVersion,effectiveProcedureId:args.effectiveProcedureId,effectiveProcedureRevision:args.effectiveProcedureRevision,status:"REQUESTED",authorizationApproved:false,lotoApplied:false,lotoReleased:false,gasTestPassed:false,createdAt:now,updatedAt:now})
    return{ok:true,id}
  }
})

export const updateStateScoped=mutation({
  args:{id:v.id("permits"),organizationId:v.string(),regionId:v.optional(v.string()),branchId:v.string(),siteId:v.optional(v.string()),unitId:v.optional(v.string()),status:permitStatus,authorizationApproved:v.boolean(),lotoApplied:v.boolean(),lotoReleased:v.boolean(),gasTestPassed:v.boolean(),lotoEvidence:v.optional(v.string()),gasTestEvidence:v.optional(v.string()),suspensionReason:v.optional(v.string()),closureNotes:v.optional(v.string())},
  returns:v.any(),
  handler:async(ctx,args)=>{
    const access=await requireScope(ctx,{organizationId:args.organizationId,regionId:args.regionId,branchId:args.branchId,siteId:args.siteId,unitId:args.unitId});if(!access.ok)return{ok:false,code:access.code}
    const permit=await ctx.db.get(args.id);if(!permit)return{ok:false,code:"NOT_FOUND"}
    if(permit.branchId!==args.branchId||!canSeeRecordScope(access.profile,permit))return{ok:false,code:"SCOPE_DENIED"}
    if(!can(access.profile,permissionFor(args.status)))return{ok:false,code:"FORBIDDEN"}
    if(!canTransition(access.profile.role,permit.status,args.status))return{ok:false,code:"ROLE_TRANSITION_DENIED"}
    const guard=guardTransition(permit.status,args.status,permit);if(guard)return{ok:false,code:guard}
    if(args.authorizationApproved&&!permit.authorizationApproved&&permit.status!=="PENDING_APPROVAL")return{ok:false,code:"AUTHORIZATION_STAGE"}
    if(args.lotoApplied&&!permit.lotoApplied&&permit.status!=="ISSUED")return{ok:false,code:"LOTO_STAGE"}
    if(args.gasTestPassed&&!permit.gasTestPassed&&permit.status!=="ISSUED")return{ok:false,code:"GAS_TEST_STAGE"}
    if(args.lotoReleased&&!permit.lotoReleased&&permit.status!=="RESUMED")return{ok:false,code:"LOTO_RELEASE_STAGE"}
    if(args.lotoApplied&&!permit.lotoApplied&&!args.lotoEvidence?.trim())return{ok:false,code:"LOTO_EVIDENCE_REQUIRED"}
    if(args.gasTestPassed&&!permit.gasTestPassed&&!args.gasTestEvidence?.trim())return{ok:false,code:"GAS_TEST_EVIDENCE_REQUIRED"}
    if(args.status==="SUSPENDED"&&!args.suspensionReason?.trim())return{ok:false,code:"SUSPENSION_REASON_REQUIRED"}
    if(args.status==="CLOSED"&&!args.closureNotes?.trim())return{ok:false,code:"CLOSURE_NOTES_REQUIRED"}
    await ctx.db.patch(args.id,{status:args.status,authorizationApproved:args.authorizationApproved,lotoApplied:args.lotoApplied,lotoReleased:args.lotoReleased,gasTestPassed:args.gasTestPassed,lotoEvidence:args.lotoEvidence??permit.lotoEvidence,gasTestEvidence:args.gasTestEvidence??permit.gasTestEvidence,suspensionReason:args.suspensionReason??permit.suspensionReason,closureNotes:args.closureNotes??permit.closureNotes,updatedAt:Date.now()})
    return{ok:true}
  }
})
