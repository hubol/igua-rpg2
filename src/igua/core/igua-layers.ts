import { Container } from "pixi.js";
import { Logging } from "../../lib/logging";
import { ObjOverlay, objOverlay } from "../objects/overlay/obj-overlay";

export class IguaLayers {
    private readonly _overlayParentObj: Container;
    private _overlayObj: ObjOverlay | null = null;

    readonly scene: Container;

    get overlay(): Omit<ObjOverlay, keyof Container> {
        return this._overlayObj!;
    }

    constructor(private readonly _root: Container) {
        this.scene = new Container().named("SceneStack");
        this._overlayParentObj = new Container().named("OverlayParent");

        this.recreateOverlay();

        _root.addChild(this.scene, this._overlayParentObj);

        console.log(...Logging.componentArgs(this));
    }

    recreateOverlay() {
        this._overlayObj?.destroy();
        this._overlayObj = objOverlay().named("Overlay").show(this._overlayParentObj);
    }
}
