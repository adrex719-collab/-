import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,
  permits: defineTable({
    permitId: v.string(),
    type: v.union(v.literal("COLD_WORK"), v.literal("HOT_WORK"), v.literal("CONFINED_SPACE"), v.literal("EXCAVATION")),
    location: v.string(),
    status: v.union(
      v.literal("REQUESTED"), v.literal("PENDING_APPROVAL"), v.literal("ISSUED"),
      v.literal("ACTIVE"), v.literal("SUSPENDED"), v.literal("RESUMED"),
      v.literal("CLOSED"), v.literal("CANCELLED"), v.literal("EXPIRED")
    ),
    authorizationApproved: v.boolean(), requiresLoto: v.boolean(), lotoApplied: v.boolean(),
    lotoReleased: v.boolean(), requiredGasTest: v.boolean(), gasTestPassed: v.boolean(),
    dataClass: v.union(v.literal("TEST/SEED"), v.literal("OPERATIONAL")),
    createdAt: v.number(), updatedAt: v.number(),
  }).index("by_permit_id", ["permitId"]).index("by_status", ["status"]),
})
