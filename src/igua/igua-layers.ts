import { Container } from "pixi.js";
import { Logging } from "../lib/logging";

export class IguaLayers {
    readonly scene: Container;
    readonly hud: Container;

    constructor(private readonly _root: Container) {
        this.scene = new Container().named("Scene");
        this.hud = new Container().named("Hud");
        _root.addChild(this.scene, this.hud);
        console.log(...Logging.componentArgs(this));
    }
}