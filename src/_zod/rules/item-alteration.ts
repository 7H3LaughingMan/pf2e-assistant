import * as z from "zod";
import { zAELikeChangeMode } from "./ae-like.ts";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zItemAlterationProperty = z.literal([
    "ac-bonus",
    "area-size",
    "badge-max",
    "badge-value",
    "bulk",
    "category",
    "check-penalty",
    "damage-dice-faces",
    "damage-dice-number",
    "damage-type",
    "defense-passive",
    "description",
    "dex-cap",
    "focus-point-cost",
    "grade",
    "group",
    "hardness",
    "hp-max",
    "material-type",
    "pd-recovery-dc",
    "persistent-damage",
    "rarity",
    "range-increment",
    "range-max",
    "frequency-max",
    "frequency-per",
    "other-tags",
    "name",
    "runes-potency",
    "runes-resilient",
    "runes-striking",
    "speed-penalty",
    "strength",
    "traits"
]);

export type zItemAlterationProperty = z.infer<typeof zItemAlterationProperty>;

export const zItemAlteration = z.strictObject({
    mode: zAELikeChangeMode.optional(),
    property: zItemAlterationProperty.optional(),
    fromEquipment: z.boolean().optional(),
    value: zRuleValue.optional()
});

export type zItemAlteration = z.infer<typeof zItemAlteration>;

export const zItemAlterationSource = zRuleElementSource.extend({
    key: z.literal("ItemAlteration"),
    itemId: z.string().optional(),
    itemType: z.string().optional(),
    battleForm: z.boolean().optional(),
    ...zItemAlteration.shape
});

export type zItemAlterationSource = z.infer<typeof zItemAlterationSource>;
