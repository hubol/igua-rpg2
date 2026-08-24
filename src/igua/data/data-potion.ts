import { Texture } from "pixi.js";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { Sound } from "../../lib/game-engine/audio/sound";
import { Instances } from "../../lib/game-engine/instances";
import { Coro } from "../../lib/game-engine/routines/coro";
import { interp } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { ForceTintFilter } from "../../lib/pixi/filters/force-tint-filter";
import { Jukebox } from "../core/igua-audio";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { MxnRpgStatus } from "../mixins/mxn-rpg-status";
import { mxnRpgStatusBerry } from "../mixins/mxn-rpg-status-berry";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgStatus } from "../rpg/rpg-status";
import { scnCasino } from "../scenes/scn-casino";
import { SceneChanger } from "../systems/scene-changer";
import { DataLib } from "./data-lib";

export namespace DataPotion {
    export type Flag =
        | "has_ketchup"
        | "has_mustard"
        | "has_onion"
        | "has_relish"
        | "is_hot_dog"
        | "is_foodlike"
        | "is_waterlike";

    export interface Model {
        name: string;
        description: string;
        stinkLineTint: RgbInt;
        texture: Texture | null;
        sound: Sound | null;
        healthRestore: ((status: RpgStatus.Model) => Integer) | null;
        flags: Set<Flag>;
    }

    function flags(...attributes: Flag[]) {
        return new Set(attributes);
    }

    export const { manifest, find, filter, getById, ids: Ids } = DataLib.create(
        "DataPotion",
        {
            AttributeHealthUp: {
                name: "Spiced Nectar",
                description: "Delicious nectar. Increases maximum HP.",
                stinkLineTint: 0x004AFF,
                texture: Tx.Collectibles.Potion.AttributeHealthUp,
                sound: Sfx.Effect.Potion.AttributeHealthUp,
                flags: flags("is_waterlike"),
                healthRestore: null,
            },
            AttributeIntelligenceUp: {
                name: "Foul Stew",
                description: "Challenging, odiforous soup. Increases intelligence.",
                stinkLineTint: 0xCEA5AA,
                texture: Tx.Collectibles.Potion.AttributeIntelligenceUp,
                sound: Sfx.Effect.Potion.AttributeIntelligenceUp,
                flags: flags("is_waterlike"),
                healthRestore: null,
            },
            AttributeStrengthUp: {
                name: "Claw Powder",
                description: "Fine grit for sharpening claws. Increases physical attack power.",
                stinkLineTint: 0xB6B2FF,
                texture: Tx.Collectibles.Potion.AttributeStrengthUp,
                sound: Sfx.Effect.Potion.AttributeStrengthUp,
                flags: flags(),
                healthRestore: null,
            },
            RestoreHealth: {
                name: "Sweet Berry",
                description: "Pungent fruit. Recover some health.",
                stinkLineTint: 0xD882D1,
                texture: Tx.Collectibles.Potion.RestoreHealth,
                sound: Sfx.Effect.Potion.RestoreHealth,
                flags: flags("is_foodlike"),
                healthRestore: (status) => Math.ceil(status.healthMax / 3),
            },
            RestoreHealthRestaurantLevel0: {
                name: "Pathetic Meal",
                description: "Meal for a cheapskate. Recover negligible health.",
                stinkLineTint: 0xD882D1,
                texture: Tx.Collectibles.Potion.PatheticMeal,
                sound: Sfx.Effect.Potion.RestoreHealthBagged0,
                flags: flags("is_foodlike"),
                healthRestore: () => 1,
            },
            RestoreHealthRestaurantLevel1: {
                name: "Unremarkable Meal",
                description: "Average meal. Recover some health.",
                stinkLineTint: 0xD882D1,
                texture: Tx.Collectibles.Potion.UnremarkableMeal,
                sound: Sfx.Effect.Potion.RestoreHealthBagged1,
                flags: flags("is_foodlike"),
                healthRestore: (status) => Math.ceil(status.healthMax / 3),
            },
            RestoreHealthRestaurantLevel2: {
                name: "Celebratory Meal",
                description: "Oversized meal. Recover substantial health.",
                stinkLineTint: 0xD882D1,
                texture: Tx.Collectibles.Potion.CelebratoryMeal,
                sound: Sfx.Effect.Potion.RestoreHealthBagged2,
                flags: flags("is_foodlike"),
                healthRestore: (status) => Math.ceil(status.healthMax * 0.8),
            },
            Poison: {
                name: "Poison",
                description: "Popular in most communities. Become poisoned.",
                stinkLineTint: 0xA53609,
                texture: Tx.Collectibles.Potion.Poison,
                sound: Sfx.Effect.Potion.Poison,
                flags: flags("is_foodlike"),
                healthRestore: null,
            },
            PoisonRestore: {
                name: "Bitter Medicine",
                description: "Expensive capsule. Recover from poison.",
                stinkLineTint: 0x7A42FF,
                texture: Tx.Collectibles.Potion.PoisonRestore,
                sound: Sfx.Effect.Potion.PoisonRestore,
                flags: flags(),
                healthRestore: null,
            },
            Ballon: {
                name: "Ballon Fruit",
                description: "Naturally-occurring and filled with helium. What?",
                stinkLineTint: 0xE1282C,
                texture: Tx.Collectibles.Potion.Ballon,
                sound: null,
                flags: flags("is_foodlike"),
                healthRestore: null,
            },
            Wetness: {
                name: "TheWetter(TM)",
                description: "Celebrated beverage. Become cool and drenched.",
                stinkLineTint: 0x2149FF,
                texture: Tx.Collectibles.Potion.Wetness,
                sound: Sfx.Effect.Potion.Wetness,
                flags: flags("is_waterlike"),
                healthRestore: null,
            },
            ForgetLooseValuableCollection: {
                name: "Forgeddit Fruid Snags",
                description: "Renowned flavor and texture. Loose valuables forgive your transgressions.",
                stinkLineTint: 0x808080,
                texture: Tx.Collectibles.Potion.FruitSnacks,
                sound: Sfx.Effect.Potion.LooseValuablesForget,
                flags: flags("is_foodlike"),
                healthRestore: null,
            },
            AnnoyIguanas: {
                name: "Nuisance Fruit",
                description: "Terrifying sound. Annoys iguanas.",
                stinkLineTint: 0x808080,
                texture: Tx.Collectibles.Potion.Cowbell,
                sound: Sfx.Effect.Potion.AnnoyIguanas,
                flags: flags(),
                healthRestore: null,
            },
            TaxiWhistleCasino: {
                name: "Whistle Fruit (Indiana Casino)",
                description: "Get a ride to the Casino. Exceedingly rare.",
                stinkLineTint: 0x808080,
                texture: Tx.Collectibles.Potion.Whistle,
                sound: Sfx.Effect.Potion.TaxiWhistle,
                flags: flags(),
                healthRestore: null,
            },
            HotDog: {
                name: "Hot Dog",
                description: "Unadorned dog. Restores little health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDog,
                flags: flags("is_foodlike", "is_hot_dog"),
                healthRestore: () => 10,
            },
            HotDogKetchup: {
                name: "Hot Dog (K)",
                description: "A dog with only ketchup. Sweet. Restores some health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogKetchup,
                flags: flags("is_foodlike", "is_hot_dog", "has_ketchup"),
                healthRestore: () => 40,
            },
            HotDogMustard: {
                name: "Hot Dog (M)",
                description: "A dog with only mustard. Tangy. Restores some health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogMustard,
                flags: flags("is_foodlike", "is_hot_dog", "has_mustard"),
                healthRestore: () => 40,
            },
            HotDogOnion: {
                name: "Hot Dog (O)",
                description: "A dog with only onions. Pungent. Restores some health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogOnion,
                flags: flags("is_foodlike", "is_hot_dog", "has_onion"),
                healthRestore: () => 40,
            },
            HotDogRelish: {
                name: "Hot Dog (R)",
                description: "A dog with only relish. Lovely. Restores some health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogRelish,
                flags: flags("is_foodlike", "is_hot_dog", "has_relish"),
                healthRestore: () => 40,
            },
            HotDogKetchupMustard: {
                name: "Hot Dog (KM)",
                description: "A dog with ketchup and mustard. A classic. Restores health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogKetchupMustard,
                flags: flags("is_foodlike", "is_hot_dog", "has_ketchup", "has_mustard"),
                healthRestore: () => 70,
            },
            HotDogKetchupOnion: {
                name: "Hot Dog (KO)",
                description: "A dog with ketchup and onions. Interesting. Restores health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogKetchupOnion,
                flags: flags("is_foodlike", "is_hot_dog", "has_ketchup", "has_onion"),
                healthRestore: () => 70,
            },
            HotDogKetchupRelish: {
                name: "Hot Dog (KR)",
                description: "A dog with ketchup and relish. Complementary colors. Restores health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogKetchupRelish,
                flags: flags("is_foodlike", "is_hot_dog", "has_ketchup", "has_relish"),
                healthRestore: () => 70,
            },
            HotDogMustardOnion: {
                name: "Hot Dog (MO)",
                description: "A dog with mustard and onion. Very tangy! Restores health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogMustardOnion,
                flags: flags("is_foodlike", "is_hot_dog", "has_mustard", "has_onion"),
                healthRestore: () => 70,
            },
            HotDogMustardRelish: {
                name: "Hot Dog (MR)",
                description: "A dog with mustard and relish. Bold colors! Restores health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogMustardRelish,
                flags: flags("is_foodlike", "is_hot_dog", "has_mustard", "has_relish"),
                healthRestore: () => 70,
            },
            HotDogOnionRelish: {
                name: "Hot Dog (OR)",
                description: "A dog with onion and relish. Boldly aromatic! Restores health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogOnionRelish,
                flags: flags("is_foodlike", "is_hot_dog", "has_onion", "has_relish"),
                healthRestore: () => 70,
            },
            HotDogKetchupMustardOnion: {
                name: "Hot Dog (KMO)",
                description: "A dog with ketchup, mustard, and onion. Just look at that! Decently restores health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogKetchupMustardOnion,
                flags: flags("is_foodlike", "is_hot_dog", "has_ketchup", "has_mustard", "has_onion"),
                healthRestore: () => 100,
            },
            HotDogKetchupMustardRelish: {
                name: "Hot Dog (KMR)",
                description: "A dog with ketchup, mustard, and relish. Such lovely colors! Decently restores health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogKetchupMustardRelish,
                flags: flags("is_foodlike", "is_hot_dog", "has_ketchup", "has_mustard", "has_relish"),
                healthRestore: () => 100,
            },
            HotDogKetchupOnionRelish: {
                name: "Hot Dog (KOR)",
                description:
                    "A dog with ketchup, onion, and relish. Sweet meets pungent tang! Decently restores health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogKetchupOnionRelish,
                flags: flags("is_foodlike", "is_hot_dog", "has_ketchup", "has_onion", "has_relish"),
                healthRestore: () => 100,
            },
            HotDogMustardOnionRelish: {
                name: "Hot Dog (MOR)",
                description: "A dog with mustard, onion, and relish. A bold combination! Decently restores health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogMustardOnionRelish,
                flags: flags("is_foodlike", "is_hot_dog", "has_mustard", "has_onion", "has_relish"),
                healthRestore: () => 100,
            },
            HotDogKetchupMustardOnionRelish: {
                name: "Hot Dog (Perfected)",
                description: "A dog with ketchup, mustard, onion, and relish. Unbeatable. Restores plenty of health.",
                stinkLineTint: 0xD85876,
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.HotDogKetchupMustardOnionRelish,
                flags: flags("is_foodlike", "is_hot_dog", "has_ketchup", "has_mustard", "has_onion", "has_relish"),
                healthRestore: () => 150,
            },
            ThrowableBerry: {
                name: "Throwing Seedling",
                description: "When planted, heals over time.",
                stinkLineTint: 0xB85BFF,
                sound: Sfx.Enemy.Berry.Announce,
                texture: Tx.Collectibles.Potion.Seedling,
                flags: flags(),
                healthRestore: null,
            },
            CakeCombat: {
                stinkLineTint: 0xFF401E,
                name: "Cake Slice (Combat)",
                description: "Tastes like violence. Restores health.",
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.CakeSliceCombat,
                flags: flags("is_foodlike"),
                healthRestore: () => 40,
            },
            CakeComputer: {
                stinkLineTint: 0xFF7B00,
                name: "Cake Slice (Computer)",
                description: "Tastes like escapism. Restores health.",
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.CakeSliceComputer,
                flags: flags("is_foodlike"),
                healthRestore: () => 40,
            },
            CakeGambling: {
                stinkLineTint: 0xEABB00,
                name: "Cake Slice (Gambling)",
                description: "Tastes like risk-reward. Restores health.",
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.CakeSliceGambling,
                flags: flags("is_foodlike"),
                healthRestore: () => 40,
            },
            CakeJump: {
                stinkLineTint: 0x19A859,
                name: "Cake Slice (Jump)",
                description: "Tastes like acrobatics. Restores health.",
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.CakeSliceJump,
                flags: flags("is_foodlike"),
                healthRestore: () => 40,
            },
            CakePocket: {
                stinkLineTint: 0x54BAFF,
                name: "Cake Slice (Pocket)",
                description: "Tastes like organization. Restores health.",
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.CakeSlicePocket,
                flags: flags("is_foodlike"),
                healthRestore: () => 40,
            },
            CakeQuest: {
                stinkLineTint: 0x3775E8,
                name: "Cake Slice (Quest)",
                description: "Tastes like accomplishment. Restores health.",
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.CakeSliceQuest,
                flags: flags("is_foodlike"),
                healthRestore: () => 40,
            },
            CakeSocial: {
                stinkLineTint: 0xA074E8,
                name: "Cake Slice (Social)",
                description: "Tastes like friendship. Restores health.",
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.CakeSliceSocial,
                flags: flags("is_foodlike"),
                healthRestore: () => 40,
            },
            CakeSpirit: {
                stinkLineTint: 0x2e2e2e,
                name: "Cake Slice (Spirit)",
                description: "Tastes like rebirth. Restores health.",
                sound: Sfx.Effect.Potion.RestoreHealth,
                texture: Tx.Collectibles.Potion.CakeSliceSpirit,
                flags: flags("is_foodlike"),
                healthRestore: () => 40,
            },
            __Fallback__: {
                name: "???",
                description: "Consume to experience a bug",
                stinkLineTint: 0xff00ff,
                texture: null,
                sound: null,
                flags: flags(),
                healthRestore: null,
            },
        } satisfies Record<string, Model>,
    );

    export type Id = DataLib.Id<typeof manifest>;

    export function usePotion(id: Id, target: MxnRpgStatus) {
        const data = getById(id);
        const sound = data.sound;
        if (sound) {
            target.play(sound);
        }

        const targetIsPlayer = target === playerObj;

        if (data.healthRestore) {
            target.heal(data.healthRestore(target.status));
        }

        switch (id) {
            // TODO attributes do not exist on MxnRpgStatus
            // Maybe they should?
            case "AttributeHealthUp":
                const previousHealthMax = target.status.healthMax;
                Rpg.character.attributes.update("health", 1);
                const delta = Math.round(target.status.healthMax - previousHealthMax);
                if (delta > 0) {
                    target.heal(delta);
                }
                return;
            case "AttributeIntelligenceUp":
                Rpg.character.attributes.update("intelligence", 1);
                return;
            case "AttributeStrengthUp":
                if (targetIsPlayer) {
                    Rpg.character.attributes.update("strength", 1);
                }
                else {
                    target.status.damageFactor += 25;
                }
                return;
            case "Poison":
                target.status.conditions.poison.level += 1;
                return;
            case "PoisonRestore":
                target.status.conditions.poison.value = 0;
                target.status.conditions.poison.level = 0;
                return;
            case "Ballon":
                target.damage(atkBallon);
                return;
            case "Wetness":
                // TODO why isn't this in the attack?
                target.status.conditions.overheat.value = 0;
                target.damage(atkWetness);
                return;
            case "ForgetLooseValuableCollection":
                Rpg.looseValuables.forgetCollection();
                return;
            case "AnnoyIguanas":
                const iguanaNpcObjs = Instances(objIguanaNpc).filter(obj => obj.visible);
                iguanaNpcObjs.forEach(obj => obj.speed.y = -2);
                const collidedIguanaNpcObj = playerObj.collidesOne(iguanaNpcObjs);
                if (collidedIguanaNpcObj) {
                    Cutscene.play(
                        function* () {
                            yield sleep(333);
                            yield* show(Rng.choose("Ack! That scared me!", "Ah!", "Eek!"));
                        },
                        { speaker: collidedIguanaNpcObj },
                    );
                }
                return;
            case "TaxiWhistleCasino":
                if (!targetIsPlayer) {
                    return;
                }
                Cutscene.play(function* () {
                    scene.camera.mode = "controlled";
                    playerObj.physicsEnabled = false;
                    playerObj.speed.y = -4;
                    playerObj.gravity = 0;
                    const filter = new ForceTintFilter(0xf0c400, 0);
                    playerObj.filtered(filter);
                    Jukebox.warm(Mzk.ProfitMotive);
                    yield* Coro.all([
                        interp(playerObj, "sparklesPerFrame").to(1).over(1000),
                        interp(filter, "factor").steps(6).to(1).over(1000),
                    ]);
                    SceneChanger.create({ sceneName: scnCasino.name, checkpointName: "fromTaxi" }).changeScene();
                });
                return;
            case "ThrowableBerry":
                const rpgStatusBerryObj = target.is(mxnRpgStatusBerry) ? target : target.mixin(mxnRpgStatusBerry);
                let done = false;
                rpgStatusBerryObj.coro(function* () {
                    yield* rpgStatusBerryObj.mxnRpgStatusBerry.dramaSpawnBerry();
                    done = true;
                });
                return () => done;
            default:
                return;
        }
    }
}

const atkBallon = RpgAttack.create({
    conditions: {
        helium: 99999999,
    },
});

const atkWetness = RpgAttack.create({
    conditions: {
        wetness: {
            tint: 0x0080ff,
            value: 999999,
        },
    },
});
