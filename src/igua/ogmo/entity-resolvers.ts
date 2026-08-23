import { Graphics } from "pixi.js";
import { OgmoEntities, OgmoEntityResolverBase } from "../../assets/generated/levels/generated-ogmo-project-data";
import { Instances } from "../../lib/game-engine/instances";
import { Vector, vnew } from "../../lib/math/vector-type";
import { mxnDoorMagic } from "../mixins/mxn-door-magic";
import { objCharacterGamblingExpert } from "../objects/characters/obj-character-gambling-expert";
import { CtxPocketItems, objCollectiblePocketItemSpawner } from "../objects/collectibles/obj-collectible-pocket-item-spawner";
import { objDevPlayer } from "../objects/dev/obj-dev-player";
import { objEnvironmentFxSparkle } from "../objects/effects/environment/obj-environment-fx-sparkle";
import { objEnvironmentOverheatRegion } from "../objects/effects/environment/obj-environment-overheat-region";
import { objAngelBallon } from "../objects/enemies/obj-angel-ballon";
import { objAngelBrick } from "../objects/enemies/obj-angel-brick";
import { objAngelCactus } from "../objects/enemies/obj-angel-cactus";
import { objAngelChill } from "../objects/enemies/obj-angel-chill";
import { objAngelMiffed } from "../objects/enemies/obj-angel-miffed";
import { objAngelSkeliguana } from "../objects/enemies/obj-angel-skeliguana";
import { objAngelSnail } from "../objects/enemies/obj-angel-snail";
import { objAngelSpikeBall } from "../objects/enemies/obj-angel-spike-ball";
import { objAngelSuggestive } from "../objects/enemies/obj-angel-suggestive";
import { objEsotericBinocularViewer } from "../objects/esoteric/obj-esoteric-binocular-viewer";
import { objEsotericClock } from "../objects/esoteric/obj-esoteric-clock";
import { objEsotericDial } from "../objects/esoteric/obj-esoteric-dial";
import { objEsotericOutOfOrderSign } from "../objects/esoteric/obj-esoteric-out-of-order-sign";
import { objStashPocket } from "../objects/interactables/obj-stash-pocket";
import { objDarkness } from "../objects/nature/obj-darkness";
import { objPuddle } from "../objects/nature/obj-puddle";
import { objCheckpoint } from "../objects/obj-checkpoint";
import { objDoor } from "../objects/obj-door";
import { objGate } from "../objects/obj-gate";
import { objIdol } from "../objects/obj-idol";
import { ObjIguanaLocomotive } from "../objects/obj-iguana-locomotive";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
import { objIguanaNpcPatrolMarker } from "../objects/obj-iguana-npc-patrol-marker";
import { objIntelligenceBackground } from "../objects/obj-intelligence-background";
import { objIntelligenceSign } from "../objects/obj-intelligence-sign";
import { createPlayerObj, playerObj } from "../objects/obj-player";
import { objSafeMarker } from "../objects/obj-safe-marker";
import { objSign } from "../objects/obj-sign";
import { objPipe, objPipeSlope, objSolidBlock, objSolidSlope } from "../objects/obj-terrain";
import { objValuable } from "../objects/obj-valuable";
import { objWaterDripSource } from "../objects/obj-water-drip-source";
import { objWeightedPedestal } from "../objects/obj-weighted-pedestal";
import { objWorldMapGate } from "../objects/obj-world-map-gate";
import { objMarker } from "../objects/utils/obj-marker";
import { objRegion } from "../objects/utils/obj-region";
import { Rpg } from "../rpg/rpg";

export const OgmoEntityResolvers = {
    "Player": (entity: OgmoEntities.Player) => createOrConfigurePlayerObj(entity),
    "Checkpoint": (entity: OgmoEntities.Checkpoint) => createOrConfigurePlayerObj(entity, entity.values.name),
    "Block": objSolidBlock,
    "Slope": objSolidSlope,
    "Pipe": objPipe,
    "PipeSlope": objPipeSlope,
    "Door": ({ values: { checkpointName, sceneName } }: OgmoEntities.Door) =>
        objDoor({ checkpointName, sceneName }).at(0, 2),
    "WaterDripSource": ({ values: { delayMin, delayMax } }: OgmoEntities.WaterDripSource) =>
        objWaterDripSource({ delayMin, delayMax }),
    "Sign": ({ values }: OgmoEntities.Sign) => objSign(values),
    "IntelligenceBackground": ({ values }: OgmoEntities.IntelligenceBackground) => objIntelligenceBackground(values),
    "IguanaNpc": (entity: OgmoEntities.IguanaNpc) => {
        const obj = objIguanaNpc(entity.values.personaName as any);
        applyEntityToIguanaObj(obj, entity);
        return obj;
    },
    "GamblingExpertNpc": (entity: OgmoEntities.GamblingExpertNpc) => {
        const obj = objCharacterGamblingExpert();
        applyEntityToIguanaObj(obj, entity);
        return obj;
    },
    "ValuableGreen": ({ uid }: OgmoEntities.ValuableGreen) => objValuable("green", uid),
    "ValuableOrange": ({ uid }: OgmoEntities.ValuableOrange) => objValuable("orange", uid),
    "ValuableBlue": ({ uid }: OgmoEntities.ValuableBlue) => objValuable("blue", uid),
    "Puddle": (entity: OgmoEntities.Puddle) => {
        const obj = objPuddle(entity.width!, entity.tint);
        delete entity.width;
        return obj;
    },
    "Marker": objMarker,
    "Region": objRegion,
    "GateHorizontal": (entity: OgmoEntities.GateHorizontal) => objGate(entity, "horizontal"),
    "GateVertical": (entity: OgmoEntities.GateVertical) => objGate(entity, "vertical"),
    "PocketableItemA": (entity: OgmoEntities.PocketableItemA) =>
        objCollectiblePocketItemSpawner(
            vnew(entity),
            CtxPocketItems.value.pocketItemIds.typeA,
            CtxPocketItems.value.variant,
            CtxPocketItems.value.behavior,
        ).at(entity, -1),
    "PocketableItemB": (entity: OgmoEntities.PocketableItemA) =>
        objCollectiblePocketItemSpawner(
            vnew(entity),
            CtxPocketItems.value.pocketItemIds.typeB,
            CtxPocketItems.value.variant,
            CtxPocketItems.value.behavior,
        ).at(entity, -1),
    EnemyBallon: objAngelBallon,
    EnemyBrick: (entity: OgmoEntities.EnemyBrick) => {
        const brickAngelObj = objAngelBrick(entity);
        delete entity.width;
        delete entity.height;
        return brickAngelObj;
    },
    EnemyCactus: (entity: OgmoEntities.EnemyCactus) => objAngelCactus(entity).at(1, 3),
    EnemyChill: objAngelChill,
    EnemySkeliguana: (entity: OgmoEntities.EnemySkeliguana) => {
        const obj = objAngelSkeliguana(entity.values.variant);
        applyEntityToIguanaObj(obj, entity);
        return obj;
    },
    EnemySnail: () => objAngelSnail(),
    EnemySpikeBall: objAngelSpikeBall,
    EnemySuggestive: (entity: OgmoEntities.EnemySuggestive) => objAngelSuggestive(entity).at(0, -38),
    EnemyMiffed: (entity: OgmoEntities.EnemyMiffed) => objAngelMiffed(entity.values.variant).at(0, 1),
    EnvironmentSparkleMarker: objEnvironmentFxSparkle,
    Idol: objIdol,
    GateMap: objWorldMapGate,
    StashPocket: objStashPocket,
    PlayerDev: objDevPlayer,
    WeightedPedestal: objWeightedPedestal,
    IntelligenceSign: (entity: OgmoEntities.IntelligenceSign) => objIntelligenceSign(entity.values),
    MagicDoor: (entity: OgmoEntities.MagicDoor) => objDoor(entity.values).mixin(mxnDoorMagic, entity.uid).at(0, 2),
    Darkness: objDarkness,
    OverheatRegion: objEnvironmentOverheatRegion,
    SafeMarker: objSafeMarker,
    Clock: (entity: OgmoEntities.Clock) =>
        objEsotericClock({ time: { hours: entity.values.hours, minutes: entity.values.minutes } }),
    Dial: (entity: OgmoEntities.Dial) => objEsotericDial({ maxTicks: entity.values.maxTicks }),
    BinocularViewer: objEsotericBinocularViewer,
    IguanaNpcPatrolMarker: objIguanaNpcPatrolMarker,
    OutOfOrderSign: objEsotericOutOfOrderSign,
};

const __checkedOgmoEntityResolvers = OgmoEntityResolvers satisfies OgmoEntityResolverBase;

function applyEntityToIguanaObj(obj: ObjIguanaLocomotive, entity: OgmoEntities.GamblingExpertNpc) {
    obj.y = 3;
    obj.facing = entity.flippedX ? -1 : 1;
    if (entity.flippedX) {
        obj.x = 1;
    }
    delete entity.flippedX;
}

function createOrConfigurePlayerObj(
    entity: OgmoEntities.Checkpoint | OgmoEntities.Player,
    checkpointName?: string,
): Vector {
    const pos = vnew(entity).add(entity.flippedX ? 3 : -2, 3);
    const facing = entity.flippedX ? -1 : 1;

    const mustCreatePlayer = !playerObj || playerObj.destroyed;

    if (mustCreatePlayer) {
        createPlayerObj().show();
    }

    if (checkpointName) {
        const checkpointFacing = (entity as OgmoEntities.Checkpoint).values.overrideFlipX === "retainFromPreviousScene"
            ? Rpg.character.position.facing
            : facing;
        objCheckpoint(checkpointName, checkpointFacing).at(pos).show();
    }

    const checkpointObj = Instances(objCheckpoint).find(x =>
        x.checkpointName === Rpg.character.position.checkpointName
    );

    if (checkpointObj || !checkpointName || mustCreatePlayer) {
        playerObj.at(checkpointObj ? checkpointObj : pos);
        playerObj.facing = checkpointObj ? checkpointObj.facing : facing;
    }

    if (checkpointObj) {
        playerObj.objPlayer.startedRoomAtCheckpointName = checkpointObj.checkpointName;
    }

    return pos;
}
