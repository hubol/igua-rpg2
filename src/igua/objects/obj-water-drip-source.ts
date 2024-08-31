import { Sprite } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { Tx } from "../../assets/textures";
import { mxnPhysics } from "../mixins/mxn-physics";
import { sleep } from "../../lib/game-engine/promise/sleep";
import { Rng } from "../../lib/math/rng";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgFaction } from "../rpg/rpg-faction";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { PrommyContext } from "../../lib/zone/prommy";

interface ObjWaterDripSourceArgs {
    delayMin: number;
    delayMax: number;
}

export function objWaterDripSource({ delayMin, delayMax }: ObjWaterDripSourceArgs) {
    return container()
        .track(objWaterDripSource)
        .merge({ poison: false })
        .async(async self => {
            while (true) {
                console.log('asyncWaterDripSource', PrommyContext.current().Name);
                await sleep(Rng.intc(delayMin, delayMax));
                objWaterDrip(self.poison ? atkPoisonDrip : atkDrip).at(self).show(self.parent);
            }
        })
}

const atkPoisonDrip = RpgAttack.create({
    wetness: 5,
    poison: 5,
    versus: RpgFaction.Anyone,
});

const atkDrip = RpgAttack.create({
    wetness: 5,
    versus: RpgFaction.Anyone,
});

function getTx(attack: RpgAttack.Model | null) {
    if (attack == null)
        return Tx.Effects.WaterDripXsmall;
    if (attack.poison)
        return Tx.Effects.PoisonDripSmall;
    return Tx.Effects.WaterDripSmall;
}

export function objWaterDrip(attack: RpgAttack.Model | null) {
    const obj = Sprite.from(getTx(attack))
        .mixin(mxnPhysics, { gravity: 0.05, physicsRadius: 4, physicsOffset: [0, -4], onMove: (ev) => {
            if (ev.hitGround) {
                obj.destroy();
                // TODO drip sfx
            }
        } })

    if (attack)
        obj.mixin(mxnRpgAttack, { attack })
        .handles('mxnRpgAttack.hit', self => self.destroy());

    return obj;
}