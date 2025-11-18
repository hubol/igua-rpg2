import { DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { DataFact } from "../data/data-fact";
import { mxnFxFigureTransfer } from "../mixins/effects/mxn-fx-figure-transfer";
import { mxnBoilTextureIndex } from "../mixins/mxn-boil-texture-index";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { objFxBurst32 } from "../objects/effects/obj-fx-burst-32";
import { objFxFactCantFit } from "../objects/effects/obj-fx-fact-cant-fit";
import { objFxFactNew } from "../objects/effects/obj-fx-fact-new";
import { playerObj } from "../objects/obj-player";
import { objIndexedSprite } from "../objects/utils/obj-indexed-sprite";
import { Rpg } from "../rpg/rpg";
import { DramaLib } from "./drama-lib";
import { show } from "./show";

function* memorize(factId: DataFact.Id, ...messages: string[]) {
    if (messages.length === 0) {
        messages = DataFact.getById(factId).messages;
    }

    const [message, ...rest] = messages;
    yield* show(message, ...rest);

    const result = Rpg.character.facts.memorize(factId);

    const factObj = objFxFact(playerObj).at(DramaLib.Speaker.getWorldCenter());

    if (result.accepted) {
        factObj
            .handles("mxnFigureTransfer:transfered", (self) => {
                self.coro(function* () {
                    self.visible = false;
                    const factNewObj = objFxFactNew().at(self).show();
                    yield () => factNewObj.destroyed;
                    self.destroy();
                });
            })
            .show();

        yield () => factObj.destroyed;
    }
    else {
        if (result.reason === "already_memorized") {
            // no-op
        }
        else {
            const startX = factObj.x;
            factObj
                .handles("mxnFigureTransfer:transfered", (self) => {
                    self.play(Sfx.Collect.FactCantFitSmack.rate(0.9, 1.1));
                    const dx = (Math.sign(self.x - startX) || 1) * 8;
                    objFxBurst32().at(self).show();
                    self
                        .step(self => {
                            self.add(-dx, -1);
                            self.angle += dx;
                        })
                        .coro(function* () {
                            const position = self.vcpy();
                            yield sleep(700);
                            const cantFitObj = objFxFactCantFit().at(position).show();
                            yield () => cantFitObj.destroyed;
                            self.destroy();
                        });
                })
                .show();

            yield () => factObj.destroyed;
        }
    }
}

const factTxs = Tx.Effects.FactFigure.split({ count: 3 });

function objFxFact(targetObj: DisplayObject | null) {
    return objIndexedSprite(factTxs)
        .anchored(0.5, 0.5)
        .mixin(mxnBoilTextureIndex)
        .mixin(mxnFxFigureTransfer, { targetObj, gravity: 0.0825, speed: [0, -4] })
        .mixin(mxnSinePivot);
}

export const DramaFacts = {
    memorize,
    objFxFact,
};
