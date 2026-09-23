import { query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"

export const eligibilityDecision=v.union(
  v.literal("ELIGIBLE"),v.literal("INELIGIBLE"),v.literal("EXPIRED"),v.literal("REVOKED"),
  v.literal("OUT_OF_SCOPE"),v.literal("QUALIFICATION_MISSING"),v.literal("TRAINING_MISSING"),v.literal("AUTHORIZATION_MISSING")
)

function scopeMatch(a:any,p:any,args:any){
  if(a.organizationId!==args.organizationId)return false
  if(a.regionIds.length && !a.regionIds.includes(args.regionId))return false
  if(a.branchIds.length && !a.branchIds.includes(args.branchId))return false
  if(args.siteId && a.siteIds.length && !a.siteIds.includes(args.siteId))return false
  if(args.unitId && a.unitIds.length && !a.unitIds.includes(args.unitId))return false
  if(p.role!=="CENTRAL_HSE" && (!p.branchIds.includes(args.branchId)||(args.regionId&&!p.regionIds.includes(args.regionId))||(args.siteId&&!p.siteIds.includes(args.siteId))||(args.unitId&&!p.unitIds.includes(args.unitId))))return false
  return true
}

export async function evaluatePtwEligibility(ctx:any,args:any): Promise<any>{
  const callerUserId=await getAuthUserId(ctx)
  const userId=args.subjectUserId??callerUserId
  if(!userId)return{decision:"INELIGIBLE",missingQualifications:[],missingTraining:[],reason:"UNAUTHENTICATED"}
  const profile=await ctx.db.query("userProfiles").withIndex("by_user",q=>q.eq("userId",userId)).unique()
  if(!profile||!profile.active)return{decision:"INELIGIBLE",subjectUserId:userId,missingQualifications:[],missingTraining:[],reason:"PROFILE_MISSING"}
  const authorizationType=args.authorizationType??"PTW"
  const auths=await ctx.db.query("operationalAuthorizations").withIndex("by_subject_type",q=>q.eq("subjectUserId",userId).eq("authorizationType",authorizationType)).collect()
  const scoped=auths.filter(a=>scopeMatch(a,profile,args))
  const now=Date.now()
  const auth=scoped.find(a=>{
    if(a.status!=="ACTIVE" || !a.permitTypes.includes(args.permitType)) return false
    if(a.validFrom){const from=Date.parse(a.validFrom);if(Number.isFinite(from)&&now<from)return false}
    if(a.validUntil){const until=Date.parse(a.validUntil);if(Number.isFinite(until)&&now>until)return false}
    return true
  })
  if(!auth){
    const revoked=scoped.some(a=>a.status==="REVOKED")
    const expired=scoped.some(a=>a.status==="EXPIRED" || (a.status==="ACTIVE" && a.validUntil && Number.isFinite(Date.parse(a.validUntil)) && now>Date.parse(a.validUntil)))
    return{decision:revoked?"REVOKED":expired?"EXPIRED":"AUTHORIZATION_MISSING",subjectUserId:userId,missingQualifications:args.requiredQualificationRefs??[],missingTraining:args.requiredTrainingRefs??[],reason:"ACTIVE_PTW_AUTHORIZATION_NOT_FOUND"}
  }
  const missingQualifications=(args.requiredQualificationRefs??[]).filter((x:string)=>!auth.qualificationRefs.includes(x))
  const missingTraining=(args.requiredTrainingRefs??[]).filter((x:string)=>!auth.trainingRefs.includes(x))
  if(missingQualifications.length)return{decision:"QUALIFICATION_MISSING",subjectUserId:userId,authorizationId:auth._id,authorizationVersion:auth.version,missingQualifications,missingTraining,reason:"QUALIFICATION_REQUIREMENT_NOT_MET"}
  if(missingTraining.length)return{decision:"TRAINING_MISSING",subjectUserId:userId,authorizationId:auth._id,authorizationVersion:auth.version,missingQualifications,missingTraining,reason:"TRAINING_REQUIREMENT_NOT_MET"}
  return{decision:"ELIGIBLE",subjectUserId:userId,authorizationId:auth._id,authorizationVersion:auth.version,missingQualifications:[],missingTraining:[],reason:"ELIGIBLE"}
}

export const evaluateMyPtwEligibility=query({
  args:{subjectUserId:v.optional(v.id("users")),authorizationType:v.optional(v.string()),permitType:v.string(),organizationId:v.string(),regionId:v.optional(v.string()),branchId:v.string(),siteId:v.optional(v.string()),unitId:v.optional(v.string()),requiredQualificationRefs:v.optional(v.array(v.string())),requiredTrainingRefs:v.optional(v.array(v.string()))},
  returns:v.object({decision:eligibilityDecision,subjectUserId:v.optional(v.id("users")),authorizationId:v.optional(v.id("operationalAuthorizations")),authorizationVersion:v.optional(v.string()),missingQualifications:v.array(v.string()),missingTraining:v.array(v.string()),reason:v.string()}),
  handler:async(ctx,args)=>evaluatePtwEligibility(ctx,args)
})
