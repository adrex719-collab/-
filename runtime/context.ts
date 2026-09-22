import type { RuntimeEnvironment } from "./platform-runtime";

export type DataClass = "TEST/SEED" | "HISTORICAL" | "OPERATIONAL";

export interface RuntimeContext {
  environment: RuntimeEnvironment;
  dataClass: DataClass;
  organizationId: string;
  branchId: string;
  siteId?: string;
  unitId?: string;
  authorizedScopes: string[];
}

export function assertScope(context: RuntimeContext): void {
  if (!context.branchId) throw new Error("Branch Scope is required.");
  if (!context.authorizedScopes.includes(context.branchId)) throw new Error("Access outside authorized Branch Scope is denied.");
}

export function assertOperationalWrite(context: RuntimeContext): void {
  assertScope(context);
  if (context.environment === "DEMO") throw new Error("Operational writes are not allowed in DEMO.");
  if (context.dataClass === "TEST/SEED") throw new Error("TEST/SEED cannot be written as operational data.");
}

export function assertHistoricalImport(context: RuntimeContext): void {
  assertScope(context);
  if (context.dataClass !== "HISTORICAL") throw new Error("Historical import requires HISTORICAL classification.");
}
