import { Sprite, Texture } from "pixi.js";
import { OgmoEntities } from "../../../assets/generated/levels/generated-ogmo-project-data";
import { Tx } from "../../../assets/textures";
import { holdf } from "../../../lib/game-engine/routines/hold";
import { interp, interpr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { DataPocketItem } from "../../data/data-pocket-item";
import { ask, show } from "../../drama/show";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { Rpg } from "../../rpg/rpg";
import { objUiBubbleNumber } from "../overlay/obj-ui-bubble-numbers";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txs = Tx.Esoteric.StashPocket.split({ count: 3 });

export function objStashPocket({ uid }: OgmoEntities.StashPocket) {
    const depositInfoArgs = { controls: {} } as ObjStashPocketDepositedInfoArgs;

    function updateDepositInfoArgs() {
        const deposited = Rpg.stashPocket(uid).check();
        if (deposited.kind === "empty") {
            depositInfoArgs.controls.count = 0;
            depositInfoArgs.controls.pocketItemId = null;
        }
        else {
            depositInfoArgs.controls.count = deposited.count;
            depositInfoArgs.controls.pocketItemId = deposited.pocketItemId;
        }
    }

    updateDepositInfoArgs();

    const spriteObj = objIndexedSprite(txs)
        .pivoted(23, 41);

    return container(
        spriteObj
            .mixin(mxnSpeaker, { name: "Pocket Stash", colorPrimary: 0x54BAFF, colorSecondary: 0xFFB200 })
            .mixin(mxnCutscene, function* () {
                yield interp(spriteObj, "textureIndex").to(3).over(250);

                const deposited = Rpg.stashPocket(uid).check();
                const operations = Rpg.stashPocket(uid).checkPossibleOperations();

                const message = deposited.kind === "empty"
                    ? "Stash is empty."
                    : `Stash contains ${DataPocketItem.getById(deposited.pocketItemId).name} x${deposited.count}.`;

                yield* show(message);
                const result = yield* ask(
                    `${message}\n\nWhat to do?`,
                    operations.includes("deposit") ? "Deposit" : null,
                    operations.includes("withdraw") ? "Withdraw" : null,
                    operations.includes("swap") ? "Swap" : null,
                    "Nothing",
                );

                if (result === 0) {
                    Rpg.stashPocket(uid).deposit();
                }
                else if (result === 1) {
                    Rpg.stashPocket(uid).withdraw();
                }
                else if (result === 2) {
                    Rpg.stashPocket(uid).swap();
                }

                yield interp(spriteObj, "textureIndex").to(0).over(250);
            }),
        objStashPocketDepositedInfo(depositInfoArgs)
            .step(updateDepositInfoArgs),
    );
}

interface ObjStashPocketDepositedInfoArgs {
    controls: {
        pocketItemId: DataPocketItem.Id | null;
        count: Integer;
    };
}

function objStashPocketDepositedInfo({ controls }: ObjStashPocketDepositedInfoArgs) {
    const pocketItemSpriteObj = objSpriteWithAnimatedTextureChange(getTx(controls));
    const bubbleNumberObj = objUiBubbleNumber({ value: controls.count });

    return container(
        pocketItemSpriteObj
            .mixin(mxnBoilPivot)
            .at(0, -44),
        bubbleNumberObj
            .at(0, -62)
            .invisible()
            .coro(function* (self) {
                while (true) {
                    yield () => controls.count !== 0;
                    self.visible = true;
                    yield holdf(() => controls.count === 0, 120);
                    self.visible = false;
                }
            }),
    )
        .step(() => {
            pocketItemSpriteObj.controls.texture = getTx(controls);
            bubbleNumberObj.controls.value = approachLinear(bubbleNumberObj.controls.value, controls.count, 11);
        });
}

function getTx(controls: ObjStashPocketDepositedInfoArgs["controls"]) {
    const pocketItemId = controls.count ? controls.pocketItemId : null;
    return pocketItemId ? DataPocketItem.getById(pocketItemId).texture : null;
}

function objSpriteWithAnimatedTextureChange(texture: Texture | null) {
    const controls = { texture };

    return new Sprite(texture ? texture : undefined)
        .anchored(0.5, 0.5)
        .merge({ controls })
        .coro(function* (self) {
            while (true) {
                yield () => texture !== controls.texture;
                const nextTexture = controls.texture;
                if (!nextTexture) {
                    self.alpha = 0.5;
                    yield sleep(250);
                    self.alpha = 1;
                    self.visible = false;
                }
                else if (!texture) {
                    self.visible = true;
                    self.alpha = 0.5;
                    self.texture = nextTexture;
                    yield sleep(250);
                    self.alpha = 1;
                }
                else {
                    self.visible = true;
                    self.angle = 0;
                    yield interpr(self, "angle").steps(8).to(720).over(500);
                    self.texture = nextTexture;
                }

                texture = nextTexture;
            }
        });
}
