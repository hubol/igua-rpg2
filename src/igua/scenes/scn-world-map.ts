import { Container, DisplayObject } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { Instances } from "../../lib/game-engine/instances";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { ask, show } from "../drama/show";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objFallenBot } from "../objects/characters/obj-character-fallen-bot";
import { playerObj } from "../objects/obj-player";
import { OgmoFactory } from "../ogmo/factory";
import { Rpg } from "../rpg/rpg";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgSaveFiles } from "../rpg/rpg-save-files";

const atkSpikeBall = RpgAttack.create({ physical: 30 });

export function scnWorldMap() {
    RpgSaveFiles.Current.save();
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
    enrichStrangeMarketGuardian(lvl);
    enrichFallenBot(lvl);
}

function enrichStrangeMarketGuardian(lvl: LvlType.WorldMap) {
    if (!Rpg.flags.strangeMarket.guardian.defeated) {
        lvl.StrangeMarketGate.destroy();
    }
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

function enrichFallenBot(lvl: LvlType.WorldMap) {
    const botObj = objFallenBot();
    botObj
        .mixin(mxnSpeaker, { name: "Fallen Bot", tintPrimary: 0x5E45B7, tintSecondary: 0x4BDDEA })
        .mixin(mxnCutscene, function* () {
            const result = yield* ask("Oh please... Answer me, are there any good programmers left in this world?");
            if (!result) {
                botObj.objFallenBot.mouthObj.controls.frowning = true;
                yield* show("Oh... How it pains me to hear it.");
                botObj.objFallenBot.mouthObj.controls.frowning = false;
            }
        })
        .at(lvl.FallenBotMarker)
        .zIndexed(ZIndex.Entities)
        .show();
}
