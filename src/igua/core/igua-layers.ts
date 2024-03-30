import { Container } from "pixi.js";
import { Logging } from "../../lib/logging";
import { ObjSolidOverlay, objSolidOverlay } from "./scene/obj-solid-overlay";

export class IguaLayers {
    readonly scene: Container;
    readonly hud: Container;
    readonly solidOverlay: Pick<ObjSolidOverlay, 'fadeIn' | 'fadeOut' | 'tint' | 'blendMode'>;

    constructor(private readonly _root: Container) {
        this.scene = new Container().named("SceneStack");
        this.hud = new Container().named("Hud");
        
        _root.addChild(this.scene, this.hud);
        this.solidOverlay = objSolidOverlay().show(_root);

        console.log(...Logging.componentArgs(this));
    }
}