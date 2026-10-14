import { Sprite, Texture } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { txt } from "../../../lib/pixi/txt";
import { EsotericPokeData } from "./poke/esoteric-poke-data";
import { EsotericPokeEngine } from "./poke/esoteric-poke-engine";

const txsType = Tx.Esoteric.Poke.Types.split({ count: 3 });

const typeIconTxs: Record<EsotericPokeData.Move.Type, Texture> = {
    laugh: txsType[1],
    sword: txsType[0],
    soul: txsType[2],
};

function txtMove(move: EsotericPokeData.Move, separator = " ") {
    return txt`${move.name} ${Sprite.from(typeIconTxs[move.type]).pivoted(0, 3)}${separator}(Sp${move.speed})`;
}

function txtMoves(moves: ReadonlyArray<EsotericPokeData.Move>) {
    return txt.join(
        moves.map(move => txt`- ${txtMove(move)}\n`),
    );
}

function objTypeIcon(type: EsotericPokeData.Move.Type) {
    return Sprite.from(typeIconTxs[type]).pivoted(0, 3);
}

function objStatisticsFromSpecies(species: EsotericPokeData.Species) {
    return objText.Medium(txt`Max HP: ${species.health}
Starting STANCE: ${objTypeIcon(species.initialStanceType)}
MOVES:
${txtMoves(species.moves)}`);
}

function objStatisticsFromAnimal(animal: EsotericPokeEngine.Animal) {
    return objText.Medium()
        .step(self =>
            self.text = txt`HP: ${animal.health} / ${animal.healthMax}
STANCE: ${objTypeIcon(animal.stanceType)}
MOVES:
${txtMoves(animal.availableMovesData)}`
        );
}

export const objEsotericPokeOverlay = {
    txtMove,
    objStatistics: {
        objFromSpecies: objStatisticsFromSpecies,
        objFromAnimal: objStatisticsFromAnimal,
    },
};
