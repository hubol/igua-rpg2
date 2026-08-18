import { Integer } from "../../lib/math/number-alias-types";

export namespace DataLibraryBook {
    export type SubjectId = "combat";

    export interface Catalog {
        locationSeed: Integer;
        books: Book[];
    }

    export interface Book {
        title: string;
        pages: string[];
    }

    export const catalogs: Record<SubjectId, Catalog> = {
        combat: {
            locationSeed: 69,
            books: [
                {
                    title: "On Defending Oneself",
                    pages: [
                        "This is a book about ducking.",
                    ],
                },
                {
                    title: "Executing Claw Attacks... Perfectly!",
                    pages: [
                        "This is a book about perfect claw attacks.",
                    ],
                },
                {
                    title: "Helium, Overheat, Poison... Oh My!",
                    pages: [
                        "This is a book about conditions.",
                    ],
                },
                {
                    title: "Distinguishing Claw and Face Attacks",
                    pages: [
                        "This is a book about conditions.",
                    ],
                },
            ],
        },
    };
}
