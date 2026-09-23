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
    userId: v.id("users"), identitySubject: v.optional(v.string()),
    role, organizationId: v.string(),
    regionIds: v.array(v.string()), branchIds: v.array(v.string()),
    siteIds: v.array(v.string()), unitIds: v.array(v.string()), active: v.boolean(),
  }).index("by_user", ["userId"]).index("by_identity_subject", ["identitySubject"]),
  permits: defineTable({
    permitId: v.string(), organizationId: v.optional(v.string()), regionId: v.optional(v.string()),
    branchId: v.optional(v.string()), siteId: v.optional(v.string()), unitId: v.optional(v.string()),
    type: v.union(v.literal("COLD_WORK"), v.literal("HOT_WORK"), v.literal("CONFINED_SPACE"), v.literal("EXCAVATION"), v.literal("ELECTRICAL"), v.literal("VEHICLE_ENTRY"), v.literal("ROAD_CLOSURE"), v.literal("RADIOGRAPHY")),
    permitFamily: v.optional(v.union(v.literal("PRIMARY"), v.literal("SUPPLEMENTAL"), v.literal("SPECIALIZED"))),
    relationshipType: v.optional(v.union(v.literal("PRIMARY"), v.literal("SUPPLEMENTAL"), v.literal("SPECIALIZED"))),
    parentPermitId: v.optional(v.id("permits")),
    rootPermitId: v.optional(v.id("permits")),
    specializedProfile: v.optional(v.string()),
    ruleSetId: v.optional(v.string()),
    ruleSetVersion: v.optional(v.string()),
    effectiveProcedureId: v.optional(v.string()),
    effectiveProcedureRevision: v.optional(v.string()),
    location: v.string(), activityDescription: v.optional(v.string()), requester: v.optional(v.string()),
    responsiblePerson: v.optional(v.string()), contractor: v.optional(v.string()), workDate: v.optional(v.string()),
    shift: v.optional(v.string()), hazards: v.optional(v.array(v.string())), controls: v.optional(v.array(v.string())),
    ppe: v.optional(v.array(v.string())), startAt: v.optional(v.string()), endAt: v.optional(v.string()),
    excavationDurationHours: v.optional(v.number()),
    status: v.union(v.literal("REQUESTED"), v.literal("PENDING_APPROVAL"), v.literal("ISSUED"), v.literal("ACTIVE"), v.literal("SUSPENDED"), v.literal("RESUMED"), v.literal("CLOSED"), v.literal("CANCELLED"), v.literal("EXPIRED")),
    authorizationApproved: v.boolean(), requiresLoto: v.boolean(), lotoApplied: v.boolean(), lotoReleased: v.boolean(),
    requiredGasTest: v.boolean(), gasTestPassed: v.boolean(),
    lotoEvidence: v.optional(v.string()), gasTestEvidence: v.optional(v.string()),
    suspensionReason: v.optional(v.string()), closureNotes: v.optional(v.string()),
    dataClass: v.union(v.literal("TEST/SEED"), v.literal("OPERATIONAL")),
    createdAt: v.number(), updatedAt: v.number(),
  }).index("by_permit_id", ["permitId"]).index("by_branch_status", ["branchId", "status"]),
})