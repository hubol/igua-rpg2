import { Sprite } from "pixi.js";
import { Tx } from "../../../../assets/textures";
import { objUiButton } from "../../framework/obj-ui-button";

const [
    headIcon,
    bodyIcon,
    feetIcon,
    checkIcon,
    backIcon,
    floppyIcon,
    crestIcon,
    eyesIcon,
    mouthIcon,
    hornIcon,
    pupilsIcon,
    torsoIcon,
    tailIcon,
    clubIcon,
    foreIcon,
    hindIcon,
    nailsIcon,
    lightBulbIcon] = Tx.Ui.ChooseYourLooksIcons.split({ width: 30 });

const icons = {
    'head': headIcon,
    'body': bodyIcon,
    'feet': feetIcon,
    'done': floppyIcon,
    'back': backIcon,
    'crest': crestIcon,
    'eyes': eyesIcon,
    'mouth': mouthIcon,
    'horn': hornIcon,
    'pupils': pupilsIcon,
    'torso': torsoIcon,
    'tail': tailIcon,
    'club': clubIcon,
    'fore': foreIcon,
    'hind': hindIcon,
    'claws': nailsIcon,
    'ok': checkIcon,
    'inspiration': lightBulbIcon,
}

function getIcon(text: string) {
    return icons[text.toLowerCase()];
}

export function objUiDesignerButton(text: string, onPress: () => unknown, width = 96, height = 30) {
    const obj = objUiButton(text, onPress, width, height);

    const icon = getIcon(text);
    if (icon)
        obj.addChild(Sprite.from(icon));

    return obj;
}
