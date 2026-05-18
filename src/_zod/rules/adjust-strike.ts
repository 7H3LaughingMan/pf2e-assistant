import * as z from "zod";
import { zRawPredicate } from "../system/predication.ts";
import { zAELikeChangeMode } from "./ae-like.ts";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zAdjustStrikeSource = zRuleElementSource.extend({
    key: z.literal("AdjustStrike"),
    mode: zAELikeChangeMode.optional(),
    property: z.literal(["materials", "property-runes", "range-increment", "traits", "weapon-traits"]).optional(),
    definition: zRawPredicate.optional(),
    value: zRuleValue.optional()
});

export type zAdjustStrikeSource = z.infer<typeof zAdjustStrikeSource>;
