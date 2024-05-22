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

enum Update {
    Index,
    Transform,
    Other,
}

export class LevelEditor {
    private _entities: Entity[] = [];

    get entities(): ReadonlyArray<Readonly<Entity>> {
        return this._entities;
    }

    private _displayObjectsTicker = new AsshatTicker()
    private _displayObjects = new TickerContainer(this._displayObjectsTicker, false).named('LevelEditor._displayObjects');

    private readonly _entityToDisplayObject = new Map<Entity, DisplayObject>();

    constructor(readonly map: LevelEntityFactoryMap, readonly root: TickerContainer) {
        // Extremely crude proof of concept!
        const entity = this.create('Block', 0, 0);
        const preview = this._displayObjects.children[0];
        preview.alpha = 0.5;

        document.addEventListener('pointermove', e => {
            entity.x = e.clientX;
            entity.y = e.clientY;
            this.update(entity);
        })

        this._displayObjects.show(root);
    }

    create(key: string, x: number, y: number) {
        // TODO layers
        // TODO scale
        // TODO rotation
        // TODO other properties
        const entity: Entity = {
            id: uuid(),
            key,
            x,
            y,
        };

        this._entities.push(entity);

        const displayObject = this.map[key]();
        displayObject.at(x, y).show(this._displayObjects);

        this._entityToDisplayObject.set(entity, displayObject);

        return entity;
    }

    update(entity: Entity, type = Update.Transform) {
        const displayObject = this._entityToDisplayObject.get(entity);
        if (!displayObject)
            throw new Error(`Could not find DisplayObject for Entity ${entity.key} ${entity.id}`);

        // TODO use type to determine what parts to update
        displayObject.at(entity);
    }

    static createRenderer() {
        // TODO definitely doesn't belong here
        document.querySelector('html')!.classList.add('level_editor');

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