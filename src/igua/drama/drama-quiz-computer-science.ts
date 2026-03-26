import { Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Integer } from "../../lib/math/number-alias-types";
import { PseudoRng, Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { Input, layers } from "../globals";
import { mxnHudModifiers } from "../mixins/mxn-hud-modifiers";
import { DramaMisc } from "./drama-misc";
import { show } from "./show";

const difficultyConfigs: Array<Omit<GenerateProgramArgs, "seed">> = [
    { features: new Set(), cases: 3 },
    { features: new Set(["or"]), cases: 3 },
    { features: new Set(["and", "or"]), cases: 4 },
    { features: new Set(["and", "or", "mod_2"]), cases: 4 },
    { features: new Set(["and", "or", "mod_2", "mod_n"]), cases: 4 },
    { features: new Set(["and", "or", "mod_2", "mod_n"]), cases: 5 },
];

export function* dramaQuizComputerScience(difficulty: Integer) {
    const config = difficultyConfigs[difficulty] ?? difficultyConfigs.last;

    const program = generateProgram({
        seed: Rng.int(0, 9999999),
        ...config,
    });

    const programObj = objProgram(program)
        .mixin(mxnHudModifiers.mxnHideStatus)
        .show(layers.overlay.messages);
    yield () => Input.isUp("Confirm");
    yield () => Input.justWentDown("Confirm");
    const guess = yield* DramaMisc.askInteger("What does the program output?", { max: 99, align: "right" });

    programObj.destroy();

    if (guess === program.correctOuptut) {
        yield* show("You are smart!");
        return true;
    }

    yield* show(
        `Sorry, the correct answer was:\n${program.correctOuptut}`,
    );
    return false;
}

type ProgramFeature = "and" | "or" | "mod_2" | "mod_n";

interface GenerateProgramArgs {
    cases: Integer;
    features: Set<ProgramFeature>;
    seed: Integer;
}

function generateReturnExpressionText(rng: Omit<PseudoRng, "seed">) {
    const value = rng.intc(4);
    if (value === 0) {
        return `input`;
    }
    if (value === 1) {
        return `input + ${rng.intc(11, 59)}`;
    }
    if (value === 2) {
        return `-input + ${rng.intc(41, 89)}`;
    }
    return rng.intc(1, 99);
}

function generateProgramText(rng: Omit<PseudoRng, "seed">, args: Omit<GenerateProgramArgs, "seed">) {
    const input = rng.intc(-10, 40);
    const caseFeatures: Array<ProgramFeature | null> = rng.shuffle([
        ...args.features,
        ...range(Math.max(0, args.cases - args.features.size))
            .map(() => null),
    ])
        .slice(0, args.cases);

    const caseExpressionTexts = caseFeatures.map(feature => {
        if (feature === "and") {
            const min = rng.intc(-10, 30);
            const max = min + rng.intc(10);
            return `input >= ${min} && input <= ${max}`;
        }
        if (feature === "or") {
            const min = rng.intc(-10, 30);
            const max = min + rng.intc(1, 10);
            return `input < ${min} || input > ${max}`;
        }
        if (feature === "mod_2") {
            return `input % 2 == ${rng.choose(0, 1)}`;
        }
        if (feature === "mod_n") {
            const n = rng.intc(3, 5);
            const remainder = rng.int(n);
            return `input % ${n} == ${remainder}`;
        }
        return `input ${rng.choose("<", ">", "<=", ">=")} ${rng.intc(-10, 40)}`;
    });

    const caseTexts = caseExpressionTexts
        .map((text) =>
            `  if (${text}) {
    return ${generateReturnExpressionText(rng)};
  }`
        );

    return `function fn(input) {
${caseTexts.join("\n")}
  return ${generateReturnExpressionText(rng)};
}
    
const value = fn(${input});
return value;`;
}

function generateProgram(args: GenerateProgramArgs) {
    const rng = new PseudoRng(args.seed);
    while (true) {
        const text = generateProgramText(rng, args);
        const fn = new Function(text);
        const output: Integer = fn();
        if (Number.isInteger(output) && output >= 1 && output <= 99) {
            return {
                text: text.replace("return value", "console.log(value)"),
                correctOuptut: output,
            };
        }
    }
}

type Program = ReturnType<typeof generateProgram>;

function objProgram(program: Program) {
    return container(
        new Graphics()
            .beginFill(0xffffff)
            .drawRect(0, 0, 240, 250),
        objText.MediumMono(program.text, { tint: 0 })
            .at(3, 3),
    );
}
