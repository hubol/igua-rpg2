// This file is generated

import { OgmoEntityResolvers as r } from "../../../igua/ogmo/entity-resolvers";
import { OgmoFactory } from "../../../igua/ogmo/factory";
import { Tx } from "../../../assets/textures";

const { createEntity: e, createDecal: d, createLevel: l, createDecalGroup: dg } = OgmoFactory;

export const lvlMenuIguanaDesigner = l({ width: 500, height: 280, backgroundTint: 0x002c38 }, () => ({
  FoliageMedium0: d(Tx.Foliage.Medium0, { x: 254, y: 216, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x1b2714 }, "BackgroundDecals"),
  Block: e(r["Block"], { x: 0, y: 256, width: 224, height: 48, values: { name: "", depth: 0, visible: true }, tint: 0x001c28 }, "TerrainEntities"),
  Slope: e(r["Slope"], { x: 224, y: 224, width: 32, height: 32, flippedX: false, flippedY: false, values: { name: "", depth: 0, visible: true }, tint: 0x001c28 }, "TerrainEntities"),
  Block_1: e(r["Block"], { x: 256, y: 224, width: 112, height: 32, values: { name: "", depth: 0, visible: true }, tint: 0x001c28 }, "TerrainEntities"),
  Slope_1: e(r["Slope"], { x: 368, y: 224, width: 32, height: 32, flippedX: true, flippedY: false, values: { name: "", depth: 0, visible: true }, tint: 0x001c28 }, "TerrainEntities"),
  Block_2: e(r["Block"], { x: 224, y: 256, width: 256, height: 56, values: { name: "", depth: 0, visible: true }, tint: 0x001c28 }, "TerrainEntities"),
  Slope_2: e(r["Slope"], { x: 480, y: 256, width: 32, height: 32, flippedX: true, flippedY: false, values: { name: "", depth: 0, visible: true }, tint: 0x001c28 }, "TerrainEntities"),
  Block_3: e(r["Block"], { x: 472, y: 288, width: 32, height: 16, values: { name: "", depth: 0, visible: true }, tint: 0x001c28 }, "TerrainEntities"),
  TerrainGrassJagged: d(Tx.Terrain.Grass.Jagged, { x: 28, y: 256, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x001c28 }, "TerrainDecals"),
  TerrainGrassJagged_1: d(Tx.Terrain.Grass.Jagged, { x: 105, y: 257, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x001c28 }, "TerrainDecals"),
  TerrainGrassJagged_2: d(Tx.Terrain.Grass.Jagged, { x: 187, y: 256, scaleX: -1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x001c28 }, "TerrainDecals"),
  TerrainGrassJagged_3: d(Tx.Terrain.Grass.Jagged, { x: 434, y: 257, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x001c28 }, "TerrainDecals"),
  TerrainGrassJagged_4: d(Tx.Terrain.Grass.Jagged, { x: 311, y: 225, scaleX: -1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x001c28 }, "TerrainDecals"),
  LightShadowIrregularSmall: d(Tx.Light.ShadowIrregularSmall, { x: 439, y: 262, scaleX: 4, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x021016 }, "TerrainDecals"),
  TerrainEarthAsterisk: d(Tx.Terrain.Earth.Asterisk, { x: 269, y: 244, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x002c38 }, "TerrainDecals"),
  TerrainEarthAsterisk_1: d(Tx.Terrain.Earth.Asterisk, { x: 476, y: 286, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x002c38 }, "TerrainDecals"),
  TerrainEarthAsterisk_2: d(Tx.Terrain.Earth.Asterisk, { x: 22, y: 281, scaleX: -1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x002c38 }, "TerrainDecals"),
  FoliageMedium0_1: d(Tx.Foliage.Medium0, { x: 236, y: 235, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x2c451e }, "TerrainDecals"),
  FoliageMedium0_2: d(Tx.Foliage.Medium0, { x: 357, y: 213, scaleX: -1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x2c451e }, "TerrainDecals"),
  FoliageMedium0_3: d(Tx.Foliage.Medium0, { x: 409, y: 243, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, tint: 0x1b2714 }, "TerrainDecals"),
  ThoughtBubbleGroup: dg("ThoughtBubbleGroup", "TerrainDecals"),
  ShapesCircleIrregular72: d(Tx.Shapes.CircleIrregular72, { x: 216, y: 112, scaleX: 1, scaleY: -1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  ShapesCircleIrregular72_1: d(Tx.Shapes.CircleIrregular72, { x: 248, y: 80, scaleX: -1, scaleY: -1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  ShapesCircleIrregular72_2: d(Tx.Shapes.CircleIrregular72, { x: 288, y: 88, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  ShapesCircleIrregular72_3: d(Tx.Shapes.CircleIrregular72, { x: 336, y: 96, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  ShapesCircleIrregular72_4: d(Tx.Shapes.CircleIrregular72, { x: 376, y: 120, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  ShapesCircleIrregular72_5: d(Tx.Shapes.CircleIrregular72, { x: 256, y: 128, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  ShapesCircleIrregular72_6: d(Tx.Shapes.CircleIrregular72, { x: 304, y: 136, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  ShapesCircleIrregular72_7: d(Tx.Shapes.CircleIrregular72, { x: 336, y: 128, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  TerrainGrassLoops: d(Tx.Terrain.Grass.Loops, { x: 220, y: 77, scaleX: 1, scaleY: 1, rotation: -16.31792928278778, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  TerrainGrassLoops_1: d(Tx.Terrain.Grass.Loops, { x: 296, y: 185, scaleX: 1, scaleY: 1, rotation: -16.31792928278778, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  TerrainGrassLoops_2: d(Tx.Terrain.Grass.Loops, { x: 361, y: 89, scaleX: 1, scaleY: 1, rotation: -2.4455050903193905, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  TerrainEarthAsterisk_3: d(Tx.Terrain.Earth.Asterisk, { x: 377, y: 175, scaleX: 0.7, scaleY: 0.6, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  TerrainEarthAsterisk_4: d(Tx.Terrain.Earth.Asterisk, { x: 391, y: 197, scaleX: -0.7, scaleY: 0.7, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x1b2714 }, "TerrainDecals"),
  ShapesCircleIrregular72_8: d(Tx.Shapes.CircleIrregular72, { x: 232, y: 152, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  ShapesCircleIrregular72_9: d(Tx.Shapes.CircleIrregular72, { x: 280, y: 160, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  ShapesCircleIrregular72_10: d(Tx.Shapes.CircleIrregular72, { x: 328, y: 160, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  ShapesCircleIrregular72_11: d(Tx.Shapes.CircleIrregular72, { x: 256, y: 176, scaleX: 1, scaleY: 1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  ShapesCircleIrregular72_12: d(Tx.Shapes.CircleIrregular72, { x: 320, y: 64, scaleX: 1, scaleY: -1, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
  TerrainEarthAsterisk_5: d(Tx.Terrain.Earth.Asterisk, { x: 208, y: 142, scaleX: 0.75, scaleY: 0.75, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x002c38 }, "TerrainDecals"),
  TerrainEarthAsterisk_6: d(Tx.Terrain.Earth.Asterisk, { x: 349, y: 74, scaleX: 0.75, scaleY: 0.75, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x002c38 }, "TerrainDecals"),
  TerrainEarthAsterisk_7: d(Tx.Terrain.Earth.Asterisk, { x: 352, y: 155, scaleX: 0.75, scaleY: 0.75, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x002c38 }, "TerrainDecals"),
  TerrainEarthAsterisk_8: d(Tx.Terrain.Earth.Asterisk, { x: 408, y: 216, scaleX: -0.7, scaleY: 0.7, rotation: 0, originX: 0.5, originY: 0.5, groupName: "ThoughtBubbleGroup", tint: 0x001c28 }, "TerrainDecals"),
}));

export type LvlMenuIguanaDesigner = ReturnType<typeof lvlMenuIguanaDesigner>;
