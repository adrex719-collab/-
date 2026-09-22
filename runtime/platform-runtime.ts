export type RuntimeEnvironment = "DEMO" | "LOCAL" | "PRODUCTION";

export interface RuntimeHealth {
  platform: "ایمن بندر";
  environment: RuntimeEnvironment;
  architecture: "FROZEN";
  sourceOfTruth: "TARGET_ARCHITECTURE";
  dataClass: "TEST/SEED" | "OPERATIONAL";
  ready: boolean;
}

export function health(environment: RuntimeEnvironment): RuntimeHealth {
  return {
    platform: "ایمن بندر",
    environment,
    architecture: "FROZEN",
    sourceOfTruth: "TARGET_ARCHITECTURE",
    dataClass: environment === "PRODUCTION" ? "OPERATIONAL" : "TEST/SEED",
    ready: environment !== "DEMO"
  };
}
