import * as z from "zod";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zCritSpecSource = zRuleElementSource.extend({
    key: z.literal("CriticalSpecialization"),
    alternate: z.boolean().optional(),
    text: z.string().optional(),
    damageDice: z
        .strictObject({
            number: zRuleValue.optional(),
            faces: z.number().optional(),
            damageType: z.string().optional(),
            category: z.string().optional()
        })
        .optional(),
    modifier: z
        .strictObject({
            type: z.string().optional(),
            damageType: z.string().optional(),
            category: z.string().optional()
        })
        .optional()
});

export type zCritSpecSource = z.infer<typeof zCritSpecSource>;
