import { Container, Graphics, LINE_CAP, LINE_JOIN, Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Tx } from "../../assets/textures";
import { Logger } from "../../lib/game-engine/logger";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interp, interpv, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { DataItem } from "../data/data-item";
import { Input, layers } from "../globals";
import { mxnMotion } from "../mixins/mxn-motion";
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

    const obj = container().show(layers.overlay.messages);

    const messageObj = objMessage(message)
        .at(renderer.width / 2, 12)
        .show(obj);

    const submessageObj = objMessage(options[0].message)
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

    yield interp(obj, "alpha").steps(3).to(0).over(500);

    obj.destroy();

    return value;
}

function objMessage(message: string) {
    const colors = DramaLib.Speaker.getColors();

    const textObj = objText.MediumIrregular(message, { tint: colors.textPrimary })
        .at(0, 12)
        .anchored(0.5, 0.5);

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
            .drawRect(-150, 0, 300, 20),
        textObj,
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

export const DramaItem = {
    choose,
};
