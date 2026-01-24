import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { blendColor } from "../../../lib/color/blend-color";
import { Integer } from "../../../lib/math/number-alias-types";
import { PseudoRng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { range } from "../../../lib/range";
import { show } from "../../drama/show";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { objFigureFlop } from "../figures/obj-figure-flop";

const rng = new PseudoRng();

const shapes = [
    Tx.Shapes.Confetti18x8,
    Tx.Shapes.Confetti32,
    Tx.Shapes.Confetti45deg,
    Tx.Shapes.ConfettiCorner,
    Tx.Shapes.CircleIrregular26,
    Tx.Shapes.DashedLine3px,
    Tx.Shapes.DashedLineArc3px,
    Tx.Shapes.LumpSmall0,
];

const consts = {
    width: 64,
    height: 96,
};

export function objEsotericArt(seed: Integer) {
    rng.seed = seed;

    const palette = range(rng.intc(4, 6)).map(() => rng.color());
    const blendedCount = rng.intc(0, 2);

    function objShape() {
        return Sprite.from(rng.item(shapes))
            .anchored(0.5, 0.5)
            .tinted(rng.item(palette))
            .flipH(rng.choose(1, -1))
            .flipV(rng.choose(1, -1))
            .angled(rng.intc(0, 3) * 90)
            .at(rng.intc(consts.width), rng.intc(consts.height));
    }

    function objFlop() {
        const [red, green, blue, white] = rng.shuffle(palette);

        return objFigureFlop.objFromSeed(rng.intc(Number.MAX_SAFE_INTEGER))
            .at(consts.width / 2, rng.intc(24, consts.height))
            .filtered(new MapRgbFilter(red, green, blue, white));
    }

    for (let i = 0; i < blendedCount; i++) {
        const [firstColor, secondColor] = rng.shuffle(palette);
        const blendedColor = blendColor(firstColor ?? 0, secondColor ?? 0, rng.float(0.4, 0.6));
        palette.push(blendedColor);
    }

    const mask = new Graphics().beginFill(0xffffff).drawRect(0, 0, consts.width, consts.height);

    const obj = container(
        new Graphics().beginFill(rng.item(palette)).drawRect(0, 0, consts.width, consts.height),
        ...range(rng.intc(24, 48)).map(objShape),
        objFlop(),
        ...range(rng.intc(0, 16)).map(objShape),
    );

    return container(obj, mask)
        .merge({ objEsotericArt: { seed, colorPrimary: palette[0], colorSecondary: palette.last } })
        .masked(mask);
}

type ObjEsotericArt = ReturnType<typeof objEsotericArt>;

const interactiveConsts = {
    adjectives: [
        "arrogant",
        "blessed",
        "crunchy",
        "dainty",
        "eastern",
        "foul",
        "grand",
        "hyper",
        "ill",
        "juiced",
        "loose",
        "miserable",
        "northern",
        "outer",
        "pressed",
        "rippling",
        "southern",
        "strained",
        "tried",
        "unearthed",
        "visceral",
        "western",
        "winded",
    ],
    nouns: [
        "aardvark",
        "beaver",
        "camel",
        "dingo",
        "eagle",
        "falcon",
        "gator",
        "hippo",
        "ibex",
        "jackal",
        "llama",
        "narwhal",
        "ostrich",
        "penguin",
        "quetzal",
        "rhino",
        "seahorse",
        "tiger",
        "urchin",
        "vulture",
        "zebra",
        "apple",
        "banana",
        "durian",
        "fig",
        "grape",
        "honeydew",
        "kumquat",
        "lemon",
        "mango",
        "nectarine",
        "orange",
        "papaya",
        "watermelon",
    ],
    verbs: [
        "apart from",
        "beyond",
        "carried by",
        "drained by",
        "escaping",
        "fearful of",
        "greeting",
        "honored by",
        "invested in",
        "upon",
        "with",
    ],
    reactions: [
        "Hmmm... Adequate.",
        "Beautiful!",
        "Charming.",
        "...Daring, I guess.",
        "Exceptional!",
        "Fierce!",
        "Gay.",
        "Homosexuality.",
        "Interesting...",
        "Lame.",
        "Mid.",
        "Nice!",
        "Oooh! I like it.",
        "Priceless.",
        "Really cool.",
        "Simple. Cool.",
        "Too... I'm not sure...",
        "Ugly... Sorry...",
        "Very nice!",
        "Well done!",
    ],
};

export function mxnEsotericArtInteractive(obj: ObjEsotericArt) {
    const { colorPrimary, colorSecondary, seed } = obj.objEsotericArt;

    rng.seed = seed;
    const reaction = rng.item(interactiveConsts.reactions);

    return obj
        .mixin(mxnSpeaker, { colorPrimary, colorSecondary, name: createTitle(seed) })
        .mixin(mxnCutscene, function* () {
            yield* show(reaction);
        });
}

function doesWordNeedTitleCase(word: string) {
    return word !== "a" && word !== "and" && word !== "an" && word !== "the";
}

function applyTitleCase(word: string) {
    return word[0].toUpperCase() + word.substring(1);
}

function createTitle(seed: Integer) {
    const uncased = createUncasedTitle(seed);
    return uncased
        .toLowerCase()
        .split(" ")
        .filter(x => x.length)
        .map((word, i) => (i === 0 || doesWordNeedTitleCase(word)) ? applyTitleCase(word) : word)
        .join(" ");
}

function createUncasedTitle(seed: Integer) {
    rng.seed = seed;

    const twoObjects = rng.float() > 0.3;

    if (!twoObjects) {
        return articleize(createTitleObject(rng, true), chooseArticle(rng));
    }
    const adjective = rng.choose(0b01, 0b10, 0b11);
    return articleize(createTitleObject(rng, Boolean(adjective & 0b01)), chooseArticle(rng))
        + " "
        + rng.item(interactiveConsts.verbs)
        + " "
        + articleize(createTitleObject(rng, Boolean(adjective & 0b10)), rng.choose("definite", "indefinite"));
}

type Article = "none" | "definite" | "indefinite";

function chooseArticle(rng: PseudoRng): Article {
    return rng.choose("none", "definite", "indefinite");
}

function createTitleObject(rng: PseudoRng, adjective: boolean) {
    if (!adjective) {
        return rng.item(interactiveConsts.nouns);
    }
    return rng.item(interactiveConsts.adjectives) + " " + rng.item(interactiveConsts.nouns);
}

function articleize(object: string, article: Article) {
    if (article === "definite") {
        return "the " + object;
    }
    if (article === "indefinite") {
        return (startsWithVowel(object) ? "an" : "a") + " " + object;
    }

    return object;
}

function startsWithVowel(string: string) {
    const first = string.toLowerCase()[0];
    return first === "a" || first === "e" || first === "i" || first === "o" || first === "u";
}
