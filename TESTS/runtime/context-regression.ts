import { assertHistoricalImport, assertOperationalWrite, assertScope, RuntimeContext } from "../../runtime/context";

function assert(name: string, value: boolean) {
  if (!value) throw new Error("FAIL: " + name);
  console.log("PASS: " + name);
}

const branchA: RuntimeContext = {
  environment: "LOCAL",
  dataClass: "OPERATIONAL",
  organizationId: "ORG-1",
  branchId: "BR-A",
  authorizedScopes: ["BR-A"],
};
const branchB: RuntimeContext = { ...branchA, branchId: "BR-B" };

assert("authorized branch scope", (() => { assertScope(branchA); return true; })());
assert("cross-branch scope denied", (() => { try { assertScope(branchB); return false; } catch { return true; } })());

const demo = { ...branchA, environment: "DEMO" as const };
assert("demo operational write denied", (() => { try { assertOperationalWrite(demo); return false; } catch { return true; } })());

const historical: RuntimeContext = { ...branchA, dataClass: "HISTORICAL" };
assert("historical import classification accepted", (() => { assertHistoricalImport(historical); return true; })());

const seed: RuntimeContext = { ...branchA, dataClass: "TEST/SEED" };
assert("seed cannot be imported as historical", (() => { try { assertHistoricalImport(seed); return false; } catch { return true; } })());

console.log("Shared runtime boundary regression: PASS");
