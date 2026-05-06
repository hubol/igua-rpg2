import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaQuests } from "../drama/drama-quests";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnShadowFloor } from "../mixins/mxn-shadow-floor";
import { objCharacterSimpleBot } from "../objects/characters/obj-character-simple-bot";
import { CtxPocketItems } from "../objects/collectibles/obj-collectible-pocket-item-spawner";
import { objAngelChill } from "../objects/enemies/obj-angel-chill";
import { objBossMusicPlayer } from "../objects/obj-boss-music-player";
import { Rpg } from "../rpg/rpg";

export function scnPlainsSuggestiveCavern() {
    CtxPocketItems.value.pocketItemIds.typeA = "RobotHair";
    Jukebox.play(Mzk.HomeFine).warm(Mzk.SodaMachine);
    const lvl = Lvl.PlainsSuggestiveCavern();
    enrichGatekeeper(lvl);
    enrichShopkeeper(lvl);
    enrichChillEnemy(lvl);
    enrichSimpleBot(lvl);
}

function enrichChillEnemy(lvl: LvlType.PlainsSuggestiveCavern) {
    const chillAngelObj = objAngelChill().at(lvl.ChillBossMarker).zIndexed(ZIndex.Entities).show();
    chillAngelObj.handles("mxnEnemy.died", () => {
        lvl.ExitChillEnemyDoor.coro(function* (self) {
            yield interpvr(self).factor(factor.sine).to(lvl.ExitChillEnemyDoorMarker).over(5000);
        });
    });
    objBossMusicPlayer({
        bossObjs: [chillAngelObj],
        mzkBattle: Mzk.FuckerLand,
        mzkPeace: Mzk.HomeFine,
    })
        .show();
}

function enrichGatekeeper(lvl: LvlType.PlainsSuggestiveCavern) {
    let opening = false;

    lvl.Gatekeeper.mixin(mxnCutscene, function* () {
        if (!opening) {
            if (yield* ask("Ready to go?")) {
                lvl.MovingCeilingBlock.coro(function* (self) {
                    const dx = self.width;
                    const duration = 20_000;

                    yield* Coro.all([
                        interpvr(self).factor(factor.sine).translate(dx, 0).over(duration),
                        interpvr(lvl.MovingCeilingBlockDecals).factor(factor.sine).translate(dx, 0).over(duration),
                    ]);
                });
                opening = true;

                yield* show("OK! See ya!");
                return;
            }

            yield* show("Let me know if you change your mind.");
            return;
        }

        yield* show("Please proceed upwards to leave.");
    });
}

function enrichShopkeeper(lvl: LvlType.PlainsSuggestiveCavern) {
    lvl.Shopkeeper.mixin(mxnCutscene, function* () {
        // TODO extract tints from speaker?
        yield* dramaShop("SuggestiveCavern", { tintPrimary: 0x103418, tintSecondary: 0xA5A17E });
    });
}

function enrichSimpleBot(lvl: LvlType.PlainsSuggestiveCavern) {
    const botCosm = Rpg.microcosms["SuggestiveCavern.SimpleBot"];

    objCharacterSimpleBot()
        .at(lvl.SimpleBotMarker)
        .zIndexed(ZIndex.CharacterEntities)
        .mixin(mxnShadowFloor, { offset: [0, 2] })
        .mixin(mxnCutscene, function* () {
            yield* show("Have you found my lost chakras?");
            const result = yield* DramaInventory.askWhichAndRemoveOne([{ kind: "pocket_item", id: "RobotHair" }]);
            if (!result) {
                return;
            }

            const questId = botCosm.getQuestIdForPocketItem(result.id);
            const reward = yield* DramaQuests.complete(questId);

            if (!reward || reward.isExtended) {
                yield* show("I already had enough of that. But thanks!");
            }
        })
        .step(self => {
            self.objCharacterSimpleBot.wigVisible = botCosm.hairClumpsCount > 0;
            self.objCharacterSimpleBot.mulletVisible = botCosm.hairClumpsCount > 1;
        })
        .show();
}
