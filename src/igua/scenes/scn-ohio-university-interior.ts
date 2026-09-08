import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { Rng } from "../../lib/math/rng";
import { DataFact } from "../data/data-fact";
import { DramaClassroom } from "../drama/drama-classroom";
import { DramaPotions } from "../drama/drama-potions";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnDoorAutoUnlock } from "../mixins/mxn-door-auto-unlock";
import { mxnRpgStatus } from "../mixins/mxn-rpg-status";
import { CtxTerrainPipe } from "../objects/obj-terrain";
import { Rpg } from "../rpg/rpg";
import { RpgEnemyRank } from "../rpg/rpg-enemy-rank";
import { RpgQuest } from "../rpg/rpg-quests";

export function scnOhioUniversityInterior() {
    CtxTerrainPipe.value.texture = NoAtlasTx.Terrain.Pipe.BlackSolidLine2px;
    const lvl = Lvl.OhioUniversityInterior();
    const quest = Rpg.quest("OhioUniversity.Bouncer.ReachedTop");
    enrichOlgaClassroom(lvl, quest);
    enrichYourClassroom(lvl);
    enrichBouncer(lvl, quest);
}

function enrichOlgaClassroom(
    lvl: LvlType.OhioUniversityInterior,
    classroomUnlockedQuest: RpgQuest<"OhioUniversity.Bouncer.ReachedTop">,
) {
    const mishaBirthdayQuest = Rpg.quest("MishaHouse.Birthday");
    const studentObjs = [
        lvl.OlgaStudentNpc0,
        lvl.OlgaStudentNpc1,
        lvl.OlgaStudentNpc2,
        lvl.OlgaStudentNpc3,
    ];
    const factId: DataFact.Id = "PerfectHotDog";

    lvl.OlgaNpc
        .mixin(mxnRpgStatus, { hurtboxes: [], status: RpgEnemyRank.create({}).status })
        .mixin(mxnCutscene, function* () {
            const response = yield* ask(
                `Hello, ${Rpg.character.attributes.names.current}.`,
                "Teach me something",
                classroomUnlockedQuest.isCompletable ? "I want to teach" : null,
                mishaBirthdayQuest.flags.spokeWithAidar ? "About Misha's age" : null,
                "Bye, Olga!",
            );

            if (response === 0) {
                if (Rpg.character.facts.memorized.has(factId)) {
                    yield* show("But you have already taken my class :-)");
                }
                else {
                    yield* DramaPotions.useOnTarget("AnnoyIguanas", lvl.OlgaNpc);
                    yield* show("Class, please pay attention.");
                    yield* DramaClassroom.teachToPlayerAndStudentObjs(factId, studentObjs);
                }
            }
            else if (response === 1) {
                yield* show(
                    "I'm sure you would make a great teacher!",
                    "We are always looking for new instructors.",
                    "However, the classroom door is locked.",
                    "Someone went into the vents to try and unlock it...",
                    "Maybe there is a way to encourage them to unlock it sooner?",
                );
            }
            else if (response === 2) {
                mishaBirthdayQuest.flags.learnedMishasAge ??= Rng.intc(56, 95);

                yield* show(
                    "Misha's age?",
                    `He is turning ${mishaBirthdayQuest.flags.learnedMishasAge} today!`,
                );
            }
            else {
                yield* show(`Good-bye, ${Rpg.character.attributes.names.current}!`);
            }
        });
}

function enrichBouncer(
    lvl: LvlType.OhioUniversityInterior,
    classroomUnlockedQuest: RpgQuest<"OhioUniversity.Bouncer.ReachedTop">,
) {
    if (classroomUnlockedQuest.flags.y) {
        lvl.BouncerNpc.y = classroomUnlockedQuest.flags.y;
    }

    lvl.BouncerNpc
        .step(self => classroomUnlockedQuest.flags.y = self.y)
        .coro(function* (self) {
            yield () => classroomUnlockedQuest.isCompletable && self.y <= lvl.FinalBouncerPipe.y + 4 && self.isOnGround;
            Cutscene.play(
                function* () {
                    yield* show("There's a button here.");
                    yield* show("CLICK!!!");
                    yield* DramaQuests.complete(classroomUnlockedQuest);
                },
                {
                    camera: { start: "pan_to_speaker", end: "pan_to_player" },
                    speaker: self,
                },
            );
        });

    lvl.YourClassroomDoor
        .mixin(mxnDoorAutoUnlock, () => classroomUnlockedQuest.isCompletable);
}

function enrichYourClassroom(lvl: LvlType.OhioUniversityInterior) {
    const studentObjs = [
        lvl.YourStudent0,
        lvl.YourStudent1,
        lvl.YourStudent2,
        lvl.YourStudent3,
    ];

    lvl.YourChalkboard
        .mixin(mxnCutscene, function* () {
            yield* DramaClassroom.teach("college_ohio0", studentObjs);
        });
}
