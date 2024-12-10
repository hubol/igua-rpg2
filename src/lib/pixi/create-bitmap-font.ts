import { BitmapFont, BitmapFontData, Texture } from "pixi.js";
import { Integer } from "../math/number-alias-types";

interface CharacterData {
    x: Integer;
    y: Integer;
    w: Integer;
    h: Integer;
    yoff?: Integer;
    xadv: Integer;
}

type CharactersData = Record<string, CharacterData>;

interface CreateBitmapFontFactoryArgs<TCharacters extends CharactersData> {
    name: string;
    size: Integer;
    lineHeight: Integer;
    characters: TCharacters;
    kernings: Array<[first: keyof TCharacters, second: keyof TCharacters, amount: Integer]>;
}

export function createBitmapFont<TCharacters extends CharactersData>(
    texture: Texture,
    args: CreateBitmapFontFactoryArgs<TCharacters>,
) {
    const data = new BitmapFontData();
    data.common = [{ lineHeight: args.lineHeight }];
    data.info = [{ face: args.name, size: args.size }];
    data.page = [{ id: 0, file: "createBitmapFont.data.page[0]" }];
    data.char = Object.entries(args.characters).map(([char, character]) => ({
        id: char.charCodeAt(0),
        x: character.x,
        y: character.y,
        width: character.w,
        height: character.h,
        xadvance: character.xadv,
        yoffset: character.yoff ?? 0,
        page: 0,
        xoffset: 0,
    }));
    data.kerning = args.kernings.map(([first, second, amount]) => ({
        first: (first as string).charCodeAt(0),
        second: (second as string).charCodeAt(0),
        amount,
    }));

    return BitmapFont.install(data, texture);
}
