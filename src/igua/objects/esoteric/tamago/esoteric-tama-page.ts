import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../../assets/textures";
import { interpvr } from "../../../../lib/game-engine/routines/interp";
import { Integer } from "../../../../lib/math/number-alias-types";
import { PseudoRng } from "../../../../lib/math/rng";
import { container } from "../../../../lib/pixi/container";
import { range } from "../../../../lib/range";
import { Null } from "../../../../lib/types/null";
import { mxnBoilFlipH } from "../../../mixins/mxn-boil-flip-h";
import { mxnBoilPivot } from "../../../mixins/mxn-boil-pivot";
import { RpgInventory } from "../../../rpg/rpg-inventory";
import { objStatusBar } from "../../overlay/obj-status-bar";
import { EsotericTamaButtons } from "./esoteric-tama-buttons";

export abstract class EsotericTamaPage {
    abstract step(buttons: EsotericTamaButtons.Public): EsotericTamaPage | void;
    abstract getDisplayObject(): DisplayObject;
}

const txsIcons = Tx.Esoteric.Tamago.Icons.split({ width: 120 });

export namespace EsotericTamaPage {
    export class Home extends EsotericTamaPage {
        private _selectedIndex = Null<Integer>();
        private _stepsSinceActivity = 999;

        readonly state: State = {
            mood: 0,
            poop: 4,
            stomach: 0,
        };

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
                if (this._selectedIndex === 0) {
                    return new Info(this);
                }
                if (this._selectedIndex === 5) {
                    return new Exit(this._io);
                }
            }
        }

        getDisplayObject(): DisplayObject {
            const p = new PseudoRng(23923223);

            return container(
                Sprite.from(Tx.Esoteric.Tamago.DemoScreen)
                    .mixin(mxnBoilFlipH)
                    .step(self => self.y = this._selectedIndex === null ? 0 : -4),
                ...range(5).map(i =>
                    Sprite.from(Tx.Esoteric.Tamago.Poop)
                        .mixin(mxnBoilFlipH)
                        .step(self => self.visible = this.state.poop > i)
                        .at(p.vunit().scale(30, 10).vround())
                        .add(50, 30)
                ),
                Sprite.from(txsIcons[0])
                    .invisible()
                    .mixin(mxnBoilPivot)
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
                .at(Tx.Esoteric.Tamago.SeeYouLater.width, 0)
                .mixin(mxnBoilPivot)
                .coro(function* (self) {
                    yield interpvr(self).to(0, 0).over(1000);
                });
        }
    }

    export class Info extends EsotericTamaPage {
        private _scrollsCount = 0;

        step(buttons: EsotericTamaButtons.Public): void | EsotericTamaPage {
            if (buttons.isPressed("a")) {
                this._scrollsCount++;
            }
            if (buttons.isPressed("c")) {
                return this._home;
            }
        }

        getDisplayObject(): DisplayObject {
            return container(
                container(
                    Sprite.from(Tx.Esoteric.Tamago.InfoScreen0),
                    objEsotericTamaBar(4, () => this._home.state.stomach)
                        .at(4, 16),
                    objEsotericTamaBar(4, () => this._home.state.mood)
                        .at(3, 48),
                ),
                Sprite.from(Tx.Esoteric.Tamago.InfoScreen1),
            )
                .step(self => {
                    for (let i = 0; i < self.children.length; i++) {
                        self.children[i].visible = this._scrollsCount % self.children.length === i;
                    }
                });
        }

        constructor(private readonly _home: Home) {
            super();
        }
    }

    interface State {
        stomach: Integer;
        mood: Integer;
        poop: Integer;
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

function objEsotericTamaBar(maxValue: Integer, valueProvider: () => Integer) {
    return objStatusBar.objAutoUpdated({
        height: 9,
        decreases: [
            {
                tintBar: 0xff0000,
            },
        ],
        increases: [
            {
                tintBar: 0x00ff00,
            },
        ],
        maxValue,
        tintBack: 0x800000,
        tintFront: 0x26BA4A,
        width: 105,
    }, valueProvider);
}
