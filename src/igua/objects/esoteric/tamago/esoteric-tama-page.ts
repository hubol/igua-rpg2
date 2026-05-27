import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../../assets/textures";
import { interpvr } from "../../../../lib/game-engine/routines/interp";
import { Integer } from "../../../../lib/math/number-alias-types";
import { container } from "../../../../lib/pixi/container";
import { Null } from "../../../../lib/types/null";
import { mxnBoilFlipH } from "../../../mixins/mxn-boil-flip-h";
import { RpgInventory } from "../../../rpg/rpg-inventory";
import { EsotericTamaButtons } from "./esoteric-tama-buttons";

export abstract class EsotericTamaPage {
    abstract step(buttons: EsotericTamaButtons.Public): EsotericTamaPage | void;
    abstract getDisplayObject(): DisplayObject;
}

const txsIcons = Tx.Esoteric.Tamago.Icons.split({ width: 60 });

export namespace EsotericTamaPage {
    export class Home extends EsotericTamaPage {
        private _selectedIndex = Null<Integer>();
        private _stepsSinceActivity = 999;

        constructor(private readonly _io: IO) {
            super();
        }

        step(buttons: EsotericTamaButtons.Public): void | EsotericTamaPage {
            if (buttons.isPressed("a")) {
                this._stepsSinceActivity = 0;
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

            if (buttons.isPressed("c") || this._stepsSinceActivity++ >= 240) {
                this._selectedIndex = null;
            }

            if (this._selectedIndex !== null && buttons.isPressed("b")) {
                if (this._selectedIndex === 5) {
                    return new Exit(this._io);
                }
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

    export class Exit extends EsotericTamaPage {
        private _stepsCount = 0;

        constructor(private readonly _io: IO) {
            super();
        }

        step(buttons: EsotericTamaButtons.Public): void | EsotericTamaPage {
            this._stepsCount++;
            if (this._stepsCount === 120) {
                this._io.exit();
            }
        }
        getDisplayObject(): DisplayObject {
            return Sprite.from(Tx.Esoteric.Tamago.SeeYouLater)
                .at(60, 0)
                .coro(function* (self) {
                    yield interpvr(self).to(0, 0).over(1000);
                });
        }
    }

    export interface IO {
        beginUpload(): IO.UploadTransaction;
        cancelUpload(): void;
        refundItem(item: RpgInventory.Item): void;

        exit(): void;
    }

    export namespace IO {
        export interface UploadTransaction {
            uploadedItem: RpgInventory.Item | null;
        }
    }
}
