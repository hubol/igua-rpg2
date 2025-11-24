import { Container, DisplayObject } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { mxnInteract } from "../mixins/mxn-interact";
import { Rpg } from "../rpg/rpg";
import { RpgProgressData, RpgProgressFlags } from "../rpg/rpg-progress";

export function scnGreatTowerBalcony() {
    const lvl = Lvl.GreatTowerBalcony();
    enrichEfficientHome(lvl);
}

interface LeverBitfieldConfiguration {
    checkpointName: string;
}

const leverBitfieldConfigurations: Array<LeverBitfieldConfiguration> = [
    { checkpointName: "fromEfficient0" },
    { checkpointName: "fromEfficient1" },
    { checkpointName: "fromEfficient2" },
    { checkpointName: "fromEfficient3" },
    { checkpointName: "fromEfficient4" },
    { checkpointName: "fromEfficient5" },
    { checkpointName: "fromEfficient6" },
    { checkpointName: "fromEfficient7" },
];

function getLeverBitfield() {
    let value = 0;

    const { lever0, lever1, lever2 } = Rpg.flags.greatTower.balcony;

    if (lever0) {
        value |= 0b100;
    }
    if (lever1) {
        value |= 0b010;
    }
    if (lever2) {
        value |= 0b001;
    }

    return value;
}

function enrichEfficientHome(lvl: LvlType.GreatTowerBalcony) {
    lvl.Lever0.mixin(mxnLever, "lever0");
    lvl.Lever1.mixin(mxnLever, "lever1");
    lvl.Lever2.mixin(mxnLever, "lever2");

    lvl.Door.step(self => {
        const field = getLeverBitfield();
        const config = leverBitfieldConfigurations[field] ?? leverBitfieldConfigurations[0];
        self.checkpointName = config.checkpointName;
    });
}

function mxnLever(obj: Container, key: keyof RpgProgressData["flags"]["greatTower"]["balcony"]) {
    return obj
        .mixin(mxnInteract, () => Rpg.flags.greatTower.balcony[key] = !Rpg.flags.greatTower.balcony[key])
        .step(self => self.flipV(Rpg.flags.greatTower.balcony[key] ? 1 : -1));
}
