import { DisplayObject } from "pixi.js";
import { interp } from "../../../lib/game-engine/routines/interp";
import { ZIndex } from "../../core/scene/z-index";
import { NpcLooks } from "../../data/data-npc-looks";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objIguanaLocomotive } from "../obj-iguana-locomotive";

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 30,
        },
    }),
};

export function objAngelSkeliguana() {
    const hurtboxObjs = new Array<DisplayObject>();
    let sinceDamagedStepsCount = 999;

    return objIguanaLocomotive(NpcLooks.Skeleton0)
        .mixin(mxnEnemy, { rank: ranks.level0, hurtboxes: hurtboxObjs })
        .handles("damaged", (_, event) => {
            if (event.rejected) {
                return;
            }

            sinceDamagedStepsCount = 0;
        })
        .coro(function* (self) {
            self.isSkeleton = true;
            hurtboxObjs.push(self.head, self.body);
        })
        .step(() => sinceDamagedStepsCount++)
        .coro(function* (self) {
            while (true) {
                yield () => sinceDamagedStepsCount < 30;
                self.head.mouth.emote.sad();
                yield interp(self.head.mouth, "agape").to(1).over(200);
                yield () => sinceDamagedStepsCount > 30;
                yield interp(self.head.mouth, "agape").to(0).over(200);
                self.head.mouth.emote.clear();
            }
        })
        .zIndexed(ZIndex.CharacterEntities);
}
