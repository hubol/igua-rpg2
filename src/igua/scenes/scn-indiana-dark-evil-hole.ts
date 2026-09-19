import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Instances } from "../../lib/game-engine/instances";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";
import { DataItem } from "../data/data-item";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaQuests } from "../drama/drama-quests";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";

const ropeItem: RpgInventory.Item.KeyItem = { kind: "key_item", id: "RescueRope" };

export function scnIndianaDarkEvilHole() {
    Jukebox.play(Mzk.UndergroundRucksack);
    const lvl = Lvl.IndianaDarkEvilHole();
    enrichEnemies(lvl);
    enrichFriendNpc(lvl);
    enrichLostNpc(lvl);
}

function enrichFriendNpc(lvl: LvlType.IndianaDarkEvilHole) {
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
                yield* show("I appreciate you.");
            }
            else {
                yield* show("Okay. Let me know if you reconsider or need a reminder of the situation.");
            }
        });
}

function enrichLostNpc(lvl: LvlType.IndianaDarkEvilHole) {
    lvl.RopeGroup.visible = false;

    const quest = Rpg.quest("DarkEvilHole.Rescue");
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

function enrichEnemies(lvl: LvlType.IndianaDarkEvilHole) {
    const spikeObjs = [...lvl.MiffedAttacksDestroyRegion.collidesAll(Instances(mxnRpgAttack))];

    const speakerObj = container()
        .mixin(mxnSpeaker, { name: "Spirit of Dark, Evil Hole", tintPrimary: 0x202020, tintSecondary: 0x404040 });

    lvl.AngelMiffed
        .handles("mxnEnemy.died", () => {
            Cutscene.play(function* () {
                spikeObjs.forEach(obj => obj.destroy());
                yield () => playerObj.isOnGround;
                yield* show("You hear the sound of several spikes disappearing from the world.");
            }, { speaker: speakerObj });
        });

    lvl.AngelSuggestive
        .handles("mxnEnemy.died", () => {
            Cutscene.play(function* () {
                lvl.SuggestiveAngelBlock.destroy();
                yield () => playerObj.isOnGround;
                yield* show("You hear the sound of a large block disappearing from the world.");
            }, { speaker: speakerObj });
        });
}
