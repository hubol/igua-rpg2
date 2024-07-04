// This file is generated

import { OgmoEntityResolvers as r } from "../../../igua/ogmo/entity-resolvers";
import { OgmoFactory } from "../../../igua/ogmo/factory";
import { Tx } from "../../../assets/textures";

const { createEntity: e, createDecal: d, createLevel: l } = OgmoFactory;

export const Lvl = {
  Level2: l({ width: 256, height: 320, backgroundTint: 0xc0a311 }, () => ({
    Block: e(r["Block"], { x: 0, y: 280, width: 256, height: 40, values: { name: "", depth: 0 }, tint: 0x631d1d }),
    Block_1: e(r["Block"], { x: 0, y: 0, width: 16, height: 280, values: { name: "", depth: 0 }, tint: 0x631d1d }),
    Block_2: e(r["Block"], { x: 240, y: 0, width: 16, height: 280, values: { name: "", depth: 0 }, tint: 0x631d1d }),
    Block_3: e(r["Block"], { x: 0, y: 0, width: 256, height: 40, values: { name: "", depth: 0 }, tint: 0x631d1d }),
    PipeSlope: e(r["PipeSlope"], { x: 168, y: 224, width: 64, height: 32, flippedX: false, values: { name: "", depth: 0 } }),
    Pipe: e(r["Pipe"], { x: 136, y: 256, width: 32, values: { name: "", depth: 0 } }),
    PipeSlope_1: e(r["PipeSlope"], { x: 168, y: 192, width: 64, height: 32, flippedX: true, values: { name: "", depth: 0 } }),
    PipeSlope_2: e(r["PipeSlope"], { x: 168, y: 160, width: 64, height: 32, flippedX: false, values: { name: "", depth: 0 } }),
    PipeSlope_3: e(r["PipeSlope"], { x: 168, y: 128, width: 64, height: 32, flippedX: true, values: { name: "", depth: 0 } }),
    PipeSlope_4: e(r["PipeSlope"], { x: 168, y: 96, width: 64, height: 32, flippedX: false, values: { name: "", depth: 0 } }),
    PipeSlope_5: e(r["PipeSlope"], { x: 168, y: 64, width: 64, height: 32, flippedX: true, values: { name: "", depth: 0 } }),
    Pipe_1: e(r["Pipe"], { x: 64, y: 64, width: 104, values: { name: "", depth: 0 } }),
    Slope: e(r["Slope"], { x: 16, y: 248, width: 32, height: 32, flippedX: true, flippedY: false, values: { name: "", depth: 0 }, tint: 0x631d1d }),
    Slope_1: e(r["Slope"], { x: 16, y: 40, width: 32, height: 32, flippedX: true, flippedY: true, values: { name: "", depth: 0 }, tint: 0x631d1d }),
    Block_4: e(r["Block"], { x: 32, y: 136, width: 64, height: 16, values: { name: "", depth: 0 }, tint: 0x631d1d }),
    Slope_2: e(r["Slope"], { x: 64, y: 152, width: 32, height: 16, flippedX: true, flippedY: true, values: { name: "", depth: 0 }, tint: 0x631d1d }),
    Slope_3: e(r["Slope"], { x: 32, y: 152, width: 32, height: 16, flippedX: false, flippedY: true, values: { name: "", depth: 0 }, tint: 0x631d1d }),
    Door: e(r["Door"], { x: 56, y: 248, values: { sceneName: "PlayerTest", checkpointName: "", name: "", depth: 0 } }),
    UpperDoor: e(r["Door"], { x: 48, y: 104, values: { sceneName: "LevelTwo", checkpointName: "", name: "UpperDoor", depth: 0 } }),
    Player: e(r["Player"], { x: 112, y: 280, flippedX: false, values: { name: "", depth: 0 } }),
  })),
  Test: l({ width: 456, height: 256, backgroundTint: 0xecd769 }, () => ({
    Block: e(r["Block"], { x: 32, y: 64, width: 32, height: 16, values: { name: "", depth: 0 }, tint: 0xf56b3d }),
    Pipe: e(r["Pipe"], { x: 64, y: 64, width: 88, values: { name: "", depth: 0 } }),
    PipeSlope: e(r["PipeSlope"], { x: 152, y: 64, width: 56, height: 56, flippedX: true, values: { name: "", depth: 0 } }),
    Pipe_1: e(r["Pipe"], { x: 208, y: 120, width: 32, values: { name: "", depth: 0 } }),
    Block_1: e(r["Block"], { x: 0, y: 0, width: 256, height: 16, values: { name: "", depth: 0 }, tint: 0xd8795a }),
    Block_2: e(r["Block"], { x: 0, y: 16, width: 16, height: 240, values: { name: "", depth: 0 }, tint: 0xd8795a }),
    Block_3: e(r["Block"], { x: 16, y: 152, width: 240, height: 104, values: { name: "", depth: 0 }, tint: 0xd8795a }),
    Block_4: e(r["Block"], { x: 240, y: 16, width: 16, height: 112, values: { name: "", depth: 0 }, tint: 0xd8795a }),
    Block_5: e(r["Block"], { x: 16, y: 136, width: 32, height: 16, values: { name: "", depth: 0 }, tint: 0xd8795a }),
    Slope: e(r["Slope"], { x: 48, y: 136, width: 64, height: 16, flippedX: true, flippedY: false, values: { name: "", depth: 0 }, tint: 0xd8795a }),
    Slope_1: e(r["Slope"], { x: 256, y: 152, width: 96, height: 24, flippedX: true, flippedY: false, values: { name: "", depth: 0 }, tint: 0xd8795a }),
    Block_6: e(r["Block"], { x: 256, y: 176, width: 200, height: 80, values: { name: "", depth: 0 }, tint: 0xd8795a }),
    Block_7: e(r["Block"], { x: 256, y: 0, width: 200, height: 96, values: { name: "", depth: 0 }, tint: 0xd8795a }),
    Slope_2: e(r["Slope"], { x: 256, y: 96, width: 128, height: 32, flippedX: true, flippedY: true, values: { name: "", depth: 0 }, tint: 0xd8795a }),
    Pipe_2: e(r["Pipe"], { x: 368, y: 152, width: 48, values: { name: "", depth: 0 } }),
    asdf: d(Tx.LockedDoor, { x: 136, y: 136, scaleX: 1, scaleY: 1, rotation: 0.020627355569633583, originX: 0.5, originY: 0.5, tint: 0xffffff }),
    zzz: d(Tx.LockedDoor, { x: 176, y: 136, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0xffffff }),
    LockedDoor: d(Tx.LockedDoor, { x: 216, y: 136, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0xffffff }),
    TerrainPipeGray: d(Tx.Terrain.Pipe.Gray, { x: 136, y: 112, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0xffffff }),
    TerrainPipeGray_1: d(Tx.Terrain.Pipe.Gray, { x: 176, y: 112, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0xffffff }),
    Before: d(Tx.Placeholder, { x: 360, y: 184, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0xffffff }),
    After: d(Tx.Placeholder, { x: 368, y: 184, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0xff0000 }),
    Placeholder: d(Tx.Placeholder, { x: 408, y: 184, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0xff0000 }),
    Placeholder_1: d(Tx.Placeholder, { x: 432, y: 184, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x2e3cff }),
    Door: e(r["Door"], { x: 376, y: 120, values: { sceneName: "LevelTwo", checkpointName: "", name: "", depth: 0 } }),
    Player: e(r["Player"], { x: 48, y: 64, flippedX: true, values: { name: "", depth: 0 } }),
  })),
};
