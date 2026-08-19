import { Integer } from "../../lib/math/number-alias-types";
import { txt } from "../../lib/pixi/txt";
import { objFigureInputActionControl } from "../objects/figures/obj-figure-action-control";

export namespace DataLibraryBook {
    export type SubjectId = "combat";

    export interface Catalog {
        locationSeed: Integer;
        books: Book[];
    }

    export interface Book {
        title: string;
        pages: (string | (() => string))[];
    }

    export const catalogs: Record<SubjectId, Catalog> = {
        combat: {
            locationSeed: 69,
            books: [
                {
                    title: "On Defending Oneself",
                    pages: [
                        "Has this ever happened to you: An angel is hurling a big attack at you and there is no chance you'll get away?",
                        "Consider this: Ducking",
                        "By default, ducking will reduce incoming physical damage by 20%.",
                        "Emotional, Overheat, Poison, and Wetness attacks do not receive this reduction.",
                        "However! Successfully ducking to defend against an attack will ALWAYS leave you with 1HP if you are above 1HP.",
                        "I hope you enjoyed this lesson on ducking.",
                    ],
                },
                {
                    title: "Executing Claw Attacks... Perfectly!",
                    pages: [
                        "Perfect Claw Attacks, you've heard of them, but what are they?",
                        "You may first wish to educate yourself on what a Claw Attack is first.",
                        "Please refer to the book \"Distinguishing Claw and Face Attacks\".",
                        () =>
                            txt`Perfect Claw Attacks are performed by pressing ${
                                objFigureInputActionControl("Jump")
                            } right as you are about to land on your enemy.`,
                        "A Perfect Claw Attack will deal approximately 30% more damage to an enemy.",
                        "You can even practice Perfect Claw Attacks without enemies around!",
                        () =>
                            txt`Try maintaining forward momentum and pressing ${
                                objFigureInputActionControl("Jump")
                            } just before landing on the ground.`,
                        "When performed correctly, you will kick up special dust and gain some forward momentum!",
                    ],
                },
                {
                    title: "Helium, Overheat, Poison, Wetness... Oh My!",
                    pages: [
                        "Helium, Overheat, Poison, and Wetness are conditions to which iguanas and many angels are susceptible.",
                        "These conditions can build up gradually due to exposure.",
                        "Helium: When exposed to enough Helium, iguanas gain a ballon.",
                        "Ballons alter the effect of gravity on iguanas.",
                        "Overheat: When exposed to enough Overheat, angels and iguanas will suffer instantaneous Overheat damage.",
                        "There are several brands of Shoe that will slow Overheat buildup and reduce Overheat damage.",
                        "Poison: When exposed to enough Poison, angels and iguanas will suffer gradual Poison damage.",
                        "Poison damage is non-fatal, never reducing the afflicted's health below 5HP.",
                        "Iguanas move and bounce faster while afflicted with Poison.",
                        "Poison may be cured with medicine available at certain shops.",
                        "Poison may have different severity levels, resulting in faster Poison damage and increased iguana speed.",
                        "Wetness: When exposed to enough Wetness, angels and iguanas will drip with fluid.",
                        "This has no apparent impact on fighting ability of angels nor iguanas.",
                    ],
                },
                {
                    title: "Distinguishing Claw and Face Attacks",
                    pages: [
                        "Your claws are powerful weapons.",
                        "However, it is important that you use them properly.",
                        "To deal maximum damage to an enemy with melee attacks, you must stomp on enemies from above.",
                        "If your claws are the first to touch an enemy, you will deal a Claw Attack.",
                        "Otherwise, you will deal a Face Attack.",
                        "Face Attacks can deal less than 50% of Claw Attack physical damage.",
                    ],
                },
            ],
        },
    };
}
