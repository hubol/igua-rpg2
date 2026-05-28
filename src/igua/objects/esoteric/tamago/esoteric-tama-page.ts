import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { objText } from "../../../../assets/fonts";
import { Tx } from "../../../../assets/textures";
import { factor, interpvr } from "../../../../lib/game-engine/routines/interp";
import { sleep } from "../../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../../lib/math/number-alias-types";
import { PseudoRng } from "../../../../lib/math/rng";
import { CollisionShape } from "../../../../lib/pixi/collision";
import { container } from "../../../../lib/pixi/container";
import { range } from "../../../../lib/range";
import { Null } from "../../../../lib/types/null";
import { mxnBoilFlipH } from "../../../mixins/mxn-boil-flip-h";
import { mxnBoilPivot } from "../../../mixins/mxn-boil-pivot";
import { mxnBoilSeed } from "../../../mixins/mxn-boil-seed";
import { MicrocosmTamago } from "../../../rpg/microcosms/microcosm-tamago";
import { RpgInventory } from "../../../rpg/rpg-inventory";
import { EsotericTamaButtons } from "./esoteric-tama-buttons";

export abstract class EsotericTamaPage {
    abstract step(buttons: EsotericTamaButtons.Public): EsotericTamaPage | void;
    abstract getDisplayObject(): DisplayObject;
}

const txsIcons = Tx.Esoteric.Tamago.Icons.split({ width: 120 });
const [txMopWater, txMop] = Tx.Esoteric.Tamago.Mop.split({ count: 2 });

export namespace EsotericTamaPage {
    export class Home extends EsotericTamaPage {
        private _selectedIndex = Null<Integer>();
        private _stepsSinceActivity = 999;

        constructor(
            private readonly _io: IO,
            private readonly _cosmTamago: MicrocosmTamago,
        ) {
            super();
        }

        step(buttons: EsotericTamaButtons.Public): void | EsotericTamaPage {
            if (buttons.isPressed("a") || buttons.isPressed("b")) {
                this._stepsSinceActivity = 0;
            }

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

            if (buttons.isPressed("c") || this._stepsSinceActivity++ >= 240) {
                this._selectedIndex = null;
            }

            if (this._selectedIndex !== null && buttons.isPressed("b")) {
                if (this._selectedIndex === 0) {
                    return new Info(this, this._cosmTamago);
                }
                if (this._selectedIndex === 1) {
                    const checkEat = this._cosmTamago.checkEat();
                    if (checkEat.success) {
                        // TODO
                        this._cosmTamago.eat();
                        return;
                    }

                    if (checkEat.reason === "no_food") {
                        return new Message("I don't have food!", this);
                    }
                    else {
                        return new Message("I don't want to eat with poop around!", this);
                    }
                }
                if (this._selectedIndex === 2) {
                    const checkWash = this._cosmTamago.checkWash();
                    if (checkWash.success) {
                        return new Wash(this, this._cosmTamago);
                    }

                    return new Message("I don't have water!", this);
                }
                if (this._selectedIndex === 3) {
                    const uploadTransaction = this._io.beginUpload();
                    return new Upload(this, this._io, uploadTransaction, this._cosmTamago);
                }
                if (this._selectedIndex === 4) {
                    const session = this._io.beginMinigame();
                    return new Minigame(this, session, this._cosmTamago);
                }
                if (this._selectedIndex === 5) {
                    return new Exit(this._io);
                }
            }
        }

        getDisplayObject(): DisplayObject {
            return container(
                objEsotericTamaHome(this._cosmTamago),
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

    class Minigame extends EsotericTamaPage {
        constructor(
            private readonly _returnPage: EsotericTamaPage,
            private readonly _session: IO.MinigameSession,
            private readonly _cosmTamago: MicrocosmTamago,
        ) {
            super();
        }

        private _processedResult = false;
        private _stepsCount = 0;

        step(buttons: EsotericTamaButtons.Public): void | EsotericTamaPage {
            if (this._session.result) {
                if (!this._processedResult) {
                    this._cosmTamago.win(this._session.result);
                    this._processedResult = true;
                }
                else if (this._stepsCount++ >= 120) {
                    return this._returnPage;
                }
            }
        }

        getDisplayObject(): DisplayObject {
            return container(
                container(
                    objText.MediumBoldIrregular("Results", { tint: 0x000000 })
                        .at(60, 20)
                        .anchored(0.5, 1),
                    objEsotericTamaBar(4, () => this._session.result?.score ?? 0)
                        .at(25, 40),
                )
                    .invisible()
                    .step(self => self.visible = Boolean(this._session.result)),
            );
        }
    }

    export class Wash extends EsotericTamaPage {
        constructor(
            private readonly _returnPage: EsotericTamaPage,
            private readonly _cosmTamago: MicrocosmTamago,
        ) {
            super();
        }

        private _stepsCount = 0;

        step(buttons: EsotericTamaButtons.Public): void | EsotericTamaPage {
            if (this._stepsCount++ >= 200) {
                this._cosmTamago.wash();
                return this._returnPage;
            }
        }

        getDisplayObject(): DisplayObject {
            const homeObj = objEsotericTamaHome(this._cosmTamago);

            const mopCollisionObj = new Graphics()
                .beginFill(0xffffff)
                .drawRect(35, 6, 15, 73)
                .invisible();

            return container(
                homeObj,
                container(
                    Sprite.from(txMopWater).mixin(mxnBoilPivot),
                    Sprite.from(txMop),
                    mopCollisionObj,
                )
                    .collisionShape(CollisionShape.DisplayObjects, [mopCollisionObj])
                    .at(120, -14)
                    .step(self => self.x -= 1)
                    .coro(function* (self) {
                        yield () => self.collides(homeObj);
                        homeObj.step(() => homeObj.x -= 1);
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

    class Message extends EsotericTamaPage {
        private _stepsCount = 0;

        step(buttons: EsotericTamaButtons.Public): void | EsotericTamaPage {
            if (this._stepsCount++ >= 90) {
                return this._returnPage;
            }
        }

        getDisplayObject(): DisplayObject {
            return container(
                Sprite.from(Tx.Esoteric.Tamago.Error)
                    .tinted(0xffff00)
                    .at(0, -5),
                objText.MediumBoldIrregular(this._text, { maxWidth: 80, align: "center", tint: 0x000000 })
                    .mixin(mxnBoilSeed)
                    .anchored(0.5, 0.5)
                    .at(60, 34),
            )
                .coro(function* (self) {
                    yield interpvr(self).factor(factor.sine).to(0, 0).over(500);
                })
                .at(0, -60);
        }

        constructor(
            readonly _text: string,
            private readonly _returnPage: EsotericTamaPage,
        ) {
            super();
        }
    }

    export class Info extends EsotericTamaPage {
        private _scrollsCount = 0;

        step(buttons: EsotericTamaButtons.Public): void | EsotericTamaPage {
            if (buttons.isPressed("a")) {
                this._scrollsCount++;
            }
            if (buttons.isPressed("c")) {
                return this._returnPage;
            }
        }

        getDisplayObject(): DisplayObject {
            return container(
                container(
                    container(
                        Sprite.from(Tx.Esoteric.Tamago.InfoScreen0),
                        objText.MediumBoldIrregular("Eating", { tint: 0x000000 })
                            .anchored(0.5, 0)
                            .at(60, 4),
                        objEsotericTamaBar(4, () => this._cosmTamago.stomach)
                            .at(25, 14),
                        objText.MediumBoldIrregular("Vibing", { tint: 0x000000 })
                            .anchored(0.5, 0)
                            .at(60, 29),
                        objEsotericTamaBar(4, () => this._cosmTamago.mood)
                            .at(25, 40),
                    ),
                    Sprite.from(Tx.Esoteric.Tamago.InfoScreen1),
                )
                    .step(self => {
                        for (let i = 0; i < self.children.length; i++) {
                            self.children[i].visible = this._scrollsCount % self.children.length === i;
                        }
                    }),
                Sprite.from(Tx.Esoteric.Tamago.InfoArrow)
                    .coro(function* (self) {
                        while (true) {
                            self.y = -4;
                            yield interpvr(self).to(0, 0).over(333);
                        }
                    }),
            );
        }

        constructor(
            private readonly _returnPage: EsotericTamaPage,
            private readonly _cosmTamago: MicrocosmTamago,
        ) {
            super();
        }
    }

    export class Upload extends EsotericTamaPage {
        constructor(
            private readonly _returnPage: EsotericTamaPage,
            private readonly _io: IO,
            private readonly _uploadTransaction: IO.UploadTransaction,
            private readonly _cosmTamago: MicrocosmTamago,
        ) {
            super();
        }

        step(buttons: EsotericTamaButtons.Public): void | EsotericTamaPage {
            if (this._uploadTransaction.uploadedItem) {
                const tamaItem = TamaItem.createFromItem(this._uploadTransaction.uploadedItem);
                if (tamaItem) {
                    this._io.closeTransaction(this._uploadTransaction, "accepted");
                    const storedCount = this._cosmTamago.upload(tamaItem);
                    const prefix = tamaItem === "food" ? "Food stored: " : "Water stored: ";
                    return new Message(prefix + storedCount, this._returnPage);
                }
                else {
                    this._io.closeTransaction(this._uploadTransaction, "refund");
                }

                return this._returnPage;
            }

            if (buttons.isPressed("c")) {
                this._io.closeTransaction(this._uploadTransaction, "canceled");
                return this._returnPage;
            }
        }

        getDisplayObject(): DisplayObject {
            return container(
                Sprite.from(Tx.Esoteric.Tamago.UploadScreen),
                objText.MediumIrregular("Upload now", { tint: 0x000000 })
                    .at(60, 30)
                    .anchored(0.5, 0.5)
                    .coro(function* (self) {
                        while (true) {
                            yield sleep(500);
                            self.visible = !self.visible;
                        }
                    }),
            );
        }
    }

    type TamaItem = "food" | "water";

    namespace TamaItem {
        export function createFromItem(item: RpgInventory.Item): TamaItem | null {
            if (item.kind === "potion") {
                if (item.id === "Wetness") {
                    return "water";
                }
                if (item.id === "Poison") {
                    return "food";
                }
            }

            return null;
        }
    }

    export interface IO {
        beginUpload(): IO.UploadTransaction;
        closeTransaction(transaction: IO.UploadTransaction, action: "refund" | "accepted" | "canceled"): void;

        beginMinigame(): IO.MinigameSession;

        exit(): void;
    }

    export namespace IO {
        export interface UploadTransaction {
            uploadedItem: RpgInventory.Item | null;
        }

        export interface MinigameSession {
            result: MinigameSession.Result | null;
        }

        export namespace MinigameSession {
            export interface Result {
                score: Integer;
            }
        }
    }
}

function objEsotericTamaHome(cosmTamago: MicrocosmTamago) {
    const p = new PseudoRng(23923223);

    return container(
        Sprite.from(Tx.Esoteric.Tamago.DemoScreen)
            .mixin(mxnBoilFlipH),
        ...range(5).map(i =>
            Sprite.from(Tx.Esoteric.Tamago.Poop)
                .mixin(mxnBoilFlipH)
                .step(self => self.visible = cosmTamago.poopsCount > i)
                .at(p.vunit().scale(30, 10).vround())
                .add(50, 30)
        ),
    );
}

const txsStar = Tx.Esoteric.Tamago.Star.split({ count: 2 });

function objEsotericTamaBar(maxValue: Integer, valueProvider: () => Integer) {
    return container(
        ...range(maxValue).map(i =>
            Sprite.from(txsStar[0])
                .step(self => self.texture = valueProvider() > i ? txsStar[1] : txsStar[0])
                .at(18 * i, 0)
        ),
    );
}
