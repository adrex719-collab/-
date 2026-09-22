import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

const role = v.union(
  v.literal("CENTRAL_HSE"), v.literal("BRANCH_MANAGER"), v.literal("HSE_SUPERVISOR"),
  v.literal("HSE_STAFF"), v.literal("OPERATIONS_STAFF"), v.literal("CONTRACTOR")
)

export default defineSchema({
  ...authTables,
  userProfiles: defineTable({
    userId: v.id("users"), role, organizationId: v.string(),
    regionIds: v.array(v.string()), branchIds: v.array(v.string()),
    siteIds: v.array(v.string()), unitIds: v.array(v.string()), active: v.boolean(),
  }).index("by_user", ["userId"]),
  permits: defineTable({
    permitId: v.string(), organizationId: v.optional(v.string()), regionId: v.optional(v.string()),
    branchId: v.optional(v.string()), siteId: v.optional(v.string()), unitId: v.optional(v.string()),
    type: v.union(v.literal("COLD_WORK"), v.literal("HOT_WORK"), v.literal("CONFINED_SPACE"), v.literal("EXCAVATION")),
    location: v.string(),
    status: v.union(v.literal("REQUESTED"), v.literal("PENDING_APPROVAL"), v.literal("ISSUED"), v.literal("ACTIVE"), v.literal("SUSPENDED"), v.literal("RESUMED"), v.literal("CLOSED"), v.literal("CANCELLED"), v.literal("EXPIRED")),
    authorizationApproved: v.boolean(), requiresLoto: v.boolean(), lotoApplied: v.boolean(), lotoReleased: v.boolean(),
    requiredGasTest: v.boolean(), gasTestPassed: v.boolean(),
    dataClass: v.union(v.literal("TEST/SEED"), v.literal("OPERATIONAL")),
    createdAt: v.number(), updatedAt: v.number(),
  }).index("by_permit_id", ["permitId"]).index("by_branch_status", ["branchId", "status"]),
})
