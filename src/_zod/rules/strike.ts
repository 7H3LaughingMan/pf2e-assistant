import * as z from "zod";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zStrikeSource = zRuleElementSource.extend({
    key: z.literal("Strike"),
    category: z.string().optional(),
    group: z.string().optional(),
    baseType: z.string().optional(),
    traits: z.array(z.string()).optional(),
    traitToggles: z
        .strictObject({
            modular: z.number().optional(),
            versatile: z.string().optional()
        })
        .optional(),
    otherTags: z.array(z.string()).optional(),
    range: z
        .strictObject({
            increment: z.number().optional(),
            max: z.number().optional()
        })
        .optional(),
    damage: z
        .strictObject({
            base: z
                .strictObject({
                    damageType: z.string().optional(),
                    dice: zRuleValue.optional(),
                    die: z.string().optional(),
                    modifier: z.number().optional()
                })
                .optional()
        })
        .optional(),
    img: z.string().optional(),
    attackModifier: z.number().optional(),
    replaceAll: z.boolean().optional(),
    replaceBasicUnarmed: z.boolean().optional(),
    battleForm: z.boolean().optional(),
    ability: z.string().optional(),
    options: z.array(z.string()).optional(),
    fist: z.boolean().optional(),
    graspingAppendage: z.boolean().optional()
});

export type zStrikeSource = z.infer<typeof zStrikeSource>;
