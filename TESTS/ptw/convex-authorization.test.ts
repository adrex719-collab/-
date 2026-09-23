import { describe, it, expect } from "vitest"
import { convexTest } from "convex-test"
import schema from "../../convex/schema"
import { api } from "../../convex/_generated/api"

function makeT(){ return convexTest(schema, import.meta.glob("../../convex/**/*.*s")) }

async function seedProfile(t:any, role:"CENTRAL_HSE"|"BRANCH_MANAGER"|"HSE_SUPERVISOR"|"HSE_STAFF"|"OPERATIONS_STAFF"|"CONTRACTOR", branches:string[]){
  return await t.run(async(ctx:any)=>{
    const userId=await ctx.db.insert("users",{})
    await ctx.db.insert("userProfiles",{userId,role,organizationId:"ORG-DEMO",regionIds:[],branchIds:branches,siteIds:[],unitIds:[],active:true})
    return userId
  })
}

describe("D08 PTW C03 authorization boundary",()=>{
 it("denies unauthenticated branch reads",async()=>{
   const t=makeT()
   const result=await t.query(api.permits.listScoped,{organizationId:"ORG-DEMO",branchId:"BR-A"})
   expect(result).toMatchObject({ok:false,code:"UNAUTHENTICATED"})
 })
 it("denies authenticated user outside branch scope",async()=>{
   const t=makeT(); const user=await seedProfile(t,"HSE_STAFF",["BR-B"])
   const result=await t.withIdentity({subject:user}).query(api.permits.listScoped,{branchId:"BR-A"})
   expect(result).toMatchObject({ok:false,code:"SCOPE_DENIED"})
 })
 it("allows read inside authorized branch scope",async()=>{
   const t=makeT(); const user=await seedProfile(t,"HSE_STAFF",["BR-A"])
   const result=await t.withIdentity({subject:user}).query(api.permits.listScoped,{branchId:"BR-A"})
   expect(result).toMatchObject({ok:true,permits:[]})
 })
 it("enforces role permission on PTW creation",async()=>{
   const t=makeT(); const user=await seedProfile(t,"CONTRACTOR",["BR-A"])
   const result=await t.withIdentity({subject:user}).mutation(api.permits.createScoped,{permitId:"T-001",type:"HOT_WORK",location:"AREA-A",organizationId:"ORG-DEMO",branchId:"BR-A",requiresLoto:true,requiredGasTest:true,dataClass:"OPERATIONAL"})
   expect(result).toMatchObject({ok:true})
 })
})
