// This file is generated

import { OgmoFactory } from "../../../igua/ogmo-factory";

const { entityResolvers: r, createEntity: e } = OgmoFactory;

export const Lvl = {
  Test: {
    width: 256,
    height: 256,
    resolve: () => ({
      Block: e(r["Block"], { x: -64, y: 144, width: 320, height: 112, values: { name: "", depth: 0 } }),
      Block_1: e(r["Block"], { x: 40, y: 64, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Block_2: e(r["Block"], { x: 104, y: 112, width: 64, height: 32, values: { name: "", depth: 0 } }),
      Block_3: e(r["Block"], { x: 200, y: 64, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Block_4: e(r["Block"], { x: -24, y: 96, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Slope: e(r["Slope"], { x: 72, y: 112, width: 32, height: 32, flippedX: false, flippedY: false, values: { name: "", depth: 0 } }),
      Slope_1: e(r["Slope"], { x: 104, y: 64, width: 96, height: 48, flippedX: false, flippedY: false, values: { name: "", depth: 0 } }),
      Block_5: e(r["Block"], { x: 240, y: 96, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Slope_2: e(r["Slope"], { x: 8, y: 8, width: 32, height: 32, flippedX: true, flippedY: true, values: { name: "", depth: 0 } }),
      Block_6: e(r["Block"], { x: 0, y: -8, width: 256, height: 16, values: { name: "", depth: 0 } }),
      Block_7: e(r["Block"], { x: -8, y: 8, width: 16, height: 136, values: { name: "", depth: 0 } }),
      Slope_3: e(r["Slope"], { x: 168, y: 112, width: 8, height: 8, flippedX: true, flippedY: true, values: { name: "", depth: 0 } }),
      Slope_4: e(r["Slope"], { x: 200, y: 80, width: 8, height: 8, flippedX: true, flippedY: true, values: { name: "", depth: 0 } }),
      Pipe: e(r["Pipe"], { x: 56, y: 64, width: 56, values: { name: "", depth: 0 } }),
      PipeSlope: e(r["PipeSlope"], { x: 112, y: 24, width: 80, height: 40, flippedX: false, values: { name: "", depth: 0 } }),
      Pipe_1: e(r["Pipe"], { x: 192, y: 24, width: 40, values: { name: "", depth: 0 } }),
      Player: e(r["Player"], { x: 48, y: 64, flippedX: false, values: { name: "", depth: 0 } }),
    }),
  },
};
