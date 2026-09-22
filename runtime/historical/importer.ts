export type HistoricalClassification = "HISTORICAL"
export type ImportStatus = "VALIDATED"|"EXCEPTION"|"DUPLICATE_REVIEW"|"IMPORTED"|"RECONCILED"|"REJECTED"
export interface HistoricalRow { year:string; date?:string; branch?:string; region?:string; unit?:string; personCode?:string; personName?:string; reference?:string; category:string; [key:string]:unknown }
export interface WorkbookSheet { name:string; rows:HistoricalRow[] }
export interface HistoricalWorkbook { fileName:string; sheets:WorkbookSheet[] }
export interface ImportResult { sourceKey:string; sheet:string; rowNumber:number; classification:HistoricalClassification; status:ImportStatus; targetType:string; targetKey:string; errors:string[]; source:{fileName:string;sheet:string;rowNumber:number} }
export interface DryRunReport { fileName:string; classification:HistoricalClassification; totalRows:number; results:ImportResult[]; totals:{validated:number;exceptions:number;duplicates:number;rejected:number}; reconciled:boolean }
function norm(value:unknown){return String(value??"").trim().toUpperCase()}
export function deterministicSourceKey(fileName:string,sheet:string,rowNumber:number,row:HistoricalRow){
 const ref=norm(row.reference)||[norm(row.category),norm(row.date),norm(row.personCode),norm(row.branch)].join("|")
 return [fileName,sheet,rowNumber,ref].join("::")
}
export function dryRun(workbook:HistoricalWorkbook,knownPersonCodes:string[]=[]):DryRunReport{
 const seen=new Set<string>(),results:ImportResult[]=[]
 for(const sheet of workbook.sheets) sheet.rows.forEach((row,i)=>{
  const rowNumber=i+2,sourceKey=deterministicSourceKey(workbook.fileName,sheet.name,rowNumber,row),errors:string[]=[]
  if(!row.year)errors.push("YEAR_REQUIRED"); if(!row.category)errors.push("CATEGORY_REQUIRED"); if(!row.branch)errors.push("BRANCH_REQUIRED")
  if(!row.personCode&&row.personName)errors.push("PERSON_MATCH_REQUIRED")
  if(row.personCode&&!knownPersonCodes.includes(row.personCode))errors.push("PERSON_NOT_MATCHED")
  const duplicate=seen.has(sourceKey); if(duplicate)errors.push("DUPLICATE_SOURCE_ROW"); seen.add(sourceKey)
  const status:ImportStatus=duplicate?"DUPLICATE_REVIEW":errors.length?"EXCEPTION":"VALIDATED"
  results.push({sourceKey,sheet:sheet.name,rowNumber,classification:"HISTORICAL",status,targetType:row.category,targetKey:sourceKey,errors,source:{fileName:workbook.fileName,sheet:sheet.name,rowNumber}})
 })
 const validated=results.filter(r=>r.status==="VALIDATED").length,exceptions=results.filter(r=>r.status==="EXCEPTION").length,duplicates=results.filter(r=>r.status==="DUPLICATE_REVIEW").length,rejected=results.filter(r=>r.status==="REJECTED").length
 return {fileName:workbook.fileName,classification:"HISTORICAL",totalRows:results.length,results,totals:{validated,exceptions,duplicates,rejected},reconciled:validated+exceptions+duplicates+rejected===results.length}
}
export function approveDryRun(report:DryRunReport):ImportResult[]{
 if(!report.reconciled)throw new Error("RECONCILIATION_FAILED")
 if(report.results.some(r=>r.status==="EXCEPTION"||r.status==="DUPLICATE_REVIEW"))throw new Error("UNRESOLVED_EXCEPTIONS")
 return report.results.map(r=>({...r,status:"IMPORTED"}))
}
