import { Container } from "pixi.js";
import { Logging } from "../lib/logging";

export class IguaLayers {
    readonly scene: Container;
    readonly hud: Container;

    constructor(private readonly _root: Container) {
        this.scene = new Container();
        this.hud = new Container();
        _root.addChild(this.scene, this.hud);
        console.log(...Logging.componentArgs(this));
    }
}