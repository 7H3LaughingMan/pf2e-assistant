import * as z from "zod";
import { zRawPredicate } from "../system/predication.ts";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zBatchSize = z.strictObject({
    default: z.boolean().optional(),
    other: z
        .array(
            z.strictObject({
                quantity: z.number(),
                definition: zRawPredicate
            })
        )
        .optional()
});

export type zBatchSize = z.infer<typeof zBatchSize>;

export const zPreparedFormula = z.strictObject({
    uuid: z.string(),
    quantity: z.number(),
    expended: z.boolean(),
    isSignatureItems: z.boolean()
});

export type zPreparedFormula = z.infer<typeof zPreparedFormula>;

export const zCraftingAbilitySource = zRuleElementSource.extend({
    key: z.literal("CraftingAbility"),
    resource: z.string().optional(),
    isAlchemical: z.boolean().optional(),
    isDailyPrep: z.boolean().optional(),
    isPrepared: z.boolean().optional(),
    batchSizes: zBatchSize.optional(),
    maxItemLevel: zRuleValue.optional(),
    maxSlots: zRuleValue.optional(),
    craftableItems: zRawPredicate.optional(),
    prepared: z.array(zPreparedFormula).optional()
});

export type zCraftingAbilitySource = z.infer<typeof zCraftingAbilitySource>;
