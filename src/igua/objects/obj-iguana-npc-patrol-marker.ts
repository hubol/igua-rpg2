import { Sprite } from "pixi.js";
import { OgmoEntities } from "../../assets/generated/levels/generated-ogmo-project-data";
import { Tx } from "../../assets/textures";
import { Instances } from "../../lib/game-engine/instances";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { distance } from "../../lib/math/vector";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { Cutscene } from "../globals";
import { objIguanaNpc } from "./obj-iguana-npc";

export function objIguanaNpcPatrolMarker(entity: OgmoEntities.IguanaNpcPatrolMarker) {
    const positions = [
        vnew(entity),
        ...(entity.nodes ?? []).map(node => vnew(node.x, node.y)),
    ];

    return Sprite.from(Tx.Placeholder)
        .invisible()
        .coro(function* (self) {
            yield () => Boolean(self.collidesOne(Instances(objIguanaNpc)));
            const iguanaNpcObj = self.collidesOne(Instances(objIguanaNpc))!;

            function isIguanaSpeaking() {
                return Cutscene.current?.attributes?.speaker === iguanaNpcObj;
            }

            iguanaNpcObj.walkingTopSpeed = entity.values.speed;

            while (true) {
                yield () => !isIguanaSpeaking();

                const waitAndWalkObj = container()
                    .coro(function* () {
                        yield sleep(Rng.int(entity.values.delayMin, entity.values.delayMax));
                        let positionIndex = Rng.int(positions.length);
                        if (distance(iguanaNpcObj, positions[positionIndex]) < 20) {
                            positionIndex = (positionIndex + 1) % positions.length;
                        }

                        const position = positions[positionIndex];
                        iguanaNpcObj.auto.facing = Math.sign(position.x - iguanaNpcObj.x);
                        yield sleep(Rng.int(100, 500));
                        yield* iguanaNpcObj.walkTo(position.x);
                        waitAndWalkObj.destroy();
                    })
                    .step(() => {
                        if (isIguanaSpeaking()) {
                            waitAndWalkObj.destroy();
                            iguanaNpcObj.speed.y = -2;
                            iguanaNpcObj.objIguanaLocomotive.abortWalkTo();
                        }
                    })
                    .show(self);

                yield () => waitAndWalkObj.destroyed;
            }
        });
}
