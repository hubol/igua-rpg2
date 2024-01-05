import { BitmapText, Container, DisplayObject, Graphics, Sprite } from "pixi.js";
import { AdjustColor } from "../../pixi/adjust-color";
import { Logging } from "../../logging";

export function createDebugPanel(root: Container) {
    const el = document.createElement('div');
    el.className = 'debug_panel';
    el.appendChild(new DisplayObjectComponent(root).el);
    return el;
}

let logObjIndex = 0;

class DisplayObjectComponent {
    expanded = false;
    readonly el = document.createElement('div');
    private readonly _nameContainerEl = this.div('name_container');
    private readonly _colorEl = this.dom('span', 'color', this._nameContainerEl);
    private readonly _nameEl = this.dom('span', 'name', this._nameContainerEl);
    private readonly _buttonsEl = this.div('buttons', this._nameContainerEl);
    private readonly _propertiesEl = this.div('properties');
    private readonly _infoEl = this.div('info');
    private readonly _childrenEl = this.div('children');

    constructor(readonly obj: DisplayObject, readonly index = 0) {
        if (index % 2 === 1)
            this.el.className = 'odd';
        this._nameEl.textContent = getTypeName(obj);
        this._propertiesEl.textContent = getExtendedPropertyKeysString(obj);

        const toggleExpand = this.dom("button", undefined, this._buttonsEl);
        toggleExpand.textContent = "Expand";
        toggleExpand.onclick = () => {
            this.expanded = !this.expanded;
            toggleExpand.textContent = this.expanded ? "Collapse" : "Expand";
            this.update();
        }

        if (obj['Throwable']) {
            const getStack = this.dom("button", undefined, this._buttonsEl);
            getStack.textContent = "Stack";
            getStack.onclick = () => {
                throw obj['Throwable'];   
            }
        }

        const logObj = this.dom("button", undefined, this._buttonsEl);
        logObj.textContent = "Log";
        logObj.onclick = () => {
            while (window['obj' + logObjIndex]) {
                logObjIndex += 1;
            }

            const key = 'obj' + logObjIndex;
            window[key] = obj;
            console.log(...Logging.componentArgs(key, obj));
        }

        this.update();
    }

    private div(className?: string, target: HTMLElement = this.el) {
        return this.dom("div", className, target);
    }

    private dom(tag = "div", className?: string, target: HTMLElement = this.el) {
        const el = document.createElement(tag);
        if (className)
            el.className = className;
        target.appendChild(el);
        return el;
    }

    private readonly _objectsDisplayed = new Set<DisplayObject>();

    update() {
        const color = getTintCssColor(this.obj);
        this._colorEl.classList[color ? 'remove' : 'add']('hidden');
        if (color)
            this._colorEl.style.backgroundColor = color;

        this._infoEl.textContent = getTypeInformationString(this.obj);

        this._childrenEl.classList[this.expanded ? 'remove' : 'add']('hidden');

        if (this.expanded && childrenHaveChanged(this.obj, this._objectsDisplayed)) {
            this._objectsDisplayed.clear();

            while (this._childrenEl.firstChild) {
                this._childrenEl.removeChild(this._childrenEl.firstChild);
            }

            for (let i = 0; i < this.obj.children!.length; i++) {
                const child = this.obj.children![i] as DisplayObject;
                this._childrenEl.appendChild(new DisplayObjectComponent(child, this.index + 1).el);
            }
        }
    }
}

function traverseAndUpdate(c: DisplayObjectComponent) {

}

class DisplayObjectStateComponent {
    readonly el = document.createElement('el');

    constructor() {

    }

    update() {

    }
}

function childrenHaveChanged(obj: DisplayObject, objectsDisplayed: Set<DisplayObject>) {
    if (!obj.children)
        return false;

    if (objectsDisplayed.size !== obj.children.length)
        return true;

    for (let i = 0; i < obj.children.length; i++) {
        const child = obj.children[i] as DisplayObject;
        if (!objectsDisplayed.has(child))
            return true;
    }

    return false;
}

function getFriendlyConstructorName(obj: DisplayObject) {
    return constructorName.get(obj.constructor) ?? obj.constructor.name;
}

const constructorName = new WeakMap<Function, string>();
constructorName.set(Container, 'Container');
constructorName.set(Sprite, 'Sprite');
constructorName.set(Graphics, 'Graphics');
constructorName.set(BitmapText, 'BitmapText');

function getTypeName(obj: DisplayObject) {
    return getFriendlyConstructorName(obj) + ' ' + obj["Name"];
}

const getTypeInformationString = (obj: DisplayObject) => {
    let string = '';

    if (obj.children) {
        const length = obj.children!.length;

        if (length > 0 || !(obj instanceof Container)) {
            if (length === 1)
                string += '1 child';
            else
                string += length + ' children';
        }
    }

    if (obj['texture']) {
        if (string)
            string += ', ';

        string += (obj as Sprite).texture.getId();
    }

    if (obj['text']) {
        if (string)
            string += ', ';

        string += obj['text'];
    }

    return string;
}

const getTintCssColor = (obj: DisplayObject) => {
    if ('tint' in obj) {
        const tint = obj.tint as number;
        if (obj instanceof Sprite || obj instanceof Graphics) {
            if (tint === 0xffffff)
                return;
        }
        const { r, g, b } = AdjustColor.pixi(tint).toRgb();
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }

    return;
}

const getExtendedPropertyKeysString = (() => {
    const keys = new Set([
        ...Object.keys(new Container()),
        ...Object.keys(new Graphics()),
        ...Object.keys(new Sprite()),
        "Name", "Stack", "containerUpdateTransform", "getChildByName",
        "displayObjectUpdateTransform", "_cacheAsBitmap", "_cacheData",
        "_cacheAsBitmapResolution", "_cacheAsBitmapMultisample", "_renderCached",
        "_initCachedDisplayObject", "_renderCachedCanvas", "_initCachedDisplayObjectCanvas",
        "_calculateCachedBounds", "_getCachedLocalBounds", "_destroyCachedDisplayObject",
        "_cacheAsBitmapDestroy", "name", "getGlobalPosition", "onclick", "onmousedown",
        "onmouseenter", "onmouseleave", "onmousemove", "onglobalmousemove", "onmouseout",
        "onmouseover", "onmouseup", "onmouseupoutside", "onpointercancel", "onpointerdown",
        "onpointerenter", "onpointerleave", "onpointermove", "onglobalpointermove",
        "onpointerout", "onpointerover", "onpointertap", "onpointerup", "onpointerupoutside",
        "onrightclick", "onrightdown", "onrightup", "onrightupoutside", "ontap",
        "ontouchcancel", "ontouchend", "ontouchendoutside", "ontouchmove",
        "onglobaltouchmove", "ontouchstart", "onwheel", "_internalInteractive", "interactive",
        "_internalEventMode", "eventMode", "isInteractive", "interactiveChildren", "hitArea",
        "addEventListener", "removeEventListener", "dispatchEvent", "accessible",
        "accessibleTitle", "accessibleHint", "tabIndex", "_accessibleActive",
        "_accessibleDiv", "accessibleType", "accessiblePointerEvents", "accessibleChildren",
        "renderId", "eventNames", "listeners", "listenerCount", "emit", "on", "once",
        "removeListener", "removeAllListeners", "off", "addListener",
        // BitmapText
        "_activePagesMeshData", "_textWidth", "_textHeight", "_align", "_font", "_fontName",
        "_fontSize", "_text", "dirty", "_maxWidth", "_maxLineHeight", "_letterSpacing",
        "_resolution", "_autoResolution", "_textureCache",
        // Asshat
        "_ticker", "cancellationToken", "_collisionShape", "_collisionShapeDisplayObjects",
    ]);

    return (obj: DisplayObject) => {
        let string = '';
        for (const key in obj) {
            if (keys.has(key))
                continue;
            if (string)
                string += ', ';
            // string += '"' + key + '"';
            string += key;
        }
        return string;
    };
})();

export const DebugPanel = {
    
};