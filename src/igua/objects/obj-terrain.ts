import { DisplayObject, Graphics, SimpleMesh, WRAP_MODES } from "pixi.js";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { SceneLocal } from "../../lib/game-engine/scene-local";
import { container } from "../../lib/pixi/container";
import { Empty } from "../../lib/types/empty";
import { ZIndex } from "../core/scene/z-index";
import { scene } from "../globals";
import { Material } from "../systems/materials";
import { StepOrder } from "./step-order";

/**
 * Describes a line segment. Different kinds of terrain segments make certain guarantees:
 * - `isFloor` or `isCeiling`: `x0` must always be <= `x1`
 * - `isWallFacingRight` or `isWallFacingLeft`: `y0` must always be <= `y1`
 */
interface TerrainSegmentCoordinates {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

type TerrainSegmentDiscriminator =
    | { isFloor: true; isCeiling?: false; isWallFacingRight?: false; isWallFacingLeft?: false; isPipe?: boolean }
    | { isFloor?: false; isCeiling: true; isWallFacingRight?: false; isWallFacingLeft?: false; isPipe?: false }
    | { isFloor?: false; isCeiling?: false; isWallFacingRight: true; isWallFacingLeft?: false; isPipe?: false }
    | { isFloor?: false; isCeiling?: false; isWallFacingRight?: false; isWallFacingLeft: true; isPipe?: false };
type TerrainSegment = TerrainSegmentCoordinates & TerrainSegmentDiscriminator;

interface Terrain {
    iguaMaterial: Material;
    destroyed: boolean;
    dirty: boolean;
    enabled: boolean;
    // TODO does it need to be on Terrain?
    clean: () => void;
    segments: TerrainSegment[];
}

function cleanTerrain() {
    const terrains = CtxTerrain.value;

    let i = 0;
    let shift = 0;

    while (i < terrains.length) {
        const wall = terrains[i];

        if (wall.destroyed) {
            shift += 1;
            i += 1;
            continue;
        }

        if (wall.dirty) {
            wall.clean();
            wall.dirty = false;
        }

        if (shift) {
            terrains[i - shift] = wall;
        }
        i += 1;
    }
}

function objTerrainSegmentDebug() {
    return new Graphics()
        .step(gfx => {
            gfx.clear();
            for (const terrain of CtxTerrain.value) {
                for (const segment of terrain.segments) {
                    let color = 0xff0000;
                    if (segment.isWallFacingRight) {
                        color = 0xffff00;
                    }
                    if (segment.isCeiling) {
                        color = 0x00ff00;
                    }
                    if (segment.isWallFacingLeft) {
                        color = 0x0000ff;
                    }

                    if (segment.isCeiling || segment.isFloor) {
                        gfx.lineStyle(0).beginFill(color, 0.5).drawRect(segment.x0 - 1, segment.y0 - 1, 3, 3);
                    }

                    gfx.lineStyle(1, color);
                    gfx.moveTo(segment.x0, segment.y0);
                    gfx.lineTo(segment.x1, segment.y1);
                }
            }
        });
}

function createLocalTerrain() {
    scene.root.step(() => cleanTerrain(), StepOrder.TerrainClean);
    // objTerrainSegmentDebug().show(scene.root);
    return Empty<Terrain>();
}

export const CtxTerrain = new SceneLocal(createLocalTerrain, "CtxTerrain");

export const CtxTerrainObj = new SceneLocal(() => {
    // TODO renderable hack is weird, PixiJS sucks
    return container().step(self => self.renderable = true).zIndexed(ZIndex.TerrainEntities).show();
}, "CtxTerrainObj");

export function objSolidBlock() {
    return new SolidBlockGraphics().show(CtxTerrainObj.value);
}

export function objSolidSlope() {
    return new SolidSlopeGraphics().show(CtxTerrainObj.value);
}

export function objPipe() {
    return new PipeMesh().show(CtxTerrainObj.value);
}

export function objPipeSlope() {
    return new PipeMesh(PipeMesh.SlopeWeights).show(CtxTerrainObj.value);
}

type CleanableTerrainObj = DisplayObject & { weights: TerrainSegment[]; segments: TerrainSegment[] };

function clean(obj: CleanableTerrainObj) {
    const xMin = obj.x;
    const yMin = obj.y;
    const xMax = xMin + Math.abs(obj.scale.x);
    const yMax = yMin + Math.abs(obj.scale.y);

    const hFlip = obj.scale.x < 0;
    const vFlip = obj.scale.y < 0;

    const x0 = hFlip ? xMax : xMin;
    const y0 = vFlip ? yMax : yMin;
    const x1 = hFlip ? xMin : xMax;
    const y1 = vFlip ? yMin : yMax;

    for (let i = 0; i < obj.weights.length; i++) {
        const segment = obj.segments[i];
        const weight = obj.weights[i];

        segment.x0 = weight.x0 ? x1 : x0;
        segment.x1 = weight.x1 ? x1 : x0;
        segment.y0 = weight.y0 ? y1 : y0;
        segment.y1 = weight.y1 ? y1 : y0;

        // Normalize to comply with contract described in `TerrainSegmentCoordinates`
        if (
            ((weight.isCeiling || weight.isFloor) && segment.x0 > segment.x1)
            || ((weight.isWallFacingLeft || weight.isWallFacingRight) && segment.y0 > segment.y1)
        ) {
            const x0p = segment.x0;
            const y0p = segment.y0;

            segment.x0 = segment.x1;
            segment.y0 = segment.y1;
            segment.x1 = x0p;
            segment.y1 = y0p;
        }

        segment.isCeiling = (weight.isCeiling && !vFlip) || (weight.isFloor && vFlip);
        segment.isFloor = (weight.isFloor && !vFlip) || (weight.isCeiling && vFlip);

        segment.isWallFacingLeft = (weight.isWallFacingLeft && !hFlip) || (weight.isWallFacingRight && hFlip);
        segment.isWallFacingRight = (weight.isWallFacingRight && !hFlip) || (weight.isWallFacingLeft && hFlip);
    }
}

export type ObjTerrain = DisplayObject & Terrain & { onTransformChanged(): void };

export namespace ObjTerrain {
    export function toggle(terrainObj: ObjTerrain) {
        terrainObj.visible = !terrainObj.visible;
        terrainObj.enabled = terrainObj.visible;
    }
}

function constructTerrain(terrainObj: ObjTerrain, weights: TerrainSegment[]) {
    for (let i = 0; i < weights.length; i++) {
        terrainObj.segments.push({ ...weights[i] });
    }

    const cb = terrainObj.transform.position.cb.bind(terrainObj.transform);

    terrainObj.transform.position.cb = terrainObj.transform.scale.cb = () => {
        terrainObj.onTransformChanged();
        cb();
    };

    terrainObj.once("added", () => CtxTerrain.value.push(terrainObj));
}

export abstract class TerrainGraphics extends Graphics {
    dirty = true;
    segments: TerrainSegment[] = [];
    enabled = true;

    constructor(readonly weights: TerrainSegment[], readonly iguaMaterial: Material) {
        super();

        constructTerrain(this, weights);
    }

    onTransformChanged() {
        this.pivot.set(this.transform.scale.x < 0 ? 1 : 0, this.transform.scale.y < 0 ? 1 : 0);
        this.dirty = true;
    }

    clean() {
        clean(this);
    }
}

export abstract class TerrainMesh extends SimpleMesh {
    dirty = true;
    segments: TerrainSegment[] = [];
    enabled = true;

    constructor(readonly weights: TerrainSegment[], readonly iguaMaterial: Material) {
        super();

        constructTerrain(this, weights);
    }

    onTransformChanged() {
        this.pivot.set(this.transform.scale.x < 0 ? 1 : 0, this.transform.scale.y < 0 ? 1 : 0);
        this.dirty = true;
    }

    clean() {
        clean(this);
    }
}

class SolidBlockGraphics extends TerrainGraphics {
    private static readonly _Weights: TerrainSegment[] = [
        { x0: 0, y0: 0, x1: 1, y1: 0, isFloor: true },
        { x0: 0, y0: 0, x1: 0, y1: 1, isWallFacingLeft: true },
        { x0: 1, y0: 0, x1: 1, y1: 1, isWallFacingRight: true },
        { x0: 0, y0: 1, x1: 1, y1: 1, isCeiling: true },
    ];

    constructor() {
        super(SolidBlockGraphics._Weights, Material.Earth);
        this.beginFill(0xffffff).drawRect(0, 0, 1, 1);
    }
}

class SolidSlopeGraphics extends TerrainGraphics {
    private static readonly _Weights: TerrainSegment[] = [
        { x0: 0, y0: 1, x1: 1, y1: 0, isFloor: true },
        { x0: 1, y0: 0, x1: 1, y1: 1, isWallFacingRight: true },
        { x0: 0, y0: 1, x1: 1, y1: 1, isCeiling: true },
    ];

    constructor() {
        super(SolidSlopeGraphics._Weights, Material.Earth);
        this.beginFill(0xffffff).drawPolygon([0, 1, 1, 1, 1, 0]);
    }
}

class PipeMesh extends TerrainMesh {
    private static readonly _Weights: TerrainSegment[] = [
        { x0: 0, y0: 0, x1: 1, y1: 0, isFloor: true, isPipe: true },
    ];

    static readonly SlopeWeights: TerrainSegment[] = [
        { x0: 0, y0: 1, x1: 1, y1: 0, isFloor: true, isPipe: true },
    ];

    constructor(weights = PipeMesh._Weights) {
        super(weights, Material.Metal);

        this.texture = NoAtlasTx.Terrain.Pipe.Gray;
    }

    onTransformChanged() {
        super.onTransformChanged();
        if (this.scale.x === 0 || this.scale.y === 0) {
            return;
        }

        renderPipeGraphics(this, this.weights[0]);
    }
}

function renderPipeGraphics(mesh: SimpleMesh, weight: TerrainSegment) {
    // TODO cleanup
    const tx = mesh.texture;

    const x0 = weight.x0;
    const y0 = weight.y0;
    const dy = 0;
    const height = tx.height / mesh.scale.y;
    const x1 = weight.x1;
    const y1 = weight.y1;

    // TODO probably don't need to generate so much garbage
    mesh.verticesBuffer.data = new Float32Array([x0, y0 + dy, x1, y1 + dy, x1, y1 + height + dy, x0, y0 + height + dy]);

    const uvx = tx.baseTexture.wrapMode === WRAP_MODES.REPEAT ? mesh.scale.x / tx.width : 1;

    const uvy0 = 0.5 / tx.height;
    const uvy1 = (tx.height - 0.5) / tx.height;

    mesh.uvBuffer.data = new Float32Array([0, uvy0, uvx, uvy0, uvx, uvy1, 0, uvy1]);
    mesh.geometry.indexBuffer.data = new Uint16Array([0, 1, 3, 1, 2, 3]);
}
