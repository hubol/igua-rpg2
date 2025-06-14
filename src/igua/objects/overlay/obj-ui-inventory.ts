import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { SubjectiveColorAnalyzer } from "../../../lib/color/subjective-color-analyzer";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { PseudoRng } from "../../../lib/math/rng";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { EquipmentInternalName, getDataEquipment } from "../../data/data-equipment";
import { Cutscene, Input } from "../../globals";
import { mxnUiPageButton } from "../../mixins/mxn-ui-page-button";
import { mxnUiPageElement } from "../../mixins/mxn-ui-page-element";
import { RpgProgress } from "../../rpg/rpg-progress";
import { objUiPage, objUiPageRouter } from "../../ui/framework/obj-ui-page";
import { StepOrder } from "../step-order";

export function objUiInventory() {
    return container().coro(function* (self) {
        while (true) {
            yield () => Input.isUp("InventoryMenuToggle");
            yield () => Input.justWentDown("InventoryMenuToggle") && !Cutscene.isPlaying;
            const obj = objUiInventoryImpl().show(self);
            yield* Coro.race([
                Coro.chain([() => Input.isUp("InventoryMenuToggle"), () => Input.justWentDown("InventoryMenuToggle")]),
                () => Cutscene.isPlaying,
            ]);
            obj.destroy();
        }
    });
}

function objUiInventoryImpl() {
    const routerObj = objUiPageRouter();
    routerObj.push(objUiEquipmentLoadoutPage());

    return routerObj;
}

function objUiEquipmentLoadoutPage() {
    const uiEquipmentObjs = range(4).map(i =>
        objUiEquipment(() => RpgProgress.character.equipment[i], "show_empty").at(i * 36, 0).mixin(mxnUiPageElement)
            .mixin(mxnUiPageButton, { onPress: () => {} })
    );

    const pageObj = objUiPage(uiEquipmentObjs, { selectionIndex: 0 }).at(180, 100);
    Sprite.from(Tx.Ui.EquippedIguana).at(-9, -80).show(pageObj);

    return pageObj;
}

function objUiEquipment(provider: () => EquipmentInternalName | null, variant: "show_empty") {
    let appliedName: EquipmentInternalName | null | undefined = undefined;

    const renderObj = container();
    const obj = container(renderObj).step(maybeApply, StepOrder.BeforeCamera);

    function maybeApply() {
        const nameToApply = provider();
        if (nameToApply === appliedName) {
            return;
        }

        renderObj.removeAllChildren();

        if (nameToApply !== null) {
            objEquipmentRepresentation(nameToApply).show(renderObj);
        }
        else if (variant === "show_empty") {
            Sprite.from(Tx.Ui.Empty).show(renderObj);
        }

        appliedName = nameToApply;
    }

    maybeApply();

    return obj;
}

function objEquipmentRepresentation(internalName: EquipmentInternalName) {
    const props = getPlaceholderProperties(internalName);

    return container(
        new Graphics().beginFill(props.backgroundTint).drawRect(0, 0, 32, 32),
        objText.Medium(props.name, { tint: props.textTint, maxWidth: 32, align: "center" }).anchored(0.5, 0.5).at(
            16,
            16,
        ),
    );
}

const prng = new PseudoRng();
const printedNameSanitizeRegexp = /((Ring)|a|e|i|o|u)*/g;
const whiteSpaceRegexp = /\s+/g;

// TODO placeholder until I draw sprites... I guess
function getPlaceholderProperties(internalName: EquipmentInternalName) {
    let seed = internalName.length * 698769;
    for (let i = 0; i < internalName.length; i++) {
        seed += internalName.charCodeAt(i) * 9901237 + 111 - i * 3;
    }

    prng.seed = seed;

    const backgroundTint = AdjustColor.hsv(prng.float(0, 360), prng.float(80, 100), prng.float(80, 100)).toPixi();
    const textTint = SubjectiveColorAnalyzer.getPreferredTextColor(backgroundTint);

    return {
        backgroundTint,
        textTint,
        name: getDataEquipment(internalName).name
            .replaceAll(printedNameSanitizeRegexp, "")
            .replaceAll(whiteSpaceRegexp, " ")
            .trim(),
    };
}
