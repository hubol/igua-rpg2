import { Sprite } from "pixi.js";
import { Tx } from "../../../../assets/textures";
import { objUiButton } from "../../framework/obj-ui-button";
import { UiPage } from "../../framework/obj-ui-page";
import { CtxUiIguanaDesigner } from "../obj-ui-iguana-designer-root";

const [
    headIcon,
    bodyIcon,
    feetIcon,
    checkIcon,
    backIcon,
    floppyIcon,
    crestIcon,
    eyesIconUnused,
    mouthIcon,
    hornIcon,
    pupilsIconUnused,
    torsoIcon,
    tailIcon,
    clubIcon,
    foreIcon,
    hindIcon,
    nailsIcon,
    lightBulbIcon,
    foreRightIcon,
    hindRightIcon,
    foreLeftIcon,
    hindLeftIcon,
    eyelidIcon,
    scleraIcon,
    pupilIcon,
    eyesIcon,
    eyelidsIcon,
    sclerasIcon,
    pupilsIcon,
    leftEyeIcon,
    rightEyeIcon,
] = Tx.Ui.ChooseYourLooksIcons.split({ width: 30 });

const icons = {
    "head": headIcon,
    "body": bodyIcon,
    "feet": feetIcon,
    "done": floppyIcon,
    "back": backIcon,
    "crest": crestIcon,
    "eyes": eyesIcon,
    "mouth": mouthIcon,
    "horn": hornIcon,
    "pupils": pupilsIcon,
    "torso": torsoIcon,
    "tail": tailIcon,
    "club": clubIcon,
    "fore": foreIcon,
    "hind": hindIcon,
    "claws": nailsIcon,
    "ok": checkIcon,
    "advanced": lightBulbIcon,
    "inspiration": lightBulbIcon,
    "fore right": foreRightIcon,
    "hind right": hindRightIcon,
    "fore left": foreLeftIcon,
    "hind left": hindLeftIcon,
    "left eye": leftEyeIcon,
    "right eye": rightEyeIcon,
    "sclera": scleraIcon,
    "eyelid": eyelidIcon,
    "pupil": pupilIcon,
    "eyelids": eyelidsIcon,
};

function getIcon(text: string) {
    return icons[text.toLowerCase()];
}

export function objUiDesignerButton(text: string, onPress: () => unknown, width = 96, height = 30) {
    const obj = objUiButton(text, onPress, width, height).merge({ note: "" });

    const icon = getIcon(text);
    if (icon) {
        obj.addChild(Sprite.from(icon));
    }

    return obj;
}

export function objUiDesignerNavigationButton(text: string, createPageFn: () => UiPage) {
    return objUiDesignerButton(text, () => CtxUiIguanaDesigner.value.router.push(createPageFn()));
}
