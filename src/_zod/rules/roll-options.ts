import * as z from "zod";
import { zRawPredicate } from "../system/predication.ts";
import { zAELikeDataPrepPhase } from "./ae-like.ts";
import { zRuleElementSource } from "./base.ts";

export const zSuboption = z.strictObject({
    label: z.string(),
    value: z.string(),
    predicate: zRawPredicate.optional()
});

export type zSuboption = z.infer<typeof zSuboption>;

export const zRollOptionSource = zRuleElementSource.extend({
    key: z.literal("RollOption"),
    domain: z.string().optional(),
    option: z.string().optional(),
    phase: zAELikeDataPrepPhase.optional(),
    suboptions: z
        .union([z.array(zSuboption), z.strictObject({ config: z.string(), predicate: zRawPredicate.optional() })])
        .optional(),
    mergeable: z.boolean().optional(),
    value: z.union([z.boolean(), z.string()]).optional(),
    selection: z.string().optional(),
    toggleable: z.union([z.literal("totm"), z.boolean()]).optional(),
    placement: z.string().optional(),
    disabledIf: zRawPredicate.optional(),
    disabledValue: z.boolean().optional(),
    alwaysActive: z.boolean().optional(),
    count: z.boolean().optional(),
    removeAfterRoll: z.boolean().optional()
});

export type zRollOptionSource = z.infer<typeof zRollOptionSource>;
