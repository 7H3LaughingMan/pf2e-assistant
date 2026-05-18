import * as z from "zod";
import { zAELikeChangeMode } from "./ae-like.ts";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zDamageAlterationProperty = z.literal(["dice-faces", "dice-number", "damage-type", "tags"]);

export type zDamageAlterationProperty = z.infer<typeof zDamageAlterationProperty>;

export const zDamageAlterationSource = zRuleElementSource.extend({
    key: z.literal("DamageAlteration"),
    selectors: z.array(z.string()).optional(),
    mode: zAELikeChangeMode.optional(),
    property: zDamageAlterationProperty.optional(),
    value: zRuleValue.optional(),
    relabel: z.string().optional()
});

export type zDamageAlterationSource = z.infer<typeof zDamageAlterationSource>;
