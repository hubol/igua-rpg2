import { Container } from "pixi.js";

export class IguaLayers {
    readonly scene: Container;
    readonly hud: Container;

    constructor(private readonly _root: Container) {
        this.scene = new Container();
        this.hud = new Container();
        _root.addChild(this.scene, this.hud);
        console.log(this);
    }
}