import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"

const roleMatrix: Record<string,string[]> = {
 CENTRAL_HSE:["ptw.read","ptw.create","ptw.risk_review","ptw.approve","ptw.issue","ptw.activate","ptw.suspend_resume","ptw.close","ptw.cancel"],
 BRANCH_MANAGER:["ptw.read","ptw.create","ptw.approve","ptw.issue","ptw.activate","ptw.suspend_resume","ptw.close","ptw.cancel"],
 HSE_SUPERVISOR:["ptw.read","ptw.create","ptw.approve","ptw.issue","ptw.activate","ptw.suspend_resume","ptw.close"],
 HSE_STAFF:["ptw.read","ptw.create"],
 OPERATIONS_STAFF:["ptw.read","ptw.create"],
 CONTRACTOR:["ptw.read","ptw.create"],
}
const transitions: Record<string,string[]> = {
 HSE_STAFF:["RISK_REVIEW","PENDING_APPROVAL"], OPERATIONS_STAFF:["RISK_REVIEW","PENDING_APPROVAL"], CONTRACTOR:["RISK_REVIEW","PENDING_APPROVAL"],
 HSE_SUPERVISOR:["PENDING_APPROVAL","ISSUED","ACTIVE","SUSPENDED","RESUMED","CLOSED"],
 BRANCH_MANAGER:["PENDING_APPROVAL","ISSUED","ACTIVE","SUSPENDED","RESUMED","CLOSED","CANCELLED"],
 CENTRAL_HSE:["PENDING_APPROVAL","ISSUED","ACTIVE","SUSPENDED","RESUMED","CLOSED","CANCELLED","EXPIRED"],
}

export const me=query({args:{},returns:v.any(),handler:async(ctx)=>{const userId=await getAuthUserId(ctx);if(!userId)return{authenticated:false};const profile=await ctx.db.query("userProfiles").withIndex("by_user",q=>q.eq("userId",userId)).unique();return{authenticated:true,profile:profile??null}}})

export const ensureTestProfile=mutation({args:{},returns:v.any(),handler:async(ctx)=>{const userId=await getAuthUserId(ctx);if(!userId)return{ok:false,code:"UNAUTHENTICATED"};const user=await ctx.db.get(userId);const existing=await ctx.db.query("userProfiles").withIndex("by_user",q=>q.eq("userId",userId)).unique();const ownerEmail=process.env.PLATFORM_OWNER_EMAIL;if(!existing){const owner=!!user?.email&&!!ownerEmail&&user.email.toLowerCase()===ownerEmail.toLowerCase();const profile={userId,role:(owner?"CENTRAL_HSE":"HSE_STAFF") as "CENTRAL_HSE"|"HSE_STAFF",organizationId:"ORG-DEMO",regionIds:["REG-DEMO"],branchIds:owner?["BR-A","BR-B","BR-C"]:["BR-A"],siteIds:["SITE-DEMO"],unitIds:["UNIT-DEMO"],active:true};const id=await ctx.db.insert("userProfiles",profile);return{ok:true,profile:{_id:id,...profile},created:true}}if(user?.email&&ownerEmail&&user.email.toLowerCase()===ownerEmail.toLowerCase()&&existing.role!=="CENTRAL_HSE"){await ctx.db.patch(existing._id,{role:"CENTRAL_HSE",branchIds:["BR-A","BR-B","BR-C"],active:true});return{ok:true,created:false,promoted:true}}return{ok:true,profile:existing,created:false}}})

/**
 * توضیح ساده: این تابع تنها مرجع کنترل دسترسی سلسله‌مراتبی است
 * (Organization → Region → Branch → Site → Unit). قبلاً فقط Branch
 * چک می‌شد؛ حالا هر سطحی که در scope داده شود، باید با پروفایل کاربر
 * مطابقت داشته باشد. CENTRAL_HSE از همه‌ی این محدودیت‌ها معاف است
 * (دسترسی کل سازمان). هیچ منطق Authorization موازی جای دیگری تعریف
 * نشود؛ همه‌چیز باید از همین‌جا عبور کند.
 */
export type ScopeRequest = {
  organizationId: string
  regionId?: string
  branchId: string
  siteId?: string
  unitId?: string
}

export async function requireScope(ctx:any, scope: ScopeRequest){
  const userId=await getAuthUserId(ctx)
  if(!userId) return {ok:false as const, code:"UNAUTHENTICATED" as const}
  const profile=await ctx.db.query("userProfiles").withIndex("by_user",(q:any)=>q.eq("userId",userId)).unique()
  if(!profile||!profile.active) return {ok:false as const, code:"FORBIDDEN" as const}
  if(profile.role==="CENTRAL_HSE") return {ok:true as const, userId, profile}

  if(profile.organizationId!==scope.organizationId) return {ok:false as const, code:"ORGANIZATION_SCOPE_DENIED" as const}
  if(!profile.branchIds.includes(scope.branchId)) return {ok:false as const, code:"BRANCH_SCOPE_DENIED" as const}
  if(scope.regionId && !profile.regionIds.includes(scope.regionId)) return {ok:false as const, code:"REGION_SCOPE_DENIED" as const}
  if(scope.siteId && !profile.siteIds.includes(scope.siteId)) return {ok:false as const, code:"SITE_SCOPE_DENIED" as const}
  if(scope.unitId && !profile.unitIds.includes(scope.unitId)) return {ok:false as const, code:"UNIT_SCOPE_DENIED" as const}
  return {ok:true as const, userId, profile}
}

/**
 * برای بررسی قابلیت‌دیدن یک رکورد موجود (مثلاً یک ردیف permit) در برابر
 * پروفایل کاربر - وقتی رکورد خودش regionId/siteId/unitId دارد. این با
 * requireScope فرق دارد: requireScope ورودی درخواست را چک می‌کند،
 * canSeeRecordScope خروجی/رکورد را چک می‌کند (برای فیلتر Read Visibility).
 */
export function canSeeRecordScope(profile:{role:string;organizationId:string;regionIds:string[];branchIds:string[];siteIds:string[];unitIds:string[]}, record:{organizationId?:string;regionId?:string;branchId?:string;siteId?:string;unitId?:string}){
  if(profile.role==="CENTRAL_HSE") return true
  if(record.organizationId && record.organizationId!==profile.organizationId) return false
  if(record.branchId && !profile.branchIds.includes(record.branchId)) return false
  if(record.regionId && !profile.regionIds.includes(record.regionId)) return false
  if(record.siteId && !profile.siteIds.includes(record.siteId)) return false
  if(record.unitId && !profile.unitIds.includes(record.unitId)) return false
  return true
}

export function can(profile:{role:string},permission:string){return(roleMatrix[profile.role]??[]).includes(permission)}
export function canTransition(role:string,_from:string,to:string){return(transitions[role]??[]).includes(to)}
