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
      Block_3: e(r["Block"], { x: 200, y: 56, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Block_4: e(r["Block"], { x: -24, y: 96, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Slope: e(r["Slope"], { x: 72, y: 112, width: 32, height: 32, flippedX: false, flippedY: false, values: { name: "", depth: 0 } }),
      Slope_1: e(r["Slope"], { x: 104, y: 56, width: 96, height: 56, flippedX: false, flippedY: false, values: { name: "", depth: 0 } }),
      Block_5: e(r["Block"], { x: 240, y: 96, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Player: e(r["Player"], { x: 48, y: 64, flippedX: false, values: { name: "", depth: 0 } }),
    }),
  },
};
