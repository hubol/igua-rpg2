import { Container, DisplayObject } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { Instances } from "../../lib/game-engine/instances";
import { Jukebox } from "../core/igua-audio";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { playerObj } from "../objects/obj-player";
import { OgmoFactory } from "../ogmo/factory";
import { RpgAttack } from "../rpg/rpg-attack";

const atkSpikeBall = RpgAttack.create({ physical: 30 });

export function scnWorldMap() {
    if (Jukebox.currentTrack === null) {
        Jukebox.play(Mzk.PoopPainter);
    }

    const lvl = Lvl.WorldMap();
    Instances(OgmoFactory.createDecal).filter(x => x.texture === Tx.WorldMap.Cloud0).forEach(x =>
        x.mixin(mxnSinePivot)
    );
    Instances(OgmoFactory.createDecal).filter(x => x.texture === Tx.Enemy.SpikeBall).forEach(x =>
        x.mixin(mxnRpgAttack, { attack: atkSpikeBall })
    );
    Object.entries(lvl).flatMap(([key, value]) =>
        key.endsWith("Label") && value instanceof DisplayObject ? [value] : []
    ).forEach(x => x.mixin(mxnBoilPivot));

    enrichSimpleSecretValuables(lvl);
}

function enrichSimpleSecretValuables(lvl: LvlType.WorldMap) {
    lvl.RedSecretGroup.children.forEach(obj =>
        obj.step(self => {
            if (playerObj.collides(self)) {
                self.play(Sfx.Effect.BallonPop.rate(0.5, 2));
                self.destroy();
            }
        })
    );

    lvl.SimpleSecretValuablesGate.coro(function* (self) {
        yield () => lvl.RedSecretGroup.children.length === 0;
        self.interact.enabled = true;
    })
        .interact.enabled = false;
}
