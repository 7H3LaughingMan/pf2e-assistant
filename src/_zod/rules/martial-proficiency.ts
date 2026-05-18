import * as z from "zod";
import { zRawPredicate } from "../system/predication.ts";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zMartialProficiencSource = zRuleElementSource.extend({
    key: z.literal("MartialProficiency"),
    kind: z.literal(["attack", "defense"]).optional(),
    definition: zRawPredicate.optional(),
    sameAs: z.string().optional(),
    maxRank: z.literal(["trained", "expert", "master", "legendary"]).optional(),
    value: zRuleValue.optional(),
    visible: z.boolean().optional()
});

export type zMartialProficiencSource = z.infer<typeof zMartialProficiencSource>;
