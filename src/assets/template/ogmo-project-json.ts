import { VectorSimple } from "../../lib/math/vector-type";

export namespace OgmoProjectJson {
    export interface Entity {
        exportID: string;
        name: string;
        limit: number;
        size: VectorSimple;
        origin: VectorSimple;
        originAnchored: boolean;
        shape: unknown;
        color: string;
        tileX: boolean;
        tileY: boolean;
        tileSize: VectorSimple;
        resizeableX: boolean;
        resizeableY: boolean;
        rotatable: boolean;
        rotationDegrees: number;
        canFlipX: boolean;
        canFlipY: boolean;
        flipOnlyScales: boolean;
        canSetColor: boolean;
        hasNodes: boolean;
        hasUid: boolean;
        nodeLimit: number;
        nodeDisplay: number;
        nodeGhost: boolean;
        tags: string[];
        values: Record<string, any>;
        isRegion: boolean;
        tintable: { enabled: boolean; defaultTint: string; rgbLevelValueName: string; useDefaultTint: boolean };
    }
}
