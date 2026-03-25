import { Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Integer } from "../../lib/math/number-alias-types";
import { PseudoRng, Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { DevKey, Input, layers } from "../globals";
import { mxnHudModifiers } from "../mixins/mxn-hud-modifiers";
import { DramaMisc } from "./drama-misc";

export function* dramaQuizComputerScience() {
    objProgram()
        .mixin(mxnHudModifiers.mxnHideStatus)
        .show(layers.overlay.messages);
    yield () => Input.isUp("Confirm");
    yield () => Input.justWentDown("Confirm");
    const value = yield* DramaMisc.askInteger("What does the program output?", { max: 99, align: "right" });
}

interface GenerateProgramArgs {
    cases: Integer;
    nestedCases: Integer;
    features: Set<"or" | "mod_2" | "mod_n">;
    seed: Integer;
}

function generateProgramText(rng: Omit<PseudoRng, "seed">, args: Omit<GenerateProgramArgs, "seed">) {
    const input = rng.intc(-10, 40);
    return `function fn(input) {
  if (input % 2 === 0) {
    return input + 11;
  }
  return Math.max(0, input);
}
    
const value = fn(${input});
return value;`;
}

function generateProgram(args: GenerateProgramArgs) {
    const rng = new PseudoRng(args.seed);
    while (true) {
        const text = generateProgramText(rng, args);
        const fn = new Function(text);
        const output = fn();
        if (Number.isInteger(output) && output >= 0 && output <= 99) {
            return {
                text: text.replace("return value", "console.log(value)"),
                correctOuptut: output,
            };
        }
    }
}

function objProgram() {
    return container(
        new Graphics()
            .beginFill(0xffffff)
            .drawRect(0, 0, 200, 250),
        objText.MediumMono(generateProgram({ seed: Rng.int(0, 9999999) } as any).text, { tint: 0 })
            .at(3, 3),
    );
}
