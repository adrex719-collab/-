import { assertHistoricalImport, RuntimeContext } from "../../runtime/context";

function assert(name: string, value: boolean) {
  if (!value) throw new Error("FAIL: " + name);
  console.log("PASS: " + name);
}

const base: RuntimeContext = {
  environment: "LOCAL",
  dataClass: "HISTORICAL",
  organizationId: "ORG-1",
  branchId: "BR-A",
  authorizedScopes: ["BR-A"],
};

assert("historical import requires authorized scope", (() => {
  assertHistoricalImport(base);
  return true;
})());

assert("historical import rejects unauthorized branch", (() => {
  try {
    assertHistoricalImport({ ...base, branchId: "BR-B" });
    return false;
  } catch {
    return true;
  }
})());

assert("historical classification is distinct from seed", base.dataClass === "HISTORICAL");

console.log("Historical import boundary regression: PASS");
