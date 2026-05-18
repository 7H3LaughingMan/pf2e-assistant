import * as z from "zod";
import { zRawPredicate } from "../system/predication.ts";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zIWRException = z.union([
    z.string(),
    z.strictObject({
        definition: zRawPredicate.optional(),
        label: z.string().optional()
    })
]);

export type zIWRException = z.infer<typeof zIWRException>;

export const zIWRSource = zRuleElementSource.extend({
    mode: z.literal(["add", "remove"]).optional(),
    type: z.array(z.string()).optional(),
    definition: zRawPredicate.optional(),
    exceptions: z.array(zIWRException).optional(),
    override: z.boolean().optional()
});

export type zIWRSource = z.infer<typeof zIWRSource>;

export const zImmunitySource = zIWRSource.extend({
    key: z.literal("Immunity"),
    exceptions: z.array(zIWRException).optional()
});

export type zImmunitySource = z.infer<typeof zImmunitySource>;

export const zResistanceSource = zIWRSource.extend({
    key: z.literal("Resistance"),
    value: zRuleValue.optional(),
    exceptions: z.array(zIWRException).optional(),
    doubleVs: z.array(zIWRException).optional()
});

export type zResistanceSource = z.infer<typeof zResistanceSource>;

export const zWeaknessSource = zIWRSource.extend({
    key: z.literal("Weakness"),
    value: zRuleValue.optional(),
    exceptions: z.array(zIWRException).optional(),
    applyOnce: z.boolean().optional()
});

export type zWeaknessSource = z.infer<typeof zWeaknessSource>;
