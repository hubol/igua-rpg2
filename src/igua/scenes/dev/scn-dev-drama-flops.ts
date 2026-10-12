import { Sprite } from "pixi.js";
import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { range } from "../../../lib/range";
import { DramaFlops } from "../../drama/drama-flops";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { objCharacterBoxer } from "../../objects/characters/obj-character-boxer";
import { objCollectibleFlop } from "../../objects/collectibles/obj-collectible-flop";
import { EsotericPokeData } from "../../objects/esoteric/poke/esoteric-poke-data";

export function scnDevDramaFlops() {
    const lvl = Lvl.Dummy();

    const allSpecies = range(999).map(id => EsotericPokeData.Species.createFromFlopId(id));

    console.log(
        "speed 3 or above",
        allSpecies.filter(species => species.moves.filter(move => move.speed >= 3).length === 4).length,
    );

    console.log(
        "speed 2 or below",
        allSpecies.filter(species => species.moves.filter(move => move.speed <= 2).length === 4).length,
    );

    // for (let i = 0; i <= 998; i++) {
    //     const species = EsotericPokeData.Species.createFromFlopId(i);
    //     if (species.moves.filter(move => move.speed >= 3).length === 4) {
    //         console.log(i, species.health, ...species.moves.map(move => move.speed));
    //     }
    // }

    objCharacterBoxer()
        .at(lvl.DummyMarker)
        .mixin(mxnCutscene, function* () {
            const flopId = yield* DramaFlops.askFlop(range(1000).map(() => Rng.float() < 30 / 1000));
            objCollectibleFlop(flopId)
                .at(lvl.DummyMarker)
                .show();
        })
        .show();
}
