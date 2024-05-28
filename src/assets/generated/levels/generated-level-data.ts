// This file is generated

import { OgmoResolvers as r, spawn as s } from "../../../igua/ogmo-resolvers";

export const Lvl = {
  Test: {
    width: 320,
    height: 240,
    resolve: () => ({
      Block: s(r["Block"], { x: 0, y: 144, width: 320, height: 96, values: { name: "", depth: 0 } }),
      Player: s(r["Player"], { x: 24, y: 144, flippedX: false, values: { name: "", depth: 0 } }),
      Block_1: s(r["Block"], { x: 104, y: 64, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Block_2: s(r["Block"], { x: 208, y: 96, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Block_3: s(r["Block"], { x: 264, y: 56, width: 16, height: 16, values: { name: "", depth: 0 } }),
      Block_4: s(r["Block"], { x: 40, y: 96, width: 16, height: 16, values: { name: "", depth: 0 } }),
    }),
  },
};
