import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { scene } from "../globals";
import { objHeliumExhaust } from "../objects/nature/obj-helium-exhaust";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnEfficientHome() {
    const lvl = Lvl.EfficientHome();
    scene.camera.at(Math.floor(playerObj.x / 512) * 512, Math.floor(playerObj.y / 288) * 288);
    scene.camera.mode = "controlled";

    enrichHelium(lvl);
}

function enrichHelium(lvl: LvlType.EfficientHome) {
    [lvl.HeliumMarker0, lvl.HeliumMarker1, lvl.HeliumMarker2].forEach((obj, index) =>
        objHeliumExhaust()
            .step(self => self.isAttackActive = Rpg.character.status.conditions.helium.ballons.length === index, -1)
            .at(obj)
            .show()
    );
}
