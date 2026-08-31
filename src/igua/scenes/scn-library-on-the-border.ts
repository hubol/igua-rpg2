import { Sprite, Texture } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { blendColor } from "../../lib/color/blend-color";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { RgbInt } from "../../lib/math/number-alias-types";
import { PseudoRng, Rng } from "../../lib/math/rng";
import { range } from "../../lib/range";
import { Null } from "../../lib/types/null";
import { DataLibraryBook } from "../data/data-library-book";
import { DataPotion } from "../data/data-potion";
import { ask, show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSparkling } from "../mixins/mxn-sparkling";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

const prng = new PseudoRng();

export function scnLibraryOnTheBorder() {
    const lvl = Lvl.LibraryOnTheBorder();

    [
        ...lvl.WaterGroup.children,
        ...lvl.BehindWaterGroup.children,
    ]
        .forEach(obj => obj.mixin(mxnSinePivot));

    const playerCameFromIndiana = playerObj.x < scene.level.width / 2;
    const patrollerNpc = playerCameFromIndiana ? lvl.BouncerNpc0 : lvl.BouncerNpc1;
    const librarianNpc = playerCameFromIndiana ? lvl.IndianaLibrarianNpc : lvl.OhioLibrarianNpc;
    const bookObjs = (playerCameFromIndiana ? lvl.SpecialBookIndianaGroup : lvl.SpecialBookOhioGroup)
        .children
        .map(obj => obj.mixin(mxnLibraryBook));

    function* dramaHighlightBooksOnSubject(subject: DataLibraryBook.SubjectId) {
        for (const book of bookObjs) {
            book.mxnLibraryBook.clear();
        }

        const catalog = DataLibraryBook.catalogs[subject];
        prng.seed = catalog.locationSeed;
        const shuffledBookObjs = prng.shuffle([...bookObjs]);

        for (let i = 0; i < Math.min(shuffledBookObjs.length, catalog.books.length); i++) {
            shuffledBookObjs[i].mxnLibraryBook.setContents(catalog.books[i]);
            yield sleep(200);
        }
    }

    lvl.EnemyBrick
        .mxnRpgStatusPotions.heldPotionIds.push(
            ...range(99).map((): DataPotion.Id => "HotDogKetchupMustardOnionRelish"),
        );

    patrollerNpc
        .coro(function* (self) {
            while (true) {
                yield () =>
                    (self.collides(playerObj) || playerObj.collides(lvl.RejectPlayerRegion))
                    && playerObj.y <= self.y + 3;
                yield Cutscene.play(function* () {
                    yield () => self.isOnGround;
                    self.auto.facing = Math.sign(playerObj.x - self.x);
                    yield* show("You are not supposed to be up here!");
                    playerObj.speed.x = 16 * (self === lvl.BouncerNpc0 ? -1 : 1);
                    if (playerObj.isOnGround) {
                        playerObj.speed.y = -5;
                    }
                }, { speaker: self })
                    .done;
                yield () => playerObj.speed.y >= 0 && playerObj.isOnGround;
            }
        });

    librarianNpc
        .mixin(mxnCutscene, function* () {
            yield* show(
                "Welcome to the library on the border!",
                "Please have a look around.",
            );

            const result = yield* ask(
                "Is there anything I can help you with?",
                "What is going on here?",
                "I want to learn about fighting",
                // TODO these are unimplemented
                "I want to learn about angels",
                "I want to learn about shoes",
            );

            if (result === 0) {
                yield* show(
                    "This is the library between Indiana and Ohio.",
                    "Right now there is a leak on the roof and we are attempting to make repairs.",
                    "Please leave the guys up there alone. It is not an easy job.",
                );
            }
            else if (result === 1) {
                yield* show(
                    "OK, give me one moment and I will highlight the books you should check out if you are interested in combat.",
                );
                yield sleep(1000);
                yield* dramaHighlightBooksOnSubject("combat");
                yield* show("OK, that should be all of them. Enjoy!");
            }
        });
}

const bookTints = new Map<Texture, [RgbInt, RgbInt]>([
    [Tx.Furniture.Library.Book0, [0x404040, 0x7F7F7F]],
    [Tx.Furniture.Library.Book1, [0xE0210F, 0xE07C0F]],
    [Tx.Furniture.Library.Book2, [0xE0590F, 0xF0AA0F]],
    [Tx.Furniture.Library.Book3, [0xEFBF13, 0xEFD500]],
    [Tx.Furniture.Library.Book4, [0x74C900, 0x74E800]],
    [Tx.Furniture.Library.Book5, [0x432ECC, 0x43A3CC]],
    [Tx.Furniture.Library.Book6, [0x722FCC, 0xA369E0]],
]);

function mxnLibraryBook(obj: Sprite) {
    const [tintPrimary, tintSecondary] = bookTints.get(obj.texture) ?? [0xf0f0f0, 0x202020];

    const mixedObj = obj
        .mixin(mxnSparkling)
        .mixin(mxnSpeaker, { name: "Tome", tintPrimary, tintSecondary });

    let currentBook = Null<DataLibraryBook.Book>();

    const api = {
        clear() {
            currentBook = null;
        },
        setContents(book: DataLibraryBook.Book) {
            mixedObj.speaker.name = book.title;
            currentBook = book;
        },
    };

    const sparkleTint = blendColor(tintSecondary, 0xffffff, 0.5);

    return mixedObj
        .merge({ mxnLibraryBook: api })
        .mixin(mxnCutscene, function* () {
            if (yield* ask(`Read the ${currentBook!.pages.length}-page book?`)) {
                for (const page of currentBook!.pages) {
                    yield* show(typeof page === "string" ? page : page());
                }
                Rpg.character.temporaryEffects.add("IntelligenceFromLibraryBook", 60);
            }
        })
        .step(self => {
            self.interact.enabled = Boolean(currentBook);
            self.sparklesTint = Rng.bool() ? sparkleTint : 0xffffff;
            self.sparklesPerFrame = self.interact.enabled ? 0.075 : 0;
        });
}
