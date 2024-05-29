// This file is generated

import { OgmoFactory } from "../../../igua/ogmo-factory";
import { Tx } from "../../../assets/textures";

const { entityResolvers: r, createEntity: e, createDecal: d } = OgmoFactory;

export const Lvl = {
  Test: {
    width: 256,
    height: 256,
    resolve: () => ({
      Slope: e(r["Slope"], { x: 48, y: 136, width: 64, height: 16, flippedX: true, flippedY: false, values: { name: "", depth: 0 } }),
      Block: e(r["Block"], { x: 16, y: 136, width: 32, height: 16, values: { name: "", depth: 0 } }),
      Block_1: e(r["Block"], { x: 240, y: 16, width: 16, height: 136, values: { name: "", depth: 0 } }),
      Block_2: e(r["Block"], { x: 16, y: 152, width: 240, height: 104, values: { name: "", depth: 0 } }),
      Block_3: e(r["Block"], { x: 0, y: 16, width: 16, height: 240, values: { name: "", depth: 0 } }),
      Block_4: e(r["Block"], { x: 0, y: 0, width: 256, height: 16, values: { name: "", depth: 0 } }),
      Pipe: e(r["Pipe"], { x: 208, y: 120, width: 32, values: { name: "", depth: 0 } }),
      PipeSlope: e(r["PipeSlope"], { x: 152, y: 64, width: 56, height: 56, flippedX: true, values: { name: "", depth: 0 } }),
      Pipe_1: e(r["Pipe"], { x: 64, y: 64, width: 88, values: { name: "", depth: 0 } }),
      Block_5: e(r["Block"], { x: 32, y: 64, width: 32, height: 16, values: { name: "", depth: 0 } }),
      TerrainPipeGray: d(Tx.Terrain.Pipe.Gray, { x: 176, y: 112, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5 }),
      TerrainPipeGray_1: d(Tx.Terrain.Pipe.Gray, { x: 136, y: 112, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5 }),
      LockedDoor: d(Tx.LockedDoor, { x: 216, y: 136, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5 }),
      LockedDoor_1: d(Tx.LockedDoor, { x: 176, y: 136, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5 }),
      LockedDoor_2: d(Tx.LockedDoor, { x: 136, y: 136, scaleX: 1, scaleY: 1, rotation: 67.71561384794322, originX: 0.5, originY: 0.5 }),
      Player: e(r["Player"], { x: 48, y: 64, flippedX: false, values: { name: "", depth: 0 } }),
    }),
  },
};
