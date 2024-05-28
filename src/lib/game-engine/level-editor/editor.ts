import { Container, DisplayObject } from "pixi.js";
import { TickerContainer } from "../ticker-container";
import { AsshatTicker } from "../asshat-ticker";
import { createPixiRenderer } from "../pixi-renderer";
import { cyclic } from "../../math/number";
import { JsonDirectory } from "../../browser/json-directory";

// TODO all of these names need TLC
export type LevelDisplayObjectConstructors = Record<string, (...args: any[]) => DisplayObject>;

interface Entity {
    id: number;
    kind: string;
    x: number;
    y: number;
}

enum Update {
    Index,
    Transform,
    Other,
}

interface SaveFile {
    entities: Entity[];
}

export class LevelEditor {
    private _entities: Entity[] = [];

    get entities(): ReadonlyArray<Readonly<Entity>> {
        return this._entities;
    }

    private _displayObjectsTicker = new AsshatTicker()
    private _displayObjects = new TickerContainer(this._displayObjectsTicker, false).named('LevelEditor._displayObjects');

    private _brushKind?: string;
    private _brushContainer = new Container().named('LevelEditor._brushContainer');

    private readonly _entityToDisplayObject = new Map<Entity, DisplayObject>();

    private constructor(
        readonly displayObjectConstructors: LevelDisplayObjectConstructors,
        readonly root: TickerContainer,
        private readonly _jsonDirectory: JsonDirectory) {
        // Extremely crude proof of concept!
        document.addEventListener('pointermove', e => {
            this._brushContainer.at(e.clientX, e.clientY);
        })

        document.addEventListener('pointerdown', e => {
            if (this._brushKind)
                this.create(this._brushKind, e.clientX, e.clientY);
        })

        const kinds = Object.keys(displayObjectConstructors);

        // TODO probably won't be wheel in the end
        document.addEventListener('wheel', e => {
            const delta = Math.sign(e.deltaY);
            if (delta === 0)
                return;

            const index = kinds.indexOf(this._brushKind!);
            const nextIndex = cyclic(index + delta, 0, kinds.length);
            this.setBrushKind(kinds[nextIndex]);
        })

        // More crude stuff
        document.addEventListener('keydown', e => {
            if (!e.ctrlKey)
                return;
            if (e.key === 's') {
                e.preventDefault();
                setTimeout(() => this.save());
            }
            if (e.key === 'o') {
                e.preventDefault();
                setTimeout(() => this.load());
            }
        });

        this._displayObjects.show(root);

        this._brushContainer.alpha = 0.5;
        this._brushContainer.show(root);
    }

    static async create(
        displayObjectConstructors: LevelDisplayObjectConstructors,
        root: TickerContainer,) {
        // TODO not sure if literal is ok
        const jsonDirectory = await JsonDirectory.create('LevelEditor');
        return new LevelEditor(displayObjectConstructors, root, jsonDirectory);
    }

    setBrushKind(kind: string) {
        const displayObject = this._constructDisplayObject(kind);
        this._brushContainer.removeAllChildren();
        displayObject.show(this._brushContainer);
        this._brushKind = kind;
    }

    create(kind: string, x: number, y: number) {
        // TODO layers
        // TODO scale
        // TODO rotation
        // TODO other properties
        const entity: Entity = {
            id: uuid(),
            kind,
            x,
            y,
        };

        this._trackEntity(entity);

        return entity;
    }

    // TODO name sucks
    private _trackEntity(entity: Entity) {
        this._entities.push(entity);
    
        const displayObject = this._constructDisplayObject(entity.kind);
        displayObject.at(entity.x, entity.y).show(this._displayObjects);

        this._entityToDisplayObject.set(entity, displayObject);
    }

    update(entity: Entity, type = Update.Transform) {
        const displayObject = this._entityToDisplayObject.get(entity);
        if (!displayObject)
            throw new Error(`Could not find DisplayObject for Entity ${entity.kind} ${entity.id}`);

        // TODO use type to determine what parts to update
        displayObject.at(entity);
    }

    async save() {
        // TODO determine file to write to
        await this._jsonDirectory.write<SaveFile>('level.json', { entities: this._entities });
    }

    async load() {
        // TODO determine file to read from
        const file = await this._jsonDirectory.read<SaveFile>('level.json');
        if (!file?.entities) {
            return;
        }

        this._entities.length = 0;
        this._entityToDisplayObject.clear();
        this._displayObjects.removeAllChildren();
        for (const entity of file.entities)
            this._trackEntity(entity);
    }

    private _constructDisplayObject(kind: string) {
        const ctor = this.displayObjectConstructors[kind];
        if (!ctor)
            throw new Error(`Could not find DisplayObject constructor for kind ${kind}`);
        return ctor();
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