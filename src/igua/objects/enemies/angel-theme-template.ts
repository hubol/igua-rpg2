import { Sprite, Texture } from "pixi.js";
import { ObjAngelEyes, objAngelEyes, ObjAngelEyesArgs } from "./obj-angel-eyes";
import { ObjAngelMouth, objAngelMouth, ObjAngelMouthArgs } from "./obj-angel-mouth";

export namespace AngelThemeTemplate {
    type Sprites = Record<string, Texture>;
    type Tints = Record<string, unknown>;

    interface Config<TSprites extends Sprites, TTints extends Tints> {
        eyes: ObjAngelEyesArgs;
        mouth: ObjAngelMouthArgs;
        sprites: TSprites;
        tints: TTints;
    }

    interface PartialConfig<TSprites extends Sprites, TTints extends Tints> {
        eyes?: Partial<ObjAngelEyesArgs>;
        mouth?: Partial<ObjAngelMouthArgs>;
        sprites?: Partial<TSprites>;
        tints?: Partial<TTints>;
    }

    interface Apply<TSprites extends Sprites> {
        eyes?: (eyes: ObjAngelEyes) => unknown;
        mouth?: (eyes: ObjAngelMouth) => unknown;
        sprites?: Partial<Record<keyof TSprites, (sprite: Sprite) => unknown>>;
    }

    interface Theme<TSprites extends Sprites, TTints extends Tints> {
        createEyesObj: () => ObjAngelEyes;
        createMouthObj: () => ObjAngelMouth;
        createSprite: (id: keyof TSprites) => Sprite;
        readonly tints: TTints;
    }

    export function create<TSprites extends Sprites, TTints extends Tints>(
        templateConfig: Config<TSprites, TTints>,
        templateApply: Apply<TSprites> = {},
    ) {
        return {
            createTheme(
                themeConfig?: PartialConfig<TSprites, TTints>,
                themeApply?: Apply<TSprites>,
            ): Theme<TSprites, TTints> {
                const eyesArgs = { ...templateConfig.eyes, ...themeConfig?.eyes };
                const mouthArgs = { ...templateConfig.mouth, ...themeConfig?.mouth };

                return {
                    createEyesObj: () => {
                        const obj = objAngelEyes(eyesArgs);
                        templateApply.eyes?.(obj);
                        themeApply?.eyes?.(obj);
                        return obj;
                    },
                    createMouthObj: () => {
                        const obj = objAngelMouth(mouthArgs);
                        templateApply.mouth?.(obj);
                        themeApply?.mouth?.(obj);
                        return obj;
                    },
                    createSprite: (id) => {
                        const obj = Sprite.from(themeConfig?.sprites?.[id] ?? templateConfig.sprites[id]);
                        templateApply.sprites?.[id]?.(obj);
                        themeApply?.sprites?.[id]?.(obj);
                        return obj;
                    },
                    tints: {
                        ...templateConfig.tints,
                        ...themeConfig?.tints,
                    },
                };
            },
        };
    }
}
