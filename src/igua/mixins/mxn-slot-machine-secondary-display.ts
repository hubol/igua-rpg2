import { Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { interpvr } from "../../lib/game-engine/routines/interp";
import { ZIndex } from "../core/scene/z-index";
import { DataItem } from "../data/data-item";
import { DataPotion } from "../data/data-potion";
import { ObjSlotMachine, objSlotMachine } from "../objects/obj-slot-machine";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";
import { mxnBoilSeed } from "./mxn-boil-seed";

export function mxnSlotMachineSecondaryDisplay(regionObj: Graphics, slotMachineObj: ObjSlotMachine) {
    return slotMachineObj
        .coro(function* () {
            regionObj.visible = true;

            const textObj = objText.MediumIrregular("", { tint: regionObj.tint })
                .mixin(mxnBoilSeed)
                .at(regionObj.x + Math.round(regionObj.width / 2), regionObj.y + Math.round(regionObj.height / 2) + 2)
                .anchored(0.5, 0.5)
                .masked(regionObj)
                .coro(function* (self) {
                    while (true) {
                        for (let i = -1; i <= 1; i += 2) {
                            let scroll = Math.max(0, Math.ceil((self.width - regionObj.width) / 2));
                            if (scroll > 0) {
                                scroll += 2;
                            }
                            yield interpvr(self.pivot).to(scroll, 0).over(300);
                            yield interpvr(self.pivot).to(-scroll, 0).over(300);
                        }
                    }
                })
                .zIndexed(ZIndex.Entities)
                .show();

            slotMachineObj
                .handles("objSlotMachine.gameStarted", () => textObj.text = "Good luck!")
                .handles("objSlotMachine.gameEnded", (_, result) => {
                    if (result.totalPrize <= 0 && result.totalMaterialsCount <= 0) {
                        textObj.text = "Try again";
                    }
                })
                .handles(
                    "objSlotMachine.showLinePrize",
                    (_, event) => textObj.text = getShowLinePrizeText(event),
                )
                .handles(
                    "objSlotMachine.showGamePrize",
                    (_, event) => {
                        if (event.totalPrize > 0) {
                            textObj.text = `Game pays ${event.totalPrize}`;
                        }
                    },
                );
        });
}

function getShowLinePrizeText(prize: objSlotMachine.ShowLinePrizeEvent) {
    const name = `Line ${prize.index + 1}`;
    const materialText = prize.material ? getMaterialText(prize.material) : "This is a bug";
    if (prize.credits && prize.material) {
        return `${name} pays ${prize.credits}, ${materialText}`;
    }
    if (prize.credits) {
        return `${name} pays ${prize.credits}`;
    }
    return `${name} ${materialText}`;
}

function getMaterialText(material: RpgSlotMachine.Material) {
    if (material.kind === "consume_potion") {
        return "feeds " + DataPotion.getById(material.id).name;
    }

    return "awards " + DataItem.getNameQuantity(material.item, material.count);
}
