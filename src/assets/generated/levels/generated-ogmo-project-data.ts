// This file is generated.

import { OgmoFactory } from "../../../igua/ogmo/factory";

export namespace OgmoEntities {
  export type Player = OgmoFactory.EntityBase<{ name: string; depth: number }>;
  export type Block = OgmoFactory.EntityBase<{ name: string; depth: number; visible: boolean }>;
  export type Slope = OgmoFactory.EntityBase<{ name: string; depth: number; visible: boolean }>;
  export type Pipe = OgmoFactory.EntityBase<{ name: string; visible: boolean; depth: number }>;
  export type PipeSlope = OgmoFactory.EntityBase<{ name: string; depth: number; visible: boolean }>;
  export type Door = OgmoFactory.EntityBase<{ sceneName: string; checkpointName: string; name: string; depth: number }>;
  export type Checkpoint = OgmoFactory.EntityBase<{ name: string; depth: number; overrideFlipX: "none" | "retainFromPreviousScene" }>;
  export type WaterDripSource = OgmoFactory.EntityBase<{ delayMin: number; delayMax: number; name: string; depth: number }>;
  export type Sign = OgmoFactory.EntityBase<{ title: string; message: string; name: string; depth: number; isSpecial: boolean }>;
  export type IntelligenceBackground = OgmoFactory.EntityBase<{ initialTint: string; targetTint: string; min: number; max: number; name: string; depth: number }>;
  export type IguanaNpc = OgmoFactory.EntityBase<{ personaName: string; name: string; depth: number }>;
  export type ValuableGreen = OgmoFactory.EntityBase<{ name: string; depth: number }> & { uid: number };
  export type ValuableOrange = OgmoFactory.EntityBase<{ name: string; depth: number }> & { uid: number };
  export type ValuableBlue = OgmoFactory.EntityBase<{ name: string; depth: number }> & { uid: number };
  export type Puddle = OgmoFactory.EntityBase<{ name: string; depth: number }>;
  export type Marker = OgmoFactory.EntityBase<{ name: string; depth: number }>;
  export type Region = OgmoFactory.EntityBase<{ name: string; depth: number }>;
  export type GateHorizontal = OgmoFactory.EntityBase<{ sceneName: string; checkpointName: string; name: string; depth: number }>;
  export type PocketableItemA = OgmoFactory.EntityBase<{ name: string; depth: number }>;
  export type PocketableItemB = OgmoFactory.EntityBase<{ name: string; depth: number }>;
  export type GateVertical = OgmoFactory.EntityBase<{ sceneName: string; checkpointName: string; name: string; depth: number }>;
  export type EnemySuggestive = OgmoFactory.EntityBase<{ name: string; depth: number; variant: "level0" | "level1" }> & { uid: number };
  export type EnvironmentSparkleMarker = OgmoFactory.EntityBase<{ name: string; depth: number }>;
  export type Idol = OgmoFactory.EntityBase<{ name: string; depth: number }> & { uid: number };
  export type GateMap = OgmoFactory.EntityBase<{ sceneName: string; checkpointName: string; name: string; depth: number }>;
  export type StashPocket = OgmoFactory.EntityBase<{ name: string; depth: number }> & { uid: number };
}

export interface OgmoEntityResolverBase {
  Player: (entity: OgmoEntities.Player) => unknown;
  Block: (entity: OgmoEntities.Block) => unknown;
  Slope: (entity: OgmoEntities.Slope) => unknown;
  Pipe: (entity: OgmoEntities.Pipe) => unknown;
  PipeSlope: (entity: OgmoEntities.PipeSlope) => unknown;
  Door: (entity: OgmoEntities.Door) => unknown;
  Checkpoint: (entity: OgmoEntities.Checkpoint) => unknown;
  WaterDripSource: (entity: OgmoEntities.WaterDripSource) => unknown;
  Sign: (entity: OgmoEntities.Sign) => unknown;
  IntelligenceBackground: (entity: OgmoEntities.IntelligenceBackground) => unknown;
  IguanaNpc: (entity: OgmoEntities.IguanaNpc) => unknown;
  ValuableGreen: (entity: OgmoEntities.ValuableGreen) => unknown;
  ValuableOrange: (entity: OgmoEntities.ValuableOrange) => unknown;
  ValuableBlue: (entity: OgmoEntities.ValuableBlue) => unknown;
  Puddle: (entity: OgmoEntities.Puddle) => unknown;
  Marker: (entity: OgmoEntities.Marker) => unknown;
  Region: (entity: OgmoEntities.Region) => unknown;
  GateHorizontal: (entity: OgmoEntities.GateHorizontal) => unknown;
  PocketableItemA: (entity: OgmoEntities.PocketableItemA) => unknown;
  PocketableItemB: (entity: OgmoEntities.PocketableItemB) => unknown;
  GateVertical: (entity: OgmoEntities.GateVertical) => unknown;
  EnemySuggestive: (entity: OgmoEntities.EnemySuggestive) => unknown;
  EnvironmentSparkleMarker: (entity: OgmoEntities.EnvironmentSparkleMarker) => unknown;
  Idol: (entity: OgmoEntities.Idol) => unknown;
  GateMap: (entity: OgmoEntities.GateMap) => unknown;
  StashPocket: (entity: OgmoEntities.StashPocket) => unknown;
}
