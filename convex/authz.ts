import { query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return { authenticated: false as const }
    const profile = await ctx.db.query("userProfiles").withIndex("by_user", q => q.eq("userId", userId)).unique()
    if (!profile || !profile.active) return { authenticated: true as const, authorized: false as const }
    return { authenticated: true as const, authorized: true as const, ...profile }
  },
})

export async function requireScope(ctx: any, branchId: string) {
  const userId = await getAuthUserId(ctx)
  if (!userId) return { ok: false as const, code: "UNAUTHENTICATED" as const }
  const profile = await ctx.db.query("userProfiles").withIndex("by_user", (q: any) => q.eq("userId", userId)).unique()
  if (!profile || !profile.active) return { ok: false as const, code: "FORBIDDEN" as const }
  const allowed = profile.role === "CENTRAL_HSE" || profile.branchIds.includes(branchId)
  if (!allowed) return { ok: false as const, code: "SCOPE_DENIED" as const }
  return { ok: true as const, userId, profile }
}

export function can(profile: { role: string }, permission: string) {
  const matrix: Record<string, string[]> = {
    CENTRAL_HSE: ["ptw.read","ptw.create","ptw.approve","ptw.issue","ptw.activate","ptw.suspend_resume","ptw.close","ptw.cancel"],
    BRANCH_MANAGER: ["ptw.read","ptw.create","ptw.approve","ptw.issue","ptw.activate","ptw.suspend_resume","ptw.close","ptw.cancel"],
    HSE_SUPERVISOR: ["ptw.read","ptw.create","ptw.approve","ptw.issue","ptw.activate","ptw.suspend_resume","ptw.close"],
    HSE_STAFF: ["ptw.read","ptw.create"],
    OPERATIONS_STAFF: ["ptw.read","ptw.create"],
    CONTRACTOR: ["ptw.read","ptw.create"],
  }
  return (matrix[profile.role] ?? []).includes(permission)
}
