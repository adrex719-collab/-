import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { requireScope, can } from "./authz"

const permitType=v.union(v.literal("COLD_WORK"),v.literal("HOT_WORK"),v.literal("CONFINED_SPACE"),v.literal("EXCAVATION"))
const permitStatus=v.union(v.literal("REQUESTED"),v.literal("PENDING_APPROVAL"),v.literal("ISSUED"),v.literal("ACTIVE"),v.literal("SUSPENDED"),v.literal("RESUMED"),v.literal("CLOSED"),v.literal("CANCELLED"),v.literal("EXPIRED"))
type Status="REQUESTED"|"PENDING_APPROVAL"|"ISSUED"|"ACTIVE"|"SUSPENDED"|"RESUMED"|"CLOSED"|"CANCELLED"|"EXPIRED"

const permitDoc=v.object({
  _id:v.id("permits"),_creationTime:v.number(),permitId:v.string(),organizationId:v.optional(v.string()),regionId:v.optional(v.string()),branchId:v.optional(v.string()),siteId:v.optional(v.string()),unitId:v.optional(v.string()),
  type:permitType,location:v.string(),status:permitStatus,authorizationApproved:v.boolean(),requiresLoto:v.boolean(),lotoApplied:v.boolean(),lotoReleased:v.boolean(),requiredGasTest:v.boolean(),gasTestPassed:v.boolean(),dataClass:v.union(v.literal("TEST/SEED"),v.literal("OPERATIONAL")),createdAt:v.number(),updatedAt:v.number()
})
const accessResult=v.union(v.object({ok:v.literal(true),permits:v.array(permitDoc)}),v.object({ok:v.literal(false),code:v.string(),permits:v.array(permitDoc)}))

function guardTransition(status:Status,next:Status,p:any){
 const allowed:Record<Status,Status[]>={REQUESTED:["PENDING_APPROVAL","CANCELLED"],PENDING_APPROVAL:["ISSUED","CANCELLED"],ISSUED:["ACTIVE","CANCELLED","EXPIRED"],ACTIVE:["SUSPENDED"],SUSPENDED:["RESUMED","CANCELLED"],RESUMED:["CLOSED","SUSPENDED"],CLOSED:[],CANCELLED:[],EXPIRED:[]}
 if(!allowed[status].includes(next))return"INVALID_TRANSITION"
 if(next==="ISSUED"&&!p.authorizationApproved)return"AUTHORIZATION_REQUIRED"
 if(next==="ACTIVE"){if(!p.authorizationApproved)return"AUTHORIZATION_REQUIRED";if(p.requiresLoto&&!p.lotoApplied)return"LOTO_REQUIRED";if(p.requiredGasTest&&!p.gasTestPassed)return"GAS_TEST_REQUIRED"}
 if(next==="CLOSED"&&p.requiresLoto&&!p.lotoReleased)return"LOTO_RELEASE_REQUIRED"
 return null
}
function permissionFor(next:Status){if(next==="PENDING_APPROVAL")return"ptw.approve";if(next==="ISSUED")return"ptw.issue";if(next==="ACTIVE")return"ptw.activate";if(next==="SUSPENDED"||next==="RESUMED")return"ptw.suspend_resume";if(next==="CLOSED")return"ptw.close";if(next==="CANCELLED")return"ptw.cancel";return"ptw.activate"}

export const list=query({
 args:{limit:v.optional(v.number())},
 returns:v.array(permitDoc),
 handler:async(ctx,args)=>{
   const userId=await import("@convex-dev/auth/server").then(m=>m.getAuthUserId(ctx))
   if(!userId)return[]
   const profile=await ctx.db.query("userProfiles").withIndex("by_user",q=>q.eq("userId",userId)).unique()
   if(!profile||!profile.active)return[]
   const rows=profile.role==="CENTRAL_HSE"?await ctx.db.query("permits").order("desc").take(Math.min(args.limit??50,100)):await ctx.db.query("permits").order("desc").take(Math.min(args.limit??50,100))
   return rows.filter(p=>!!p.branchId&&profile.branchIds.includes(p.branchId!))
 },
})

export const create=mutation({
 args:{permitId:v.string(),type:permitType,location:v.string(),requiresLoto:v.boolean(),requiredGasTest:v.boolean(),dataClass:v.union(v.literal("TEST/SEED"),v.literal("OPERATIONAL"))},
 returns:v.id("permits"),
 handler:async(ctx,args)=>{
   throw new Error("Use createScoped: C03 server scope is required.")
 },
})

export const updateState=mutation({
 args:{id:v.id("permits"),status:permitStatus,authorizationApproved:v.boolean(),lotoApplied:v.boolean(),lotoReleased:v.boolean(),gasTestPassed:v.boolean()},
 returns:v.null(),
 handler:async()=>{ throw new Error("Use updateStateScoped: C03 server scope is required.") },
})

export const listScoped=query({
 args:{branchId:v.string(),limit:v.optional(v.number())},
 returns:accessResult,
 handler:async(ctx,args)=>{
  const access=await requireScope(ctx,args.branchId)
  if(!access.ok)return{ok:false as const,code:access.code,permits:[]}
  if(!can(access.profile,"ptw.read"))return{ok:false as const,code:"FORBIDDEN",permits:[]}
  const permits=await ctx.db.query("permits").withIndex("by_branch_status",q=>q.eq("branchId",args.branchId)).order("desc").take(Math.min(args.limit??50,100))
  return{ok:true as const,permits}
 }
})

export const createScoped=mutation({
 args:{permitId:v.string(),type:permitType,location:v.string(),organizationId:v.string(),regionId:v.optional(v.string()),branchId:v.string(),siteId:v.optional(v.string()),unitId:v.optional(v.string()),requiresLoto:v.boolean(),requiredGasTest:v.boolean(),dataClass:v.union(v.literal("TEST/SEED"),v.literal("OPERATIONAL"))},
 returns:v.any(),
 handler:async(ctx,args)=>{
  const access=await requireScope(ctx,args.branchId)
  if(!access.ok||!can(access.profile,"ptw.create"))return{ok:false,code:access.ok?"FORBIDDEN":access.code}
  const duplicate=await ctx.db.query("permits").withIndex("by_permit_id",q=>q.eq("permitId",args.permitId)).first()
  if(duplicate)return{ok:false,code:"DUPLICATE_PERMIT"}
  const now=Date.now()
  const id=await ctx.db.insert("permits",{...args,status:"REQUESTED",authorizationApproved:false,lotoApplied:false,lotoReleased:false,gasTestPassed:false,createdAt:now,updatedAt:now})
  return{ok:true,id}
 }
})

export const updateStateScoped=mutation({
 args:{id:v.id("permits"),branchId:v.string(),status:permitStatus,authorizationApproved:v.boolean(),lotoApplied:v.boolean(),lotoReleased:v.boolean(),gasTestPassed:v.boolean()},
 returns:v.any(),
 handler:async(ctx,args)=>{
  const access=await requireScope(ctx,args.branchId)
  if(!access.ok)return{ok:false,code:access.code}
  const permit=await ctx.db.get(args.id)
  if(!permit)return{ok:false,code:"NOT_FOUND"}
  if(permit.branchId!==args.branchId)return{ok:false,code:"SCOPE_DENIED"}
  if(!can(access.profile,permissionFor(args.status)))return{ok:false,code:"FORBIDDEN"}
  const guard=guardTransition(permit.status,args.status,permit)
  if(guard)return{ok:false,code:guard}
  if(args.authorizationApproved&&!permit.authorizationApproved&&permit.status!=="PENDING_APPROVAL")return{ok:false,code:"AUTHORIZATION_STAGE"}
  if(args.lotoApplied&&!permit.lotoApplied&&permit.status!=="ISSUED")return{ok:false,code:"LOTO_STAGE"}
  if(args.gasTestPassed&&!permit.gasTestPassed&&permit.status!=="ISSUED")return{ok:false,code:"GAS_TEST_STAGE"}
  if(args.lotoReleased&&!permit.lotoReleased&&permit.status!=="RESUMED")return{ok:false,code:"LOTO_RELEASE_STAGE"}
  await ctx.db.patch(args.id,{status:args.status,authorizationApproved:args.authorizationApproved,lotoApplied:args.lotoApplied,lotoReleased:args.lotoReleased,gasTestPassed:args.gasTestPassed,updatedAt:Date.now()})
  return{ok:true}
 }
})
