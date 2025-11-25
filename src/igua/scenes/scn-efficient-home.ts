import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { ask, show } from "../drama/show";
import { scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objHeliumExhaust } from "../objects/nature/obj-helium-exhaust";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnEfficientHome() {
    scene.camera.defaultMode = "controlled";
    const lvl = Lvl.EfficientHome();
    scene.camera.at(Math.floor(playerObj.x / 512) * 512, Math.floor(playerObj.y / 288) * 288);

    enrichHelium(lvl);
    enrichRoom0(lvl);
}

function enrichHelium(lvl: LvlType.EfficientHome) {
    [lvl.HeliumMarker0, lvl.HeliumMarker1, lvl.HeliumMarker2].forEach((obj, index) =>
        objHeliumExhaust()
            .step(self => self.isAttackActive = Rpg.character.status.conditions.helium.ballons.length === index, -1)
            .at(obj)
            .show()
    );
}

function enrichRoom0(lvl: LvlType.EfficientHome) {
    lvl.CloudHouseNpc0.mixin(mxnCutscene, function* () {
        yield* ask("You can't tell, but right now I'm working on my art.", "You are?");
        yield* show("Yep, I'm dreaming up big ideas...");
    });
}
