import { CheckRoll, CheckRollDataPF2e, DamageRoll, DamageRollData } from "foundry-pf2e";
import { Rolled } from "foundry-pf2e/foundry/client/dice/roll.mjs";

let _CheckRoll: typeof CheckRoll;
let _DamageRoll: typeof DamageRoll;

export function getCheckRoll(): typeof CheckRoll {
    return (_CheckRoll ??= CONFIG.Dice.rolls.find((roll) => roll.name === "CheckRoll") as typeof CheckRoll);
}

export function isCheckRoll(roll: Maybe<Roll>): roll is Rolled<CheckRoll> {
    if (!roll) return false;
    return roll.constructor.name === "CheckRoll";
}

export function newCheckRoll(formula: string, data?: Record<string, unknown>, options?: CheckRollDataPF2e): CheckRoll {
    const CheckRoll = getCheckRoll();
    return new CheckRoll(formula, data, options);
}

export function getDamageRoll(): typeof DamageRoll {
    return (_DamageRoll ??= CONFIG.Dice.rolls.find((roll) => roll.name === "DamageRoll") as typeof DamageRoll);
}

export function isDamageRoll(roll: Maybe<Roll>): roll is Rolled<DamageRoll> {
    if (!roll) return false;
    return roll.constructor.name === "DamageRoll";
}

export function newDamageRoll(formula: string, data?: Record<string, unknown>, options?: DamageRollData): DamageRoll {
    const DamageRoll = getDamageRoll();
    return new DamageRoll(formula, data, options);
}
