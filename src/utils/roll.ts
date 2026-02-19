import { DiceTermResult } from "@7h3laughingman/foundry-types/client/dice/_types.mjs";
import { Rolled } from "@7h3laughingman/foundry-types/client/dice/roll.mjs";
import {
    BaseDamageData,
    DamageDiceFaces,
    DamageDicePF2e,
    DamageDieSize,
    DamageRoll,
    DamageTemplate,
    DamageType,
    WeaponDamageTemplate
} from "@7h3laughingman/pf2e-types";
import * as R from "remeda";

export function convertDamageDieSize(dieSize: Maybe<DamageDieSize>): Maybe<DamageDiceFaces> {
    if (!dieSize) return undefined;
    switch (dieSize) {
        case "d4":
            return 4;
        case "d6":
            return 6;
        case "d8":
            return 8;
        case "d10":
            return 10;
        case "d12":
            return 12;
    }
}

export function convertDamageDiceFaces(diceFaces: Maybe<DamageDiceFaces>): Maybe<DamageDieSize> {
    if (!diceFaces) return undefined;
    switch (diceFaces) {
        case 4:
            return "d4";
        case 6:
            return "d6";
        case 8:
            return "d8";
        case 10:
            return "d10";
        case 12:
            return "d12";
    }
}

export function isWeaponDamage(damageTemplate: Maybe<DamageTemplate>): damageTemplate is WeaponDamageTemplate {
    if (!damageTemplate) return false;
    return R.prop(damageTemplate, "damage", "base") !== undefined;
}

export interface DamageInstanceMap {
    dieSize: Maybe<DamageDieSize>;
    dieFaces: Maybe<DamageDiceFaces>;
    damageType: Maybe<DamageType>;
    data: { slug: string; diceNumber: number }[];
}

export function isBaseDamageData(data: unknown): data is BaseDamageData {
    if (!R.isPlainObject(data)) return false;
    return R.isIncludedIn(R.prop(data, "damageType"), Object.keys(CONFIG.PF2E.damageTypes));
}

export function isDamageDicePF2e(data: unknown): data is DamageDicePF2e {
    if (!R.isObjectType(data)) return false;
    return data.constructor.name === "DamageDicePF2e";
}

export function generateMap(
    roll: Rolled<DamageRoll>,
    damageData: BaseDamageData | DamageDicePF2e
): Maybe<DamageInstanceMap> {
    if (!isWeaponDamage(roll.options.damage)) return undefined;

    if (isBaseDamageData(damageData)) {
        const map: DamageInstanceMap = {
            dieSize: damageData.dieSize,
            dieFaces: convertDamageDieSize(damageData.dieSize),
            damageType: damageData.damageType,
            data: []
        };

        roll.options.damage.damage.base
            .filter((value) => value.damageType === map.damageType && value.dieSize === map.dieSize)
            .forEach((value) => map.data.push({ slug: "base", diceNumber: value.diceNumber ?? 0 }));

        roll.options.damage.damage.dice
            .filter((value) => value.damageType === map.damageType && value.dieSize === map.dieSize)
            .forEach((value) => map.data.push({ slug: value.slug, diceNumber: value.diceNumber }));

        if (roll.options.critRule === "double-dice" && roll.options.degreeOfSuccess === 3) {
            map.data.forEach((value) => (value.diceNumber *= 2));
        }

        return map;
    }

    if (isDamageDicePF2e(damageData)) {
        const map: DamageInstanceMap = {
            dieSize: damageData.dieSize,
            dieFaces: damageData.faces,
            damageType: damageData.damageType,
            data: []
        };

        roll.options.damage.damage.base
            .filter((value) => value.damageType === map.damageType && value.dieSize === map.dieSize)
            .forEach((value) => map.data.push({ slug: "base", diceNumber: value.diceNumber ?? 0 }));

        roll.options.damage.damage.dice
            .filter((value) => value.damageType === map.damageType && value.dieSize === map.dieSize)
            .forEach((value) => map.data.push({ slug: value.slug, diceNumber: value.diceNumber }));

        if (roll.options.critRule === "double-dice" && roll.options.degreeOfSuccess === 3) {
            map.data.forEach((value) => (value.diceNumber *= 2));
        }

        return map;
    }

    return undefined;
}

export function getRolledDice(roll: Rolled<DamageRoll>, map: DamageInstanceMap, slug: string): DiceTermResult[] {
    const instance = roll.instances.find((value) => value.type === map.damageType && value.persistent === false);

    if (!instance) return [];

    const rolledDice = instance.dice.find((value) => value.faces === map.dieFaces);

    if (!rolledDice) return [];

    const mapIndex = R.findIndex(map.data, (value) => value.slug === slug);
    let startIndex = 0;

    for (let index = 0; index < mapIndex; index++) {
        startIndex += map.data[index].diceNumber;
    }

    const endIndex = startIndex + map.data[mapIndex].diceNumber;

    return rolledDice.results.filter((value) => value.active === true).slice(startIndex, endIndex);
}

export function extractDamage(roll: Rolled<DamageRoll>, slug: string, applyCritical: boolean) {
    if (!isWeaponDamage(roll.options.damage)) return;
    if (!roll.options.critRule) return;

    const isCritical = roll.options.degreeOfSuccess === 3;
    const critRule = roll.options.critRule;
    const dice = roll.options.damage.damage.dice.find((dice) => dice.slug === slug);

    if (dice === undefined) return;

    const map = generateMap(roll, dice);

    if (!map) return;

    const rolledDice = getRolledDice(roll, map, slug);

    let rolledValue =
        isCritical && !applyCritical && critRule === "double-dice"
            ? rolledDice
                  .slice(0, rolledDice.length / 2)
                  .reduce((previousValue, currentValue) => previousValue + currentValue.result, 0)
            : rolledDice.reduce((previousValue, currentValue) => previousValue + currentValue.result, 0);

    if (isCritical && applyCritical && critRule === "double-damage") {
        rolledValue *= 2;
    }

    return `{${rolledValue}[${dice.damageType}]}`;
}

export function extractBaseDamage(roll: Rolled<DamageRoll>, applyCritical: boolean) {
    if (!isWeaponDamage(roll.options.damage)) return;
    if (!roll.options.critRule) return;

    const isCritical = roll.options.degreeOfSuccess === 3;
    const critRule = roll.options.critRule;
    const baseDamageData = roll.options.damage.damage.base.find((value) => value.category === null);

    if (!baseDamageData) return;

    const map = generateMap(roll, baseDamageData);

    if (!map) return;

    const rolledDice = getRolledDice(roll, map, "base");

    let rolledValue =
        isCritical && !applyCritical && critRule === "double-dice"
            ? rolledDice
                  .slice(0, rolledDice.length / 2)
                  .reduce((previousValue, currentValue) => previousValue + currentValue.result, 0)
            : rolledDice.reduce((previousValue, currentValue) => previousValue + currentValue.result, 0);

    if (isCritical && applyCritical && critRule === "double-damage") {
        rolledValue *= 2;
    }

    return `{${rolledValue}[${[baseDamageData.damageType, ...(baseDamageData.materials ?? [])].join(",")}]}`;
}
