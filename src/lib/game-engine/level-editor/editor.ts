import { Container, DisplayObject } from "pixi.js";
import { TickerContainer } from "../ticker-container";
import { AsshatTicker } from "../asshat-ticker";
import { createPixiRenderer } from "../pixi-renderer";

export type LevelEntityFactoryMap = Record<string, (...args: any[]) => DisplayObject>;

interface Entity {
    id: number;
    key: string;
    x: number;
    y: number;
}

export class LevelEditor {
    private _entities: Entity[] = [];

    get entities(): ReadonlyArray<Readonly<Entity>> {
        return this._entities;
    }

    private _displayObjectsTicker = new AsshatTicker()
    private _displayObjects = new TickerContainer(this._displayObjectsTicker, false).named('LevelEditor._displayObjects');

    constructor(readonly map: LevelEntityFactoryMap, readonly root: TickerContainer) {
        this._displayObjects.show(root);
    }

    create(key: string, x: number, y: number) {
        // TODO layers
        // TODO scale
        // TODO rotation
        // TODO other properties
        this._entities.push({
            id: uuid(),
            key,
            x,
            y,
        });

        const displayObject = this.map[key]();
        displayObject.at(x, y).show(this._displayObjects);
    }

    static createRenderer() {
        return createPixiRenderer({
            width: 1920,
            height: 1080,
            eventFeatures: { click: false, globalMove: false, move: false, wheel: false, },
            eventMode: "none",
        });
    }
}

let uuidPrevious = -1;

function uuid() {
    const next = Math.max(Date.now() * 10, uuidPrevious + 1);
    uuidPrevious = next;
    return next;
}