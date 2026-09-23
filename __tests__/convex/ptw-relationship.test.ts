import { describe, it, expect } from "vitest"
import { convexTest } from "convex-test"
import schema from "../../convex/schema"
import { api } from "../../convex/_generated/api"

function makeT(){ return convexTest(schema, import.meta.glob("../../convex/**/*.*s")) }

const S={organizationId:"ORG-DEMO",regionId:"REG-DEMO",branchId:"BR-A",siteId:"SITE-DEMO",unitId:"UNIT-DEMO"}
const MATCH={organizationId:"ORG-DEMO",regionIds:["REG-DEMO"],branchIds:["BR-A"],siteIds:["SITE-DEMO"],unitIds:["UNIT-DEMO"]}

async function profile(t:any,role:any){
  return t.run(async(ctx:any)=>{
    const userId=await ctx.db.insert("users",{})
    await ctx.db.insert("userProfiles",{userId,identitySubject:userId,role,organizationId:MATCH.organizationId,regionIds:MATCH.regionIds,branchIds:MATCH.branchIds,siteIds:MATCH.siteIds,unitIds:MATCH.unitIds,active:true})
    return userId
  })
}

async function primary(t:any,user:any){
  return t.withIdentity({subject:user}).mutation(api.permits.createScoped,{
    permitId:"PTW-PRIMARY-001",type:"HOT_WORK",location:"AREA-A",...S,
    activityDescription:"Welding",requester:"R-1",responsiblePerson:"RP-1",
    requiresLoto:true,requiredGasTest:true,dataClass:"OPERATIONAL"
  })
}

describe("D08 PTW relationship taxonomy",()=>{
  it("rejects an electrical permit without a primary parent",async()=>{
    const t=makeT(); const user=await profile(t,"HSE_SUPERVISOR")
    const r=await t.withIdentity({subject:user}).mutation(api.permits.createScoped,{
      permitId:"ELEC-001",type:"ELECTRICAL",location:"AREA-A",...S,
      activityDescription:"Electrical isolation",requester:"R-1",responsiblePerson:"RP-1",
      requiresLoto:true,requiredGasTest:false,dataClass:"OPERATIONAL"
    })
    expect(r).toMatchObject({ok:false,code:"PARENT_PERMIT_REQUIRED"})
  })

  it("creates electrical only as a supplemental child of a primary permit",async()=>{
    const t=makeT(); const user=await profile(t,"HSE_SUPERVISOR")
    const p:any=await primary(t,user); expect(p.ok).toBe(true)
    const r:any=await t.withIdentity({subject:user}).mutation(api.permits.createScoped,{
      permitId:"ELEC-002",type:"ELECTRICAL",location:"AREA-A",...S,
      parentPermitId:p.id,activityDescription:"Electrical isolation",requester:"R-1",responsiblePerson:"RP-1",
      requiresLoto:true,requiredGasTest:false,dataClass:"OPERATIONAL"
    })
    expect(r.ok).toBe(true)
    const row:any=await t.run(async(ctx:any)=>ctx.db.get(r.id))
    expect(row.permitFamily).toBe("SUPPLEMENTAL")
    expect(row.relationshipType).toBe("SUPPLEMENTAL")
    expect(row.parentPermitId).toBe(p.id)
    expect(row.rootPermitId).toBe(p.id)
  })

  it("rejects radiography without the specialized profile",async()=>{
    const t=makeT(); const user=await profile(t,"HSE_SUPERVISOR")
    const r=await t.withIdentity({subject:user}).mutation(api.permits.createScoped,{
      permitId:"RAD-001",type:"RADIOGRAPHY",location:"AREA-R",...S,
      activityDescription:"Industrial radiography",requester:"R-1",responsiblePerson:"RP-1",
      requiresLoto:false,requiredGasTest:false,dataClass:"OPERATIONAL"
    })
    expect(r).toMatchObject({ok:false,code:"RADIOGRAPHY_PROFILE_REQUIRED"})
  })

  it("creates radiography as a specialized permit on the same D08 engine",async()=>{
    const t=makeT(); const user=await profile(t,"HSE_SUPERVISOR")
    const r:any=await t.withIdentity({subject:user}).mutation(api.permits.createScoped,{
      permitId:"RAD-002",type:"RADIOGRAPHY",location:"AREA-R",...S,
      specializedProfile:"RADIOGRAPHY",ruleSetId:"D08-PTW",ruleSetVersion:"PTW-TAXONOMY-V1",
      effectiveProcedureId:"WI-HS-13",effectiveProcedureRevision:"CONTROLLED-REVIEW",
      activityDescription:"Industrial radiography",requester:"R-1",responsiblePerson:"RP-1",
      requiresLoto:false,requiredGasTest:false,dataClass:"OPERATIONAL"
    })
    expect(r.ok).toBe(true)
    const row:any=await t.run(async(ctx:any)=>ctx.db.get(r.id))
    expect(row.permitFamily).toBe("SPECIALIZED")
    expect(row.relationshipType).toBe("SPECIALIZED")
    expect(row.specializedProfile).toBe("RADIOGRAPHY")
    expect(row.effectiveProcedureId).toBe("WI-HS-13")
  })
})