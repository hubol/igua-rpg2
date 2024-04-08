import { Graphics } from "pixi.js";
import { vnew } from "../../lib/math/vector-type";
import { Rng } from "../../lib/math/rng";

export function MixinTest() {
    for (let i = 0; i < 100; i ++) {
        objTest().at(128, 128).show();
    }
}

function objTest(speed = Rng.vunit()) {
    const g = new Graphics().beginFill(Rng.color()).drawCircle(0, 0, 8)
        .mixin(mxnMoves, true, 'hi');
    
    g.speed.at(speed);

    return g;
}

function mxnMoves(d: Graphics, asdf: boolean, queen: string) {
    return d.merge({ speed: vnew(), asdf, queen })
        .step(src => {
            src.add(src.speed);
        }, 10)
}
