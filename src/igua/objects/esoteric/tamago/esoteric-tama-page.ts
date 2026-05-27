import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../../assets/textures";
import { Integer } from "../../../../lib/math/number-alias-types";
import { container } from "../../../../lib/pixi/container";
import { Null } from "../../../../lib/types/null";
import { mxnBoilFlipH } from "../../../mixins/mxn-boil-flip-h";
import { EsotericTamaButtons } from "./esoteric-tama-buttons";

export abstract class EsotericTamaPage {
    abstract step(buttons: EsotericTamaButtons.Public): EsotericTamaPage | void;
    abstract getDisplayObject(): DisplayObject;
}

const txsIcons = Tx.Esoteric.Tamago.Icons.split({ width: 60 });

export namespace EsotericTamaPage {
    export class Home extends EsotericTamaPage {
        private _selectedIndex = Null<Integer>();

        step(buttons: EsotericTamaButtons.Public): void | EsotericTamaPage {
            if (buttons.isPressed("a")) {
                if (this._selectedIndex === null) {
                    this._selectedIndex = 0;
                }
                else {
                    this._selectedIndex++;
                }

                if (this._selectedIndex >= 6) {
                    this._selectedIndex = null;
                }
            }

            if (buttons.isPressed("c")) {
                this._selectedIndex = null;
            }
        }

        getDisplayObject(): DisplayObject {
            return container(
                Sprite.from(Tx.Esoteric.Tamago.DemoScreen)
                    .mixin(mxnBoilFlipH)
                    .step(self => self.y = this._selectedIndex === null ? 0 : -4),
                Sprite.from(txsIcons[0])
                    .invisible()
                    .step(self => {
                        self.visible = this._selectedIndex !== null;
                        if (this._selectedIndex !== null) {
                            self.texture = txsIcons[this._selectedIndex];
                        }
                    }),
            );
        }
    }
}
