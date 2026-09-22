import { strict as assert } from "node:assert"
import { approveDryRun, dryRun } from "../../runtime/historical/importer"
const report=dryRun({fileName:"HSE-HISTORY-2025.xlsx",sheets:[{name:"آموزش",rows:[
 {year:"2025",date:"2025-03-01",branch:"BR-A",personCode:"P001",category:"TRAINING",reference:"TR-001"},
 {year:"2025",date:"2025-04-01",branch:"BR-A",personCode:"P999",category:"TRAINING",reference:"TR-002"},
 {year:"2025",date:"2025-05-01",branch:"BR-A",personCode:"P001",category:"TRAINING",reference:"TR-001"}
]}]},["P001"])
assert.equal(report.totalRows,3); assert.equal(report.totals.validated,1); assert.equal(report.totals.exceptions,1); assert.equal(report.totals.duplicates,1); assert.equal(report.reconciled,true)
assert.throws(()=>approveDryRun(report),/UNRESOLVED_EXCEPTIONS/)
const clean=dryRun({fileName:"HSE-HISTORY-2025.xlsx",sheets:[{name:"حوادث",rows:[{year:"2025",date:"2025-06-10",branch:"BR-A",personCode:"P001",category:"INCIDENT",reference:"INC-001"}]}]},["P001"])
assert.equal(clean.totals.validated,1); assert.equal(approveDryRun(clean)[0].status,"IMPORTED")
