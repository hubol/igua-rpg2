export namespace RpgStatus {
    const Consts = {
        FullyPoisonedHealth: 5,
    }
    
    export interface Model {
        health: number;
        maxHealth: number;
        invulnerable: number;
        poison: {
            level: number;
            value: number;
            max: number;
        }
    }
    
    export enum DamageKind {
        Physical,
        Poison,
        Emotional,
    }
    
    export interface Effects {
        healed(value: number, delta: number): void;
        tookDamage(value: number, delta: number, kind: DamageKind): void;
    }
    
    export const Methods = {
        tick(model: Model, effects: Effects, count: number) {
            if (count % 120 === 0 && model.health > Consts.FullyPoisonedHealth && model.poison.level > 0) {
                const previous = model.health;
                model.health = Math.max(Consts.FullyPoisonedHealth, model.health - model.poison.level);
                const diff = previous - model.health;

                effects.tookDamage(model.health, diff, DamageKind.Poison);
            }
            if (count % 15 === 0) {
                model.poison.value = Math.max(0, model.poison.value - 1);
            }
            model.invulnerable = Math.max(0, model.invulnerable - 1);
        },
    
        damage(model: Model, effects: Effects, amount: number, kind = DamageKind.Physical) {
            // TODO should resistances to damage be factored here?
            // Or should that be computed in a previous step?

            // TODO warn when amount is not an integer

            if (model.invulnerable > 0)
                return;
    
            // TODO
            // Emotional damage should not kill enemies
            // But can kill player
    
            const previous = model.health;
            model.health = Math.max(0, model.health - amount);
            const diff = previous - model.health;
    
            effects.tookDamage(model.health, diff, kind);
    
            // TODO
            // Amount of invulnerability might be different
            // from player to enemies
            model.invulnerable = 60;
        },
    
        heal(model: Model, effects: Effects, amount: number) {
            // TODO warn when amount is not an integer

            const previous = model.health;
            model.health = Math.min(model.maxHealth, model.health + amount);
            const diff = model.health - previous;
    
            effects.healed(model.health, diff);
        },
    
        poison(model: Model, effects: Effects, amount: number) {
            // TODO warn when amount is not an integer

            model.poison.value += amount;
            if (model.poison.value >= model.poison.max) {
                model.poison.value = 0;
                model.poison.level += 1;
            }
        }
    }
}
