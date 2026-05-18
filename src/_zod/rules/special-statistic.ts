import * as z from "zod";
import { zRawPredicate } from "../system/predication.ts";
import { zRuleElementSource } from "./base.ts";

export const zSpecialStatisticSource = zRuleElementSource.extend({
    key: z.literal("SpecialStatistic"),
    slug: z.string().optional(),
    type: z.literal(["simple", "check", "attack-roll"]).optional(),
    extends: z.string().optional(),
    attribute: z.string().optional(),
    baseModifier: z
        .strictObject({
            mod: z.number().optional(),
            check: z.number().optional(),
            dc: z.number().optional()
        })
        .optional(),
    itemCast: z
        .strictObject({
            predicate: zRawPredicate.optional(),
            tradition: z.string().optional()
        })
        .optional()
});

export type zSpecialStatisticSource = z.infer<typeof zSpecialStatisticSource>;
