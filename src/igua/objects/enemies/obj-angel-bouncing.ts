// const clownTxs = subimageTextures(CommonClown, 2);

import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { nlerp } from "../../../lib/math/number";
import { container } from "../../../lib/pixi/container";
import { PhysicsFaction, mxnPhysics } from "../../mixins/mxn-physics";
import { vnew } from "../../../lib/math/vector-type";
import { playerObj } from "../obj-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { RpgPlayer } from "../../rpg/rpg-player";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { mxnSpatialAudio } from "../../mixins/mxn-spatial-audio";
import { Sfx } from "../../../assets/sounds";

const clownTxs = Tx.Enemy.CommonClown.split({ count: 2 });

const atkSpikeBall = RpgAttack.create({
    physical: 10,
});

const rnkAngelBouncing = RpgEnemyRank.create({
    status: {
        healthMax: 30,
    },
    loot: {
        valuables: {
            max: 7,
            min: 2,
            deltaPride: -3,
        },
    },
});

export function objAngelBouncing() {
    // const obj = merge(new Container(), { hspeed, vspeed: 0, portal, dangerous, bounceAgainstWall, limitedRangeEnabled });
    // container.ext.isHatParent = true;
    const mask = new Graphics().beginFill(0x000000).drawRect(0, 0, 18, 15).at(-9, -16).invisible();
    // const hatSprite = hat(Sprite.from(clownTxs[0]), 0.8);
    const hatSprite = Sprite.from(clownTxs[0]);
    const sprite = Sprite.from(clownTxs[1]);
    const spikeBall = Sprite.from(Tx.Enemy.SpikeBall);
    spikeBall.anchor.set(6 / 14, 3 / 14);
    const graphics = new Graphics();
    sprite.anchor.set(.5, 1).copyTo(hatSprite.anchor);

    let unit = 0;
    let distanceTraveled = 0;
    let invulnerable = -1;
    let knockbackSpeed = 0;

    // const health = clownHealth(50);
    // const drop = clownDrop(0.67, 0.4, 0.1);

    let appliedOpaqueTint = false;
    const obj = container(graphics, spikeBall, hatSprite, sprite, mask)
        .mixin(mxnEnemy, { hurtboxes: [mask], class: rnkAngelBouncing })
        .mixin(mxnPhysics, {
            gravity: 0.25,
            physicsRadius: 8,
            physicsFaction: PhysicsFaction.Enemy,
            physicsOffset: vnew(),
            onMove(event) {
                // TODO in igua 1, some wouldn't bounce
                if (event.hitWall) {
                    obj.speed.x = -event.previousSpeed.x; // TODO might be nice to get the normal
                }
                if (event.hitGround && !event.previousOnGround) {
                    obj.play(Sfx.Impact.BouncingEnemyLand);
                    obj.speed.y = -6;

                    // TODO play sound if on screen

                    // TODO speed change near death

                    // obj.vspeed = health.nearDeath ? -9 : -6;

                    // TODO can also flip horizontally if "leashed"

                    // if (!obj.limitedRangeEnabled)
                    //     return;
                    // if ((distanceTraveled > 128 && obj.hspeed > 0) || (distanceTraveled <= 0 && obj.hspeed < 0))
                    //     obj.hspeed *= -1;
                }
            },
        })
        .mixin(mxnSpatialAudio)
        .step(() => {
            // if (obj.portal && !appliedOpaqueTint) {
            //     obj.opaqueTint = 0x20A090;
            //     appliedOpaqueTint = true;
            // }
            // else if (!obj.portal && appliedOpaqueTint) {
            //     obj.filters = [];
            //     appliedOpaqueTint = false;
            // }

            const xPrevious = obj.x;
            unit = nlerp(unit, obj.speed.y < 0 ? 1 : 0, 0.0875);
            // TODO gravity change at near death
            // obj.vspeed += health.nearDeath ? 0.5 : 0.25;

            const radians = Math.PI * unit * 2;
            const scale = 0.5 + unit * 2;
            const invertedScale = Math.max(0.95 - unit, 0);
            graphics.clear();
            graphics.lineStyle(1, 0x888888);

            const knockbackOffset = obj.scale.x * knockbackSpeed * 2;
            for (let i = 0; i < 1; i += 0.05) {
                graphics.lineTo(
                    Math.sin(i * Math.PI * 2.25 * 2 + radians) * 6 * Math.min(1, i * 2) * invertedScale
                        - Math.pow(i, 2) * scale - i * knockbackOffset,
                    i * 10 * scale,
                );
            }

            spikeBall.x = graphics.currentPath.points[graphics.currentPath.points.length - 2];
            spikeBall.y = graphics.currentPath.points[graphics.currentPath.points.length - 1];

            // TODO knockbackspeeed
            // obj.x += knockbackSpeed;
            // knockbackSpeed = lerp(knockbackSpeed, 0, 0.1);

            // Absolutely no clue what this is
            // if (obj.speed.y > -5 && obj.speed.y < 5)
            //     obj.x += obj.hspeed * (health.nearDeath ? 2 : 1);

            distanceTraveled += obj.x - xPrevious;

            if (obj.speed.x !== 0) {
                obj.scale.x = Math.sign(obj.speed.x);
            }
            spikeBall.scale.x = Math.sign(obj.scale.x);

            const spring = 10 * scale + 4;
            // TODO not sure if radius needs to change with motion, seems weird
            // const radius = Math.max(8, obj.speed.y);

            obj.physicsOffset.y = spring - obj.physicsRadius;

            // TODO subsystem for damage, knockback
            // if (player.collides(mask) && isPlayerMoving() && obj.dangerous) {
            //     if (invulnerable <= 0 || (invulnerable <= 15 && player.vspeed > 1)) {
            //         player.engine.knockback.x = (player.x - obj.x) / 8;
            //         if (Math.abs(player.engine.knockback.x) < 3) {
            //             bouncePlayer(obj, 2);
            //             obj.vspeed = -player.vspeed;
            //         }
            //         knockbackSpeed = -player.engine.knockback.x;
            //         if (health.damage())
            //             return dieClown(obj, drop(obj.vsPlayerHitCount));
            //         ClownHurt.play();
            //         invulnerable = 30;
            //     }
            // }

            // if (obj.vspeed < 0 && player.collides(mask))
            //     player.y += obj.vspeed;

            // if (invulnerable-- > 0) {
            //     obj.visible = !obj.visible;
            //     return;
            // }

            // obj.visible = true;
            // if (obj.dangerous && player.collides(spikeBall) && obj.damagePlayer(20))
            //     player.engine.knockback.x = obj.hspeed * 4;

            // if (obj.portal && playerIsWeakToPortalFluid() && (player.collides(spikeBall) || player.collides(mask))) {
            //     teleportToTheRoomOfDoors();
        })
        .step(self => {
            if (playerObj.collides(spikeBall)) {
                self.strikePlayer(atkSpikeBall);
            }
        }, 1001);

    obj.speed.x = 0.75;

    return obj;
}
