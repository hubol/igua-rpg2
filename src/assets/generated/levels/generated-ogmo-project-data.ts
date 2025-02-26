// This file is generated.

const entityValues = {
  Player: null as unknown as { name: string; depth: number },
  Block: null as unknown as { name: string; depth: number; visible: boolean },
  Slope: null as unknown as { name: string; depth: number; visible: boolean },
  Pipe: null as unknown as { name: string; visible: boolean; depth: number },
  PipeSlope: null as unknown as { name: string; depth: number; visible: boolean },
  Door: null as unknown as { sceneName: string; checkpointName: string; name: string; depth: number },
  Checkpoint: null as unknown as { name: string; depth: number; overrideFlipX: "none" | "retainFromPreviousScene" },
  WaterDripSource: null as unknown as { delayMin: number; delayMax: number; name: string; depth: number },
  Sign: null as unknown as { title: string; message: string; name: string; depth: number; isSpecial: boolean },
  IntelligenceBackground: null as unknown as { initialTint: string; targetTint: string; min: number; max: number; name: string; depth: number },
  IguanaNpc: null as unknown as { personaName: string; name: string; depth: number },
  ValuableGreen: null as unknown as { name: string; depth: number },
  ValuableOrange: null as unknown as { name: string; depth: number },
  ValuableBlue: null as unknown as { name: string; depth: number },
  Puddle: null as unknown as { name: string; depth: number },
  Marker: null as unknown as { name: string; depth: number },
  Region: null as unknown as { name: string; depth: number },
  GateHorizontal: null as unknown as { sceneName: string; checkpointName: string; name: string; depth: number },
  PocketableItemA: null as unknown as { name: string; depth: number },
  PocketableItemB: null as unknown as { name: string; depth: number },
  GateVertical: null as unknown as { sceneName: string; checkpointName: string; name: string; depth: number },
  EnemySuggestive: null as unknown as { name: string; depth: number; variant: "level0" | "level1" },
  EnvironmentSparkleMarker: null as unknown as { name: string; depth: number },
};

export namespace OgmoProject {
  export namespace Entities {
    export type Values = typeof entityValues;
    export type Names = keyof Values;
  }
}
