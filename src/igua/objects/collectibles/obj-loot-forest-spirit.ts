import { Tx } from "../../../assets/textures";
import { interpv } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { DramaInventory } from "../../drama/drama-inventory";
import { ask, show } from "../../drama/show";
import { Cutscene } from "../../globals";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { objCharacterForestSpirit } from "../characters/obj-character-forest-spirit";
import { objFxBurstDusty } from "../effects/obj-fx-burst-dusty";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

export function objLootForestSpirit() {
    const api = {
        isCollected: false,
    };

    return objLeaf()
        .merge({ objLootForestSpirit: api })
        .coro(function* (self) {
            yield () => self.objLeaf.isLanded;
            self.visible = false;
            const npcObj = objForestSpiritNpc()
                .at(self)
                .add(0, 4)
                .scaled(0.125, 0.125)
                .show();
            yield interpv(npcObj.scale).steps(3).to(1, 1).over(400);
            yield () => npcObj.destroyed;
            api.isCollected = true;
        });
}

function objForestSpiritNpc() {
    const explanation0 = Rng.choose(
        "I got mixed up in a salad...",
        "I was mistaken for garnish...",
    );

    const explanation1 = Rng.choose(
        "... Then I got eaten.",
        "... Then I got MUNCHED on!",
    );

    let isDying = false;

    // TODO voice SFX
    return objCharacterForestSpirit()
        .mixin(mxnCutscene, function* () {
            if (isDying) {
                return;
            }
            yield* show("Thanks for rescuing me!", explanation0, explanation1);

            for (let i = 0; i < 2; i++) {
                const result = yield* ask(
                    i === 0
                        ? "In my travels, I've found some Essence. Would you like some?"
                        : "So, where do you want it?",
                    i === 0 ? "6 in pocket" : "Yes, 6 in pocket",
                    i === 0 ? "3 on keyring" : "Yes, 3 on keyring",
                    i === 0 ? "What is essence?" : null,
                );

                if (result === 0) {
                    yield* DramaInventory.receiveCount({ kind: "pocket_item", id: "EssenceForest" }, 6);
                }
                else if (result === 1) {
                    yield* DramaInventory.receiveCount({ kind: "key_item", id: "EssenceForest" }, 3);
                }
                else if (result === 2) {
                    yield* show(
                        "The council's forest division sends us around to find Essence.",
                        "The council is always looking to the past.",
                        "So, I think the Essence is a trace of the Wizard of Forest who left this world so long ago.",
                        "But its nature has never been explained to us. Always keeping secrets, of course.",
                        "It's impossible to believe that the council has a clue what they are doing.",
                        "So to give it to you is, without a doubt, an act that leaves it in more capable hands.",
                    );
                }
            }

            yield* show(
                "I'll get going now.",
                "Thanks again.",
            );

            isDying = true;
        })
        .coro(function* (self) {
            yield () => !Cutscene.isPlaying && isDying;
            // TODO SFX
            objFxBurstDusty()
                .at(self.getWorldCenter())
                .show();
            self.destroy();
        });
}

const forestLeafTxs = Tx.Characters.ForestSpirit.Leaf.split({ count: 2 });

function objLeaf() {
    const api = {
        isLanded: false,
    };

    return objIndexedSprite(forestLeafTxs)
        .merge({ objLeaf: api })
        .pivoted(13, 6)
        .mixin(mxnPhysics, { gravity: 0.1, physicsRadius: 4, terminalVelocity: 3 })
        .step(self => {
            if (self.speed.x !== 0) {
                self.scale.x = -Math.sign(self.speed.x);
            }
            if (self.speed.y !== 0) {
                self.textureIndex = self.speed.y > 0 ? 0 : 1;
            }
        })
        .coro(function* (self) {
            self.speed.y = -4;
            self.physicsEnabled = false;
            yield sleepf(2);
            self.physicsEnabled = true;
            yield () => self.speed.y >= 0;
            let ticks = 0;
            const swishObj = container()
                .step(() => {
                    ticks++;
                    const t = Math.PI * (ticks / 60);
                    self.speed.x = approachLinear(self.speed.x, Math.sin(t), 0.1);
                    self.speed.y = approachLinear(self.speed.y, -Math.abs(Math.sin(t)), Math.abs(Math.sin(t)) / 7);
                })
                .show(self);

            yield () => self.isOnGround;
            swishObj.destroy();
            self.speed.at(0, 0);
            api.isLanded = true;
        });
}
