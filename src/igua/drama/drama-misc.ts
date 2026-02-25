import { DisplayObject, Graphics, LINE_CAP, LINE_JOIN, Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { Logger } from "../../lib/game-engine/logger";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interpv, interpvr } from "../../lib/game-engine/routines/interp";
import { onMutate } from "../../lib/game-engine/routines/on-mutate";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../lib/math/number";
import { Integer, PolarInt, RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { Input, layers, scene } from "../globals";
import { mxnActionRepeater } from "../mixins/mxn-action-repeater";
import { mxnBoilMirrorRotate } from "../mixins/mxn-boil-mirror-rotate";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnBoilSeed } from "../mixins/mxn-boil-seed";
import { ObjDoor } from "../objects/obj-door";
import { ObjIguanaLocomotive } from "../objects/obj-iguana-locomotive";
import { playerObj } from "../objects/obj-player";
import { DramaLib } from "./drama-lib";

function departRoomViaDoor(departee: DisplayObject | null) {
    const sfx = getDoorSfx();
    if (departee) {
        departee.play(sfx);
        departee.destroy();
    }
    else {
        sfx.play();
    }
}

function getDoorSfx() {
    return Rng.choose(Sfx.Interact.DoorOpen0, Sfx.Interact.DoorOpen1);
}

function arriveViaDoor(arriver: DisplayObject | null) {
    const sfx = getDoorSfx();

    if (arriver) {
        arriver.play(sfx);
        arriver.visible = true;
    }
    else {
        sfx.play();
    }
}

function walkToDoor(walker: ObjIguanaLocomotive, door: ObjDoor) {
    return walker.walkTo(walker.x < door.x ? door.x : (door.x + 32));
}

walkToDoor.andLock = function* (locker: ObjIguanaLocomotive, doorObj: ObjDoor) {
    yield* walkToDoor(locker, doorObj);
    doorObj.objDoor.lock();
    yield sleep(750);
};

walkToDoor.andUnlock = function* (unlockerObj: ObjIguanaLocomotive, doorObj: ObjDoor) {
    yield* walkToDoor(unlockerObj, doorObj);
    doorObj.objDoor.unlock();
    yield sleep(750);
};

function face(iguanaObj: ObjIguanaLocomotive, facing: PolarInt, rate = "default") {
    if (iguanaObj.facing !== facing) {
        iguanaObj.auto.facing = facing;
        return sleep(750);
    }

    return sleep(0);
}

function* levitatePlayer(playerMotionCoroPredicate: Coro.Predicate) {
    playerObj.physicsEnabled = false;
    playerObj.speed.at(0, 0);
    // A hack for making sure the player motion is applied before camera motion
    // This could be solved in other ways
    // But I think this is suitable for now
    const movePlayerObj = container()
        .coro(function* (self) {
            yield playerMotionCoroPredicate;
            self.destroy();
        })
        .show();
    yield () => movePlayerObj.destroyed;
    playerObj.physicsEnabled = true;
}

type AskNullableIntegerOptions = Omit<AskIntegerImplOptions, "rejectMessage"> & { rejectMessage?: string };
type AskIntegerOptions = Omit<AskIntegerImplOptions, "rejectMessage" | "disabledMessage">;

const askNullableInteger: (message: string, options: AskNullableIntegerOptions) => Coro.Type<Integer | null> =
    askIntegerImpl;

function* askInteger(message: string, options: AskIntegerOptions) {
    const result = yield* askIntegerImpl(message, { ...options, disabledMessage: null, rejectMessage: null });
    return result!;
}

interface AskIntegerImplOptions {
    messageObj?: DisplayObject;
    min?: Integer;
    max: Integer;
    multipleOf?: Integer;
    disabledMessage?: string | null;
    rejectMessage?: string | null;
}

function* askIntegerImpl(
    message: string,
    {
        messageObj: messageObjFromArgs = container(),
        disabledMessage = null,
        min = 1,
        max,
        multipleOf = 1,
        rejectMessage = "Never mind",
    }: AskIntegerImplOptions,
) {
    const colors = DramaLib.Speaker.getColors();

    if (multipleOf < 1) {
        Logger.logContractViolationError(
            "DramaMisc.askInteger",
            new Error("multipleOf must be >= 1, setting to 1"),
            { multipleOf },
        );
        multipleOf = 1;
    }

    if (min < multipleOf) {
        Logger.logContractViolationError(
            "DramaMisc.askInteger",
            new Error("min must be >= multipleOf, setting to multipleOf"),
            {
                min,
                multipleOf,
            },
        );
        min = multipleOf;
    }

    if (min % multipleOf !== 0) {
        Logger.logContractViolationError(
            "DramaMisc.askInteger",
            new Error("min must be a multiple of multipleOf"),
            { min, multipleOf },
        );
    }

    if (disabledMessage !== null && rejectMessage === null) {
        Logger.logContractViolationError(
            "DramaMisc.askInteger",
            new Error("rejectMessage must be null when disabledMessage is not null"),
            { disabledMessage, rejectMessage },
        );

        disabledMessage = null;
    }

    const obj = container().show(layers.overlay.messages);

    const messageObj = container(
        Sprite.from(Tx.Ui.Dialog.AskRemoveCountBox).tinted(colors.primary).anchored(0.5, 0.5).mixin(mxnBoilPivot),
        messageObjFromArgs,
        objHeader(message, colors.textPrimary).pivotedUnit(0.5, 0).at(0, 30),
    )
        .at(renderer.width / 2, -80)
        .coro(function* (self) {
            yield interpvr(self).factor(factor.sine).to(self.x, 28).over(500);
        })
        .show(obj);

    yield () => Input.isUp("Confirm");
    yield () => Input.justWentDown("Confirm");

    const isDisabled = disabledMessage !== null;
    let isSliderSelected = !isDisabled;

    const sliderObj = objSlider({ max, value: isDisabled ? 0 : min, colors });

    const sliderContainerObj = container(
        new Graphics().beginFill(0x000000).drawRect(-140, -20, 300, 60)
            .mixin(mxnBoilPivot)
            .step(self => self.visible = isSliderSelected),
        sliderObj.pivotedUnit(0.5, 0.5).step(self => {
            const scale = isSliderSelected ? 1 : 0.9;
            self.scaled(scale, scale);
        }),
        Sprite.from(Tx.Ui.Dialog.SliderBoxObscured)
            .anchored(0.5, 0.5)
            .mixin(mxnBoilPivot)
            .invisible()
            .step(self => self.visible = !isSliderSelected),
    )
        .at(renderer.width / 2, 140)
        .show(obj);

    const rejectButtonObj = container(
        Sprite.from(Tx.Ui.Dialog.AskRemoveCountRejectBox).tinted(0x000000).anchored(0.5, 0.5).scaled(1.2, 1.2)
            .invisible()
            .step(self => self.visible = !isSliderSelected)
            .mixin(mxnBoilPivot)
            .at(8, 8),
        Sprite.from(Tx.Ui.Dialog.AskRemoveCountRejectBox).tinted(colors.secondary).anchored(0.5, 0.5)
            .step(self => {
                self.pivot.y = isSliderSelected ? 0 : Math.round(Math.sin(scene.ticker.ticks / 60 * Math.PI) * 2);
            }),
        objText.MediumIrregular(rejectMessage ?? "", { tint: colors.textSecondary }).anchored(0.5, 0.5).step(self => {
            if (!isSliderSelected && scene.ticker.ticks % 15 === 0) {
                self.seed += 1;
            }
        }),
    )
        .at(renderer.width / 2, 200);

    if (rejectMessage !== null) {
        rejectButtonObj.show(obj);
    }

    if (disabledMessage !== null) {
        objText.MediumIrregular(disabledMessage, { tint: 0xc00000 })
            .anchored(0.5, 0.5)
            .at(0, 4)
            .mixin(mxnBoilPivot)
            .show(sliderContainerObj);
    }

    const selectionControlObj = container()
        .step(() => {
            if (isDisabled || rejectMessage === null) {
                return;
            }

            if (Input.justWentDown("SelectUp") || Input.justWentDown("SelectDown")) {
                isSliderSelected = !isSliderSelected;
            }
        })
        .mixin(mxnActionRepeater, ["SelectLeft", "SelectRight"])
        .step(self => {
            if (!isSliderSelected) {
                return;
            }

            if (self.mxnActionRepeater.justWentDown("SelectLeft")) {
                sliderObj.controls.value = Math.max(min, sliderObj.controls.value - multipleOf);
            }
            else if (self.mxnActionRepeater.justWentDown("SelectRight")) {
                sliderObj.controls.value = Math.min(max, sliderObj.controls.value + multipleOf);
            }
        })
        .show(obj);

    yield () => Input.isUp("Confirm");
    yield () => Input.justWentDown("Confirm");

    selectionControlObj.destroy();

    const sliderValue = sliderObj.controls.value;
    const value = isSliderSelected && sliderValue ? sliderValue : null;

    yield* Coro.all([
        interpvr(messageObj).translate(0, -128).over(400),
        interpv(sliderContainerObj.scale).steps(4).to(0, 0).over(400),
        interpvr(rejectButtonObj).steps(5).translate(0, 200).over(700),
    ]);

    obj.destroy();

    return value;
}

interface ObjSliderArgs {
    max: Integer;
    value: Integer;
    colors: DramaLib.Speaker.Colors;
}

function objSlider({ max, value, colors }: ObjSliderArgs) {
    const width = 224;
    const fgGfx = new Graphics().beginFill(0xffffff).drawRect(0, 0, 1, 12).at(14, 26);

    const controls = {
        isSelected: true,
        value,
    };

    const valueTextObj = objText.MediumBoldIrregular(String(value), { tint: colors.textSecondary })
        .scaled(2, 2)
        .anchored(0.5, 0.5)
        .step(self => self.text = String(controls.value));

    return container(
        Sprite.from(Tx.Ui.Dialog.AskRemoveCountSliderBox).tinted(colors.secondary).anchored(0.5, 0.5).mixin(
            mxnBoilMirrorRotate,
        ).at(148, 31),
        new Graphics().lineStyle({
            alignment: 1,
            alpha: 1,
            color: 0x000000,
            width: 4,
            cap: LINE_CAP.ROUND,
            join: LINE_JOIN.ROUND,
        })
            .beginFill(0x000000)
            .drawRect(0, 0, width, 12).at(fgGfx).angled(0.3),
        fgGfx,
        container(valueTextObj)
            .at(270, 37)
            .coro(function* (self) {
                while (true) {
                    yield onMutate(controls);
                    valueTextObj.seed += 1;
                    for (let i = 0; i < 2; i++) {
                        self.pivot.x = 1;
                        yield sleepf(2);
                        self.pivot.x = -1;
                        yield sleepf(2);
                    }

                    self.pivot.x = 0;
                }
            }),
    )
        .merge({ controls })
        .step(() => {
            let target = width;

            if (controls.value <= 0) {
                target = 0;
            }
            else if (controls.value < max) {
                target = Math.max(1, Math.round((controls.value / max) * (width - 1)));
            }

            fgGfx.scale.x = approachLinear(fgGfx.scale.x + (target - fgGfx.scale.x) * 0.3, target, 1);
        });
}

function objHeader(text: string, tint: RgbInt) {
    const firstLetterObj = objText.Large(text.substring(0, 1), { tint }).anchored(0, 1).at(0, 2);

    return container(
        firstLetterObj,
        objText.MediumBoldIrregular(text.substring(1), { tint })
            .mixin(mxnBoilSeed)
            .at(firstLetterObj.width + 1, 0)
            .anchored(0, 1),
    );
}

export const DramaMisc = {
    arriveViaDoor,
    askInteger,
    askNullableInteger,
    departRoomViaDoor,
    face,
    levitatePlayer,
    walkToDoor,
};
