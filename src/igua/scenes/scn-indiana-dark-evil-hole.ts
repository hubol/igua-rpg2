import { DisplayObject } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { Instances } from "../../lib/game-engine/instances";
import { container } from "../../lib/pixi/container";
import { Force } from "../../lib/types/force";
import { Jukebox } from "../core/igua-audio";
import { DataItem } from "../data/data-item";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaQuests } from "../drama/drama-quests";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnEnemy } from "../mixins/mxn-enemy";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { playerObj } from "../objects/obj-player";
import { CtxTerrainPipe } from "../objects/obj-terrain";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";
import { RpgQuest } from "../rpg/rpg-quests";
import { TerrainAttributes } from "../systems/terrain-attributes";

const ropeItem: RpgInventory.Item.KeyItem = { kind: "key_item", id: "RescueRope" };

export function scnIndianaDarkEvilHole() {
    Jukebox.play(Mzk.UndergroundRucksack);
    CtxTerrainPipe.value.texture = NoAtlasTx.Terrain.Pipe.AbstractBlack;
    let lvl = Force<LvlDarkEvilHole>();

    const spiritObj = objCaveSpirit();
    const quest = Rpg.quest("DarkEvilHole.Rescue");

    const variantIndex = (quest.timesCompleted + 1) % 2;

    if (variantIndex === 0) {
        lvl = Lvl.IndianaDarkEvilHole();
        enrichVariant0Enemies(lvl, spiritObj);
    }
    else {
        lvl = Lvl.IndianaDarkEvilHoleSpelling();
        enrichVariant1Enemies(lvl, spiritObj);
    }

    enrichFriendNpc(lvl);
    enrichLostNpc(lvl, quest);
}

function enrichVariant1Enemies(lvl: LvlType.IndianaDarkEvilHoleSpelling, spiritObj: objCaveSpirit.Type) {
    [lvl.AngelBlock0, lvl.AngelBlock1, lvl.AngelBlock2]
        .forEach(obj => obj.attributes = TerrainAttributes.Enemy);

    scene.stage
        .coro(function* () {
            yield () => Instances(mxnEnemy).length === 0;
            spiritObj.objCaveSpirit.destroy([lvl.SuggestiveAngelBlock], "a large block");
        });
}

type LvlDarkEvilHole = LvlType.IndianaDarkEvilHole | LvlType.IndianaDarkEvilHoleSpelling;

function enrichFriendNpc(lvl: LvlDarkEvilHole) {
    lvl.FriendNpc
        .mixin(mxnCutscene, function* () {
            yield* show(
                "My friend is obsessed with exploring this Dark, Evil Hole.",
                `He's always like, "Please, ${lvl.FriendNpc.speaker.name}, I'll only explore the first floor!"`,
                `And I'm like, "Okay, ${lvl.LostNpc.speaker.name}, I trust you--completely 100%! Just the first floor!"`,
                "Then I come up in this jawn and he's well below the first floor.",
            );

            if (Rpg.inventory.count(ropeItem) >= 1) {
                yield* show("Please use the rope I gave you to continue this cycle.");
                return;
            }

            if (yield* ask("Will you continue this cycle by rescuing my friend?")) {
                yield* show("Great!");
                yield* DramaInventory.receiveCount(ropeItem, 1);
                yield* show(
                    "Give this to him. He'll use it to climb out and then forget to bring it when he comes back.",
                );
            }
            else {
                yield* show("Okay. Let me know if you reconsider or need a reminder of the situation.");
            }
        });
}

function enrichLostNpc(lvl: LvlDarkEvilHole, quest: RpgQuest) {
    lvl.RopeGroup.visible = false;

    let completedQuest = false;

    lvl.LostNpc
        .mixin(mxnCutscene, function* () {
            if (!completedQuest) {
                const result = yield* DramaInventory.askWhichAndRemoveOne([ropeItem], {
                    message: "Can you help me get out of here?",
                });
                if (!result) {
                    yield* show(":-(");
                    return;
                }

                // TODO sfx
                lvl.RopeGroup.visible = true;

                lvl.EscapeRegion
                    .mixin(mxnSpeaker, {
                        tintPrimary: 0x63410E,
                        tintSecondary: 0x9E6817,
                        name: DataItem.getName(ropeItem),
                    })
                    .mixin(mxnCutscene, function* () {
                        if (yield* ask("Ready to go?")) {
                            playerObj.sparklesPerFrame = 0.3;
                            playerObj.speed.y = -15;
                        }
                    });

                yield* show("Thanks for your help!");

                yield* DramaQuests.complete(quest);
                completedQuest = true;
            }

            yield* show(
                "Feel free to use the rope to escape. Also, can I offer you something in exchange for my rescue?",
            );
            yield* dramaShop("IndianaRescued", lvl.LostNpc.speaker);
        });
}

function enrichVariant0Enemies(lvl: LvlType.IndianaDarkEvilHole, spiritObj: objCaveSpirit.Type) {
    const spikeObjs = [...lvl.MiffedAttacksDestroyRegion.collidesAll(Instances(mxnRpgAttack))];

    lvl.AngelMiffed
        .handles("mxnEnemy.died", () => {
            spiritObj.objCaveSpirit.destroy(spikeObjs, "several spikes");
        });

    lvl.AngelSuggestive
        .handles("mxnEnemy.died", () => {
            spiritObj.objCaveSpirit.destroy([lvl.SuggestiveAngelBlock], "a large block");
        });
}

function objCaveSpirit() {
    const api = {
        destroy(objs: DisplayObject[], objectsDescription: string) {
            Cutscene.play(function* () {
                for (const obj of objs) {
                    obj.destroy();
                }
                yield () => playerObj.isOnGround;
                yield* show(`You hear the sound of ${objectsDescription} disappearing from the world.`);
            }, { speaker: obj });
        },
    };

    const obj = container()
        .mixin(mxnSpeaker, { name: "Spirit of Dark, Evil Hole", tintPrimary: 0x202020, tintSecondary: 0x404040 });

    return obj
        .merge({ objCaveSpirit: api });
}

namespace objCaveSpirit {
    export type Type = ReturnType<typeof objCaveSpirit>;
}
