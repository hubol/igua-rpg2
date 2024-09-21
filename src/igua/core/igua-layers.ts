import { Container } from "pixi.js";
import { Logging } from "../../lib/logging";
import { Overlay, objOverlay } from "../objects/obj-overlay";

export class IguaLayers {
    readonly scene: Container;
    readonly overlay: Overlay;

    constructor(private readonly _root: Container) {
        this.scene = new Container().named("SceneStack");
        const overlayObj = objOverlay().named("Overlay");
        this.overlay = overlayObj;

        _root.addChild(this.scene, overlayObj);

        console.log(...Logging.componentArgs(this));
    }
}
