import { Container } from "pixi.js";

interface DefaultStagesType {
    readonly show: Container;
}

export function setDefaultStages(defaultStages: DefaultStagesType) {
    DefaultStages = defaultStages;
}

export let DefaultStages: DefaultStagesType = {
    get show() {
        throw new Error('DefaultStages.show is not implemented!');
        return undefined as any;
    }
}