// This file is generated

import { OgmoFactory } from "../../../igua/ogmo-factory";

const { entityResolvers: r, createEntity: e } = OgmoFactory;

export const Lvl = {
  Test: {
    width: 320,
    height: 240,
    resolve: () => ({
      Block: e(r["Block"], { x: 0, y: 144, width: 320, height: 96, values: { name: "", depth: 0 } }),
      Block_1: e(r["Block"], { x: 104, y: 64, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Block_2: e(r["Block"], { x: 208, y: 96, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Block_3: e(r["Block"], { x: 264, y: 56, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Block_4: e(r["Block"], { x: 40, y: 96, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Player: e(r["Player"], { x: 48, y: 96, flippedX: false, values: { name: "", depth: 0 } }),
    }),
  },
};
