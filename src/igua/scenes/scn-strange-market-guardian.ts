import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { interpvr } from "../../lib/game-engine/routines/interp";
import { scene } from "../globals";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { objBossMusicPlayer } from "../objects/obj-boss-music-player";
import { Rpg } from "../rpg/rpg";

export function scnStrangeMarketGuardian() {
    const lvl = Lvl.StrangeMarketGuardian();

    [lvl.WaterRipple0, lvl.WaterRipple1]
        .forEach(obj => obj.mixin(mxnSinePivot));

    if (Rpg.flags.strangeMarket.guardian.defeated) {
        lvl.GuardianBoss.destroy();
        lvl.GuardianBlock.destroy();
    }
    else {
        scene.stage
            .coro(function* () {
                yield () => lvl.GuardianBoss.destroyed;
                Rpg.flags.strangeMarket.guardian.defeated = true;
                yield interpvr(lvl.GuardianBlock).translate(0, lvl.GuardianBlock.height).over(2000);
            });
    }

    objBossMusicPlayer({
        bossObjs: [lvl.GuardianBoss],
        mzkBattle: Mzk.FuckerLand,
        mzkPeace: Mzk.BigLove,
    })
        .show();
}
