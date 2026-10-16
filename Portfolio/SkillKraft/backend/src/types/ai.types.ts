export enum AIProvider { 
  "OPENAI",  
  "ANTHROPIC",
  "NONE"      // for non-AI jobs logged here for observability consistency
}

export enum tgtMonths {three = 3,six = 6,twelve = 12};

export type Body = {
    "currentRole" : string,
    "targetRole" : string,
    "weeklyHours" : number,
    "targetMonths" : tgtMonths
};
