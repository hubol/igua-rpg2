import { Graphics } from "pixi.js";
import { OgmoEntities, OgmoEntityResolverBase } from "../../assets/generated/levels/generated-ogmo-project-data";
import { Instances } from "../../lib/game-engine/instances";
import { Vector, vnew } from "../../lib/math/vector-type";
import { objEnvironmentFxSparkle } from "../objects/effects/environment/obj-environment-fx-sparkle";
import { objAngelSuggestive } from "../objects/enemies/obj-angel-suggestive";
import { objStashPocket } from "../objects/interactables/obj-stash-pocket";
import { objPuddle } from "../objects/nature/obj-puddle";
import { objCheckpoint } from "../objects/obj-checkpoint";
import { objDoor } from "../objects/obj-door";
import { objGate } from "../objects/obj-gate";
import { objIdol } from "../objects/obj-idol";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
import { objIntelligenceBackground } from "../objects/obj-intelligence-background";
import { createPlayerObj, playerObj } from "../objects/obj-player";
import { objPocketableItemSpawner } from "../objects/obj-pocketable-item-spawner";
import { objSign } from "../objects/obj-sign";
import { objPipe, objPipeSlope, objSolidBlock, objSolidSlope } from "../objects/obj-terrain";
import { objValuable } from "../objects/obj-valuable";
import { objWaterDripSource } from "../objects/obj-water-drip-source";
import { objWorldMapGate } from "../objects/obj-world-map-gate";
import { objMarker } from "../objects/utils/obj-marker";
import { Rpg } from "../rpg/rpg";

export const OgmoEntityResolvers = {
    "Player": (entity) => createOrConfigurePlayerObj(entity),
    "Checkpoint": (entity) => createOrConfigurePlayerObj(entity, entity.values.name),
    "Block": objSolidBlock,
    "Slope": objSolidSlope,
    "Pipe": objPipe,
    "PipeSlope": objPipeSlope,
    "Door": ({ values: { checkpointName, sceneName } }) => objDoor({ checkpointName, sceneName }).at(0, 2),
    "WaterDripSource": ({ values: { delayMin, delayMax } }) => objWaterDripSource({ delayMin, delayMax }),
    "Sign": ({ values }) => objSign(values),
    "IntelligenceBackground": ({ values }) => objIntelligenceBackground(values),
    "IguanaNpc": (entity) => {
        const obj = objIguanaNpc(entity.values.personaName as any);
        obj.y = 3;
        obj.facing = entity.flippedX ? -1 : 1;
        if (entity.flippedX) {
            obj.x = 1;
        }
        delete entity.flippedX;
        return obj;
    },
    "ValuableGreen": ({ uid }) => objValuable("green", uid),
    "ValuableOrange": ({ uid }) => objValuable("orange", uid),
    "ValuableBlue": ({ uid }) => objValuable("blue", uid),
    "Puddle": (entity) => {
        const obj = objPuddle(entity.width!, entity.tint);
        delete entity.width;
        return obj;
    },
    "Marker": objMarker,
    "Region": () => new Graphics().beginFill(0x00ff00).drawRect(0, 0, 1, 1).invisible(),
    "GateHorizontal": (entity) => objGate(entity, "horizontal"),
    "GateVertical": (entity) => objGate(entity, "vertical"),
    // TODO somehow configure item to spawn
    "PocketableItemA": (entity) => objPocketableItemSpawner(vnew(entity), "BallFruitTypeA").at(entity, -1),
    "PocketableItemB": (entity) => objPocketableItemSpawner(vnew(entity), "BallFruitTypeB").at(entity, -1),
    EnemySuggestive: (entity) => objAngelSuggestive(entity.values.variant).at(0, -38),
    EnvironmentSparkleMarker: objEnvironmentFxSparkle,
    Idol: objIdol,
    GateMap: objWorldMapGate,
    StashPocket: objStashPocket,
} satisfies OgmoEntityResolverBase;

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

    return pos;
}
