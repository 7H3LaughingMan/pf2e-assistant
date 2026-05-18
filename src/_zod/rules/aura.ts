import * as z from "zod";
import { zRawPredicate } from "../system/predication.ts";
import { zRuleElementSource, zRuleValue } from "./base.ts";
import { zItemAlteration } from "./item-alteration.ts";

export const zAuraEffect = z.strictObject({
    uuid: z.string().optional(),
    affects: z.literal(["allies", "enemies", "all"]).optional(),
    events: z.array(z.literal(["enter", "turn-start", "turn-end"])).optional(),
    save: z
        .strictObject({
            type: z.string().optional(),
            dc: zRuleValue.optional()
        })
        .optional(),
    predicate: zRawPredicate.optional(),
    removeOnExit: z.boolean().optional(),
    includesSelf: z.boolean().optional(),
    alterations: z.array(zItemAlteration).optional()
});

export type zAuraEffect = z.infer<typeof zAuraEffect>;

export const zAuraAppearance = z.strictObject({
    border: z
        .strictObject({
            color: z.union([z.literal("user-color"), z.string()]).optional(),
            alpha: z.number().optional()
        })

        .optional(),
    highlight: z
        .strictObject({
            color: z.union([z.literal("user-color"), z.string()]).optional(),
            alpha: z.number().optional()
        })
        .optional(),
    texture: z
        .strictObject({
            src: z.string().optional(),
            alpha: z.number().optional(),
            scale: z.number().optional(),
            translation: z
                .strictObject({
                    x: z.number().optional(),
                    y: z.number().optional()
                })

                .optional(),
            loop: z.boolean().optional(),
            playbackRate: z.number().optional()
        })

        .optional()
});

export type zAuraAppearance = z.infer<typeof zAuraAppearance>;

export const zAuraSource = zRuleElementSource.extend({
    key: z.literal("Aura"),
    radius: zRuleValue.optional(),
    level: zRuleValue.optional(),
    traits: z.array(z.string()).optional(),
    effects: z.array(zAuraEffect).optional(),
    appearance: zAuraAppearance.optional(),
    mergeExisting: z.boolean().optional()
});

export type zAuraSource = z.infer<typeof zAuraSource>;
