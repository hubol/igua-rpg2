import { BitmapText, Container, DisplayObject, Graphics, LINE_CAP, LINE_JOIN, Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Tx } from "../../assets/textures";
import { Logger } from "../../lib/game-engine/logger";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interpv, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { DataItem } from "../data/data-item";
import { Input, layers } from "../globals";
import { mxnBoilRotate } from "../mixins/mxn-boil-rotate";
import { mxnHudModifiers } from "../mixins/mxn-hud-modifiers";
import { mxnMotion } from "../mixins/mxn-motion";
import { objFxBurst32 } from "../objects/effects/obj-fx-burst-32";
import { playerObj } from "../objects/obj-player";
import { RpgInventory } from "../rpg/rpg-inventory";
import { objUiPage } from "../ui/framework/obj-ui-page";
import { DramaLib } from "./drama-lib";

interface Option<TItem extends RpgInventory.Item> {
    item: TItem;
    message: string;
}

interface ChooseArgs<TItem extends RpgInventory.Item> {
    options: Option<TItem>[];
    message: string;
    noneMessage: string;
}

function choose<TItem extends RpgInventory.Item>(args: ChooseArgs<TItem>): Coro.Type<TItem | null>;
function choose<TItem extends RpgInventory.Item>(args: Omit<ChooseArgs<TItem>, "noneMessage">): Coro.Type<TItem>;
function* choose({ message = "", options = [], noneMessage }: Partial<ChooseArgs<RpgInventory.Item>>) {
    if (!options.length && !noneMessage) {
        Logger.logContractViolationError(
            "DramaItem.choose",
            new Error("items must not be empty when noneMessage is empty"),
        );
        options.push({ item: { kind: "potion", id: "__Fallback__" }, message: "This is a bug" });
    }

    let value = options[0] ? options[0].item : null;

    const colors = DramaLib.Speaker.getColors();

    const obj = container()
        .mixin(mxnHudModifiers.mxnHideStatus)
        .show(layers.overlay.messages);

    const messageObj = objMessage(objText.MediumIrregular(message, { tint: colors.textPrimary }))
        .at(renderer.width / 2, 12)
        .show(obj);

    const submessageObj = objMessage(objText.Medium("", { tint: colors.textPrimary }))
        .at(renderer.width / 2, 220)
        .show(obj);

    const elementObjs = options.map(({ item, message }) =>
        container(DataItem.getFigureObj(item).pivotedUnit(0.5, 0.5).scaled(2, 2))
            .mixin(mxnSelect)
            .step(self => {
                if (self.selected) {
                    submessageObj.text = message;
                    value = item;
                }
            })
    );

    if (noneMessage) {
        elementObjs.push(
            container(Sprite.from(Tx.Ui.EmptyLarge).anchored(0.5, 0.5))
                .mixin(mxnSelect)
                .step(self => {
                    if (self.selected) {
                        submessageObj.text = noneMessage;
                        value = null;
                    }
                }),
        );
    }

    for (let i = 0; i < elementObjs.length; i++) {
        elementObjs[i].at(80 + (i % 5) * 83, 80 + Math.floor(i / 5) * 90);
    }

    const pageObj = objUiPage(elementObjs, { selectionIndex: 0, startTicking: true })
        .show(obj);

    obj.at(0, -200);

    pageObj.navigation = false;
    pageObj.ticker.doNextUpdate = false;

    yield sleepf(1);

    pageObj.ticker.doNextUpdate = true;

    yield interpvr(obj).factor(factor.sine).to(0, 0).over(500);
    pageObj.navigation = true;

    yield () => Input.justWentDown("Confirm");

    pageObj.navigation = false;

    pageObj.selected?.coro(function* (self) {
        yield interpvr(self).factor(factor.sine).to(renderer.width / 2, renderer.height / 2).over(1000);
    });

    if (elementObjs.length > 1) {
        elementObjs
            .filter(obj => !obj.selected)
            .forEach(obj => {
                let angle = 0;

                obj
                    .mixin(mxnMotion)
                    .step(self => {
                        self.angle = Math.round((angle += self.speed.x) / 45) * 45;
                        self.speed.y += 0.3;
                    })
                    .speed.at(Rng.int(-10, 10), Rng.int(-3, -6));
            });

        yield sleep(700);
    }
    else {
        yield sleep(400);
    }

    yield* Coro.all([
        interpvr(messageObj).factor(factor.sine).translate(-renderer.width, 0).over(500),
        interpvr(submessageObj).factor(factor.sine).translate(renderer.width, 0).over(500),
    ]);

    obj.alpha = 0.5;
    yield sleep(200);

    obj.destroy();

    return value;
}

function objMessage(textObj: BitmapText) {
    const colors = DramaLib.Speaker.getColors();

    return container(
        new Graphics()
            .beginFill(colors.primary)
            .lineStyle({
                alignment: 1,
                color: colors.primary,
                alpha: 1,
                cap: LINE_CAP.ROUND,
                join: LINE_JOIN.ROUND,
                width: 8,
            })
            .drawRect(-150, 0, 300, 20)
            .pivoted(0, 10)
            .at(0, 10)
            .mixin(mxnBoilRotate),
        textObj
            .at(0, 12)
            .anchored(0.5, 0.5),
    )
        .merge({
            set text(value: string) {
                textObj.text = value;
            },
        });
}

function mxnSelect(obj: Container) {
    const colors = DramaLib.Speaker.getColors();

    const indicatorObj = new Graphics()
        .merge({ appear: false })
        .coro(function* (self) {
            while (true) {
                yield () => self.appear;
                self.scale.at(0.5, 0.5);
                self.clear()
                    .beginFill(colors.primary).drawCircle(Rng.intp(), Rng.intp(), 8)
                    .beginFill(colors.secondary).drawCircle(Rng.intp(), Rng.intp(), 5);
                yield interpv(self.scale).factor(factor.sine).to(5, 5).over(100);
                self.scale.at(1, 1);
                self.clear()
                    .beginFill(colors.secondary).drawCircle(Rng.int(-2, 2), Rng.int(-2, 2), 44)
                    .beginFill(colors.primary).drawCircle(Rng.int(-2, 2), Rng.int(-2, 2), 34);
                while (self.appear) {
                    if (Rng.float() < 0.3) {
                        self.angle = Rng.int(4) * 90;
                    }
                    yield sleep(100);
                }

                yield interpv(self.scale).steps(4).to(0, 0).over(200);
            }
        })
        .zIndexed(-200)
        .show(obj);

    return obj
        .autoSorted()
        .merge({ selected: false })
        .step(self => {
            indicatorObj.appear = self.selected;
        })
        .coro(function* (self) {
            while (true) {
                self.angle = 0;
                yield () => self.selected;
                self.angle = 4;
                self.pivot.at(Rng.int(-1, 1), Rng.int(-1, 1));
                yield sleep(Rng.int(100, 300));
            }
        });
}

function createRemovedItemFigureObjAtPlayer(item: RpgInventory.Item) {
    return objItemFigureWithTarget(item, DramaLib.Speaker.current)
        .at(playerObj)
        .add(Rng.float(-8, 8), Rng.float(-32, -40))
        .show();
}

function createReceivedItemFigureObjAtSpeaker(item: RpgInventory.Item) {
    return objItemFigureWithTarget(item, playerObj)
        .at(DramaLib.Speaker.getWorldCenter())
        .add(Rng.float(-8, 8), Rng.float(-32, -40))
        .show();
}

function sleepAfterRemoveIteration(index: Integer) {
    return sleepf(Math.max(1, 10 - index * 0.1));
}

function objItemFigureWithTarget(item: RpgInventory.Item, targetObj: DisplayObject | null) {
    const speed = vnew(Rng.float(-1, 1), Rng.float(-2.5, -3.5));
    const gravity = Rng.float(0.1, 0.15);

    let angle = 0;

    return DataItem.getFigureObj(item)
        .pivotedUnit(0.5, 0.5)
        .scaled(0, 0)
        .coro(function* (self) {
            yield* Coro.all([
                interpv(self.scale).steps(3).to(1, 1).over(100),
                interpvr(self).factor(factor.sine).translate(0, -6).over(100),
            ]);

            const motionObj = container()
                .step(() => {
                    self.add(speed);
                    speed.y += gravity;

                    angle += speed.x * 4 + Math.sign(speed.x) * 2;
                    self.angle = Math.round(angle / 90) * 90;
                })
                .show(self);

            yield () => speed.y >= 0;

            if (targetObj) {
                motionObj.destroy();

                yield sleepf(10);

                yield* Coro.race([
                    () => targetObj.destroyed,
                    Coro.chain([sleepf(10), () => targetObj.collides(self)]),
                    interpvr(self).factor(factor.sine).to(targetObj.getWorldCenter()).over(300),
                ]);
            }
            else {
                yield sleepf(90);
            }

            objFxBurst32().at(self).show();
            self.destroy();
        });
}

export const DramaItem = {
    choose,
    createReceivedItemFigureObjAtSpeaker,
    createRemovedItemFigureObjAtPlayer,
    sleepAfterRemoveIteration,
};
