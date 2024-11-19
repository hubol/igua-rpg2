import { DisplayObject, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { lerp } from "../../../lib/game-engine/routines/lerp";

interface ObjAngelPlantLegsArgs {
    objToBounce: DisplayObject;
}

const [txTorso0, txTorso1] = Tx.Enemy.Suggestive.Torso.split({ count: 2 });

// TODO physics?!
export function objAngelPlantLegs(args: ObjAngelPlantLegsArgs) {
    return Sprite.from(txTorso0).coro(function* (self) {
        while (true) {
            yield sleepf(30);
            self.texture = self.texture === txTorso0 ? txTorso1 : txTorso0;
            const y = args.objToBounce.y;
            args.objToBounce.y = y - 2;
            yield sleepf(6);
            args.objToBounce.y = y - 1;
            yield sleepf(2);
            args.objToBounce.y = y + 1;
            self.y = 1;
            yield sleepf(8);
            self.y = 0;
            args.objToBounce.y = y;
        }
    });
}
