import { approveDryRun, dryRun } from "../../runtime/historical/importer"
function assert(condition:boolean,message:string){if(!condition)throw new Error(message)}
const report=dryRun({fileName:"HSE-HISTORY-2025.xlsx",sheets:[{name:"آموزش",rows:[
 {year:"2025",date:"2025-03-01",branch:"BR-A",personCode:"P001",category:"TRAINING",reference:"TR-001"},
 {year:"2025",date:"2025-04-01",branch:"BR-A",personCode:"P999",category:"TRAINING",reference:"TR-002"},
 {year:"2025",date:"2025-05-01",branch:"BR-A",personCode:"P001",category:"TRAINING",reference:"TR-001"}
]}]},["P001"])
assert(report.totalRows===3,"row count"); assert(report.totals.validated===1,"validated count"); assert(report.totals.exceptions===1,"exception count"); assert(report.totals.duplicates===1,"duplicate count"); assert(report.reconciled,"reconciliation")
let blocked=false; try{approveDryRun(report)}catch(e){blocked=true}; assert(blocked,"unresolved exceptions must block import")
const clean=dryRun({fileName:"HSE-HISTORY-2025.xlsx",sheets:[{name:"حوادث",rows:[{year:"2025",date:"2025-06-10",branch:"BR-A",personCode:"P001",category:"INCIDENT",reference:"INC-001"}]}]},["P001"])
assert(clean.totals.validated===1,"clean row"); assert(approveDryRun(clean)[0].status==="IMPORTED","import approval")
