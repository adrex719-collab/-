import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

const permitType = v.union(v.literal("COLD_WORK"), v.literal("HOT_WORK"), v.literal("CONFINED_SPACE"), v.literal("EXCAVATION"))
const permitStatus = v.union(
  v.literal("REQUESTED"), v.literal("PENDING_APPROVAL"), v.literal("ISSUED"),
  v.literal("ACTIVE"), v.literal("SUSPENDED"), v.literal("RESUMED"),
  v.literal("CLOSED"), v.literal("CANCELLED"), v.literal("EXPIRED")
)

type Status = "REQUESTED" | "PENDING_APPROVAL" | "ISSUED" | "ACTIVE" | "SUSPENDED" | "RESUMED" | "CLOSED" | "CANCELLED" | "EXPIRED"

function invalid(message: string): never { throw new Error(message) }

function guardTransition(status: Status, next: Status, p: {
  authorizationApproved: boolean; requiresLoto: boolean; lotoApplied: boolean
  lotoReleased: boolean; requiredGasTest: boolean; gasTestPassed: boolean
}) {
  const allowed: Record<Status, Status[]> = {
    REQUESTED: ["PENDING_APPROVAL", "CANCELLED"], PENDING_APPROVAL: ["ISSUED", "CANCELLED"],
    ISSUED: ["ACTIVE", "CANCELLED", "EXPIRED"], ACTIVE: ["SUSPENDED"],
    SUSPENDED: ["RESUMED", "CANCELLED"], RESUMED: ["CLOSED", "SUSPENDED"],
    CLOSED: [], CANCELLED: [], EXPIRED: []
  }
  if (!allowed[status].includes(next)) invalid(`انتقال ${status} → ${next} مجاز نیست.`)
  if (next === "ISSUED" && !p.authorizationApproved) invalid("صدور مجوز بدون Authorization مجاز نیست.")
  if (next === "ACTIVE") {
    if (!p.authorizationApproved) invalid("فعال‌سازی بدون Authorization مجاز نیست.")
    if (p.requiresLoto && !p.lotoApplied) invalid("فعال‌سازی تا اعمال LOTO مجاز نیست.")
    if (p.requiredGasTest && !p.gasTestPassed) invalid("فعال‌سازی تا تأیید Gas Test مجاز نیست.")
  }
  if (next === "CLOSED" && p.requiresLoto && !p.lotoReleased) invalid("بستن مجوز تا آزادسازی LOTO مجاز نیست.")
  if (next === "CLOSED" && status !== "RESUMED") invalid("بستن مجوز فقط پس از RESUMED مجاز است.")
  if (next === "RESUMED" && status !== "SUSPENDED") invalid("RESUMED فقط پس از SUSPENDED مجاز است.")
  if (next === "SUSPENDED" && status !== "ACTIVE") invalid("SUSPENDED فقط برای مجوز ACTIVE مجاز است.")
}

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => ctx.db.query("permits").withIndex("by_status").order("desc").take(Math.min(args.limit ?? 50, 100)),
})

export const create = mutation({
  args: {
    permitId: v.string(), type: permitType, location: v.string(),
    organizationId: v.optional(v.string()), regionId: v.optional(v.string()), branchId: v.optional(v.string()), siteId: v.optional(v.string()), unitId: v.optional(v.string()),
    requiresLoto: v.boolean(), requiredGasTest: v.boolean(),
    dataClass: v.union(v.literal("TEST/SEED"), v.literal("OPERATIONAL")),
  },
  handler: async (ctx, args) => {
    if (!args.branchId) invalid("ثبت Permit بدون Branch Scope مجاز نیست.")
    const duplicate = await ctx.db.query("permits").withIndex("by_permit_id", q => q.eq("permitId", args.permitId)).first()
    if (duplicate) invalid("شناسه Permit تکراری است.")
    const now = Date.now()
    return ctx.db.insert("permits", {
      ...args, status: "REQUESTED", authorizationApproved: false,
      lotoApplied: false, lotoReleased: false, gasTestPassed: false,
      createdAt: now, updatedAt: now,
    })
  },
})

export const updateState = mutation({
  args: {
    id: v.id("permits"), status: permitStatus, authorizationApproved: v.boolean(),
    lotoApplied: v.boolean(), lotoReleased: v.boolean(), gasTestPassed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const permit = await ctx.db.get(args.id)
    if (!permit) invalid("مجوز پیدا نشد.")
    guardTransition(permit.status, args.status, permit)
    if (args.authorizationApproved && !permit.authorizationApproved && permit.status !== "PENDING_APPROVAL") invalid("Authorization فقط در مرحله تأیید مجوز قابل ثبت است.")
    if (args.lotoApplied && !permit.lotoApplied && permit.status !== "ISSUED") invalid("LOTO فقط در مرحله ISSUED قابل اعمال است.")
    if (args.gasTestPassed && !permit.gasTestPassed && permit.status !== "ISSUED") invalid("Gas Test فقط در مرحله ISSUED قابل ثبت است.")
    if (args.lotoReleased && !permit.lotoReleased && permit.status !== "RESUMED") invalid("آزادسازی LOTO فقط پس از RESUMED مجاز است.")
    await ctx.db.patch(args.id, { status: args.status, authorizationApproved: args.authorizationApproved, lotoApplied: args.lotoApplied, lotoReleased: args.lotoReleased, gasTestPassed: args.gasTestPassed, updatedAt: Date.now() })
  },
})
