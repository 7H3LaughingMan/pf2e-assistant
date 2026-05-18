import { Rolled } from "@7h3laughingman/foundry-types/client/dice/roll.mjs";
import { DamageRoll } from "@7h3laughingman/pf2e-types/module/system/damage/roll.js";
import {
    DamageCategory,
    DamageCategoryUnique,
    DamageDiceFaces,
    DamageDieSize,
    DamageKind,
    DamageType,
    MaterialDamageEffect
} from "@7h3laughingman/pf2e-types/module/system/damage/types.js";
import * as R from "remeda";
import * as z from "zod";

export const zDamageCategoryUnique: z.ZodLiteral<DamageCategoryUnique> = z.literal([
    "persistent",
    "precision",
    "splash"
]);

export const zDamageCategory: z.ZodLazy<z.ZodLiteral<DamageCategory>> = z.lazy(() =>
    z.literal(R.keys(CONFIG.PF2E.damageCategories))
);

export const zDamageDiceFaces: z.ZodLiteral<DamageDiceFaces> = z.literal([4, 6, 8, 10, 12]);

export const zDamageDieSize: z.ZodLiteral<DamageDieSize> = z.literal(["d4", "d6", "d8", "d10", "d12"]);

export const zDamageRoll = z.lazy(() =>
    z.instanceof(CONFIG.Dice.rolls.find((value) => value.name === "DamageRoll") as typeof DamageRoll)
);

export const zRolledDamageRoll = zDamageRoll.refine((arg) => arg._evaluated) as z.ZodLazy<
    z.ZodCustom<Rolled<DamageRoll>, Rolled<DamageRoll>>
>;

export const zDamageType: z.ZodLazy<z.ZodLiteral<DamageType>> = z.lazy(() =>
    z.literal(R.keys(CONFIG.PF2E.damageTypes))
);

export const zDamageKind: z.ZodType<DamageKind> = z.literal(["damage", "healing"]);

export const zMaterialDamageEffect: z.ZodLazy<z.ZodLiteral<MaterialDamageEffect>> = z.lazy(() =>
    z.literal(R.keys(CONFIG.PF2E.materialDamageEffects))
);
