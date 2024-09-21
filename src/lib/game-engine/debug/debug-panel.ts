import { BitmapText, Container, DisplayObject, Graphics, ILineStyleOptions, Rectangle, Sprite } from "pixi.js";
import { AdjustColor } from "../../pixi/adjust-color";
import { container } from "../../pixi/container";
import { Undefined } from "../../types/undefined";
import { TickerContainer } from "../ticker-container";
import { createDebugKey } from "./debug-key";
import { elDebugPanel } from "../elements/el-debug-panel";
import { _Internal_Collision } from "../../pixi/collision";

export function createDebugPanel(root: Container) {
    if (displayObjectMonitor) {
        throw new Error("Multiple calls to createDebugPanel() detected!");
    }

    displayObjectMonitor = objDisplayObjectMonitor().show(root);

    const el = elDebugPanel();
    el.appendChild(new DisplayObjectComponent(root).el);

    createDebugKey("F9", "debugPanel_isOpen", x => el.classList[x ? "remove" : "add"]("hidden"));

    return el;
}

function objDisplayObjectMonitor() {
    let displayObject = Undefined<DisplayObject>();

    const c = container().merge({
        track(obj: DisplayObject) {
            displayObject = obj;
        },
        clear(obj: DisplayObject) {
            if (displayObject === obj) {
                displayObject = undefined;
            }
        },
    });

    const r = new Rectangle();

    const innerStyle: ILineStyleOptions = { width: 1, color: 0xffffff, alignment: 1 };
    const outerStyle: ILineStyleOptions = { width: 1, color: 0x000000, alignment: 1 };

    const gfx = new Graphics().step(() => {
        gfx.clear();
        if (!displayObject || displayObject.destroyed) {
            return;
        }

        const { tx: x, ty: y } = displayObject.worldTransform;

        displayObject.getBounds(false, r);
        gfx.lineStyle(innerStyle).drawRect(r.x, r.y, r.width, r.height)
            .lineStyle(outerStyle).drawRect(r.x - 1, r.y - 1, r.width + 2, r.height + 2)
            .lineStyle(innerStyle)
            .beginFill(0x000000).drawRect(x, y, 1, 1);

        const collisionRectangles = _Internal_Collision.getCollisionRectangles(displayObject);
        if (!collisionRectangles) {
            return;
        }

        gfx.lineStyle(0).beginFill(0xff0000, 0.3);

        for (const rectangle of collisionRectangles) {
            gfx.drawRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        }
    }).show(c);

    return c;
}

let displayObjectMonitor: ReturnType<typeof objDisplayObjectMonitor>;

const displayObjectComponents = new WeakMap<DisplayObject, DisplayObjectComponent>();

class DisplayObjectComponent {
    expanded = false;
    readonly el = document.createElement("div");
    private readonly _headerEl = this.div("header");
    private readonly _nameContainerEl = this.div("name_container", this._headerEl);
    private readonly _colorEl = this.dom("span", "color", this._nameContainerEl);
    private readonly _nameEl = this.dom("span", "name", this._nameContainerEl);
    private readonly _typeEl = this.dom("span", "type", this._nameContainerEl);
    private readonly _buttonsEl = this.div("buttons", this._nameContainerEl);
    private readonly _propertiesEl = this.div("properties", this._headerEl);
    private readonly _infoEl = this.div("info", this._headerEl);
    private readonly _childrenEl = this.div("children");

    constructor(readonly obj: DisplayObject, readonly index = 0) {
        displayObjectComponents.set(obj, this);
        if (index % 2 === 1) {
            this.el.className = "odd";
        }
        this._typeEl.textContent = getType(obj);
        this._nameEl.textContent = getName(obj);
        this._propertiesEl.textContent = getExtendedPropertyKeysString(obj);

        this._headerEl.onmouseenter = () => {
            displayObjectMonitor.track(obj);
        };

        this._headerEl.onmouseleave = () => {
            displayObjectMonitor.clear(obj);
        };

        const toggleExpand = this.dom("button", undefined, this._buttonsEl);
        toggleExpand.textContent = "Expand";
        toggleExpand.onclick = () => {
            this.expanded = !this.expanded;
            toggleExpand.textContent = this.expanded ? "Collapse" : "Expand";
            this.update();
        };

        if (obj["Stack"]) {
            const getStack = this.dom("button", undefined, this._buttonsEl);
            getStack.textContent = "Stack";
            getStack.onclick = () => console.warn(obj["Stack"]);
        }

        const logObj = this.dom("button", undefined, this._buttonsEl);
        logObj.textContent = "Log";
        logObj.onclick = () => obj.log();

        obj.once("destroyed", () => displayObjectComponents.delete(obj));
        obj.on("childAdded", () => this.update());
        obj.on("childRemoved", () => this.update());

        this.update();
    }

    private div(className?: string, target: HTMLElement = this.el) {
        return this.dom("div", className, target);
    }

    private dom(tag = "div", className?: string, target: HTMLElement = this.el) {
        const el = document.createElement(tag);
        if (className) {
            el.className = className;
        }
        target.appendChild(el);
        return el;
    }

    update() {
        const color = getTintCssColor(this.obj);
        this._colorEl.classList[color ? "remove" : "add"]("hidden");
        if (color) {
            this._colorEl.style.backgroundColor = color;
        }

        this._infoEl.textContent = getTypeInformationString(this.obj);

        this._childrenEl.classList[this.expanded ? "remove" : "add"]("hidden");

        if (this.expanded && this.obj.children) {
            for (let i = 0; i < this.obj.children.length; i++) {
                const childObj = this.obj.children[i] as DisplayObject;
                const component = displayObjectComponents.get(childObj)
                    ?? new DisplayObjectComponent(childObj, this.index + 1);

                const childNode = this._childrenEl.childNodes[i];
                if (childNode === component.el) {
                    continue;
                }

                if (component.el.isConnected) {
                    component.el.remove();
                }
                if (childNode) {
                    childNode.before(component.el);
                    childNode.remove();
                }
                else {
                    this._childrenEl.appendChild(component.el);
                }
            }
            while (this._childrenEl.childNodes.length > this.obj.children.length) {
                this._childrenEl.lastChild?.remove();
            }
        }
    }
}

function getType(obj: DisplayObject) {
    return constructorName.get(obj.constructor) ?? obj.constructor.name;
}

const constructorName = new WeakMap<Function, string>();
constructorName.set(Container, "Container");
constructorName.set(Sprite, "Sprite");
constructorName.set(Graphics, "Graphics");
constructorName.set(BitmapText, "BitmapText");

function getName(obj: DisplayObject) {
    return (obj.isMask ? "🎭" : "") + (obj.name ?? obj["Name"] ?? "?");
}

const getTypeInformationString = (obj: DisplayObject) => {
    let string = "";

    if (obj.children) {
        const length = obj.children!.length;

        if (length > 0 || obj.constructor === Container || obj.constructor === TickerContainer) {
            if (length === 1) {
                string += "1 child";
            }
            else {
                string += length + " children";
            }
        }
    }

    if (obj["texture"]) {
        if (string) {
            string += ", ";
        }

        string += (obj as Sprite).texture.getId();
    }

    if (obj["text"]) {
        if (string) {
            string += ", ";
        }

        string += obj["text"];
    }

    return string;
};

const getTintCssColor = (obj: DisplayObject) => {
    if ("tint" in obj) {
        const tint = obj.tint as number;
        if (obj instanceof Sprite || obj instanceof Graphics) {
            if (tint === 0xffffff) {
                return;
            }
        }
        const { r, g, b } = AdjustColor.pixi(tint).toRgb();
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }

    return;
};

const getExtendedPropertyKeysString = (() => {
    const keys = new Set([
        ...Object.keys(new Container()),
        ...Object.keys(new Graphics()),
        ...Object.keys(new Sprite()),
        "containerUpdateTransform",
        "getChildByName",
        "displayObjectUpdateTransform",
        "_cacheAsBitmap",
        "_cacheData",
        "_cacheAsBitmapResolution",
        "_cacheAsBitmapMultisample",
        "_renderCached",
        "_initCachedDisplayObject",
        "_renderCachedCanvas",
        "_initCachedDisplayObjectCanvas",
        "_calculateCachedBounds",
        "_getCachedLocalBounds",
        "_destroyCachedDisplayObject",
        "_cacheAsBitmapDestroy",
        "name",
        "getGlobalPosition",
        "onclick",
        "onmousedown",
        "onmouseenter",
        "onmouseleave",
        "onmousemove",
        "onglobalmousemove",
        "onmouseout",
        "onmouseover",
        "onmouseup",
        "onmouseupoutside",
        "onpointercancel",
        "onpointerdown",
        "onpointerenter",
        "onpointerleave",
        "onpointermove",
        "onglobalpointermove",
        "onpointerout",
        "onpointerover",
        "onpointertap",
        "onpointerup",
        "onpointerupoutside",
        "onrightclick",
        "onrightdown",
        "onrightup",
        "onrightupoutside",
        "ontap",
        "ontouchcancel",
        "ontouchend",
        "ontouchendoutside",
        "ontouchmove",
        "onglobaltouchmove",
        "ontouchstart",
        "onwheel",
        "_internalInteractive",
        "interactive",
        "_internalEventMode",
        "eventMode",
        "isInteractive",
        "interactiveChildren",
        "hitArea",
        "addEventListener",
        "removeEventListener",
        "dispatchEvent",
        "accessible",
        "accessibleTitle",
        "accessibleHint",
        "tabIndex",
        "_accessibleActive",
        "_accessibleDiv",
        "accessibleType",
        "accessiblePointerEvents",
        "accessibleChildren",
        "renderId",
        "eventNames",
        "listeners",
        "listenerCount",
        "emit",
        "on",
        "once",
        "removeListener",
        "removeAllListeners",
        "off",
        "addListener",
        // BitmapText
        "_activePagesMeshData",
        "_textWidth",
        "_textHeight",
        "_align",
        "_font",
        "_fontName",
        "_fontSize",
        "_text",
        "dirty",
        "_maxWidth",
        "_maxLineHeight",
        "_letterSpacing",
        "_resolution",
        "_autoResolution",
        "_textureCache",
        // Asshat
        "_ticker",
        "cancellationToken",
        "_collisionShape",
        "_collisionShapeDisplayObjects",
        "Name",
        "Stack",
        "_cancellationToken",
        "_mixins",
    ]);

    return (obj: DisplayObject) => {
        let string = "";
        for (const key in obj) {
            if (keys.has(key)) {
                continue;
            }
            if (string) {
                string += ", ";
            }
            string += key;
        }
        return string;
    };
})();
