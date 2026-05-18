import * as z from "zod";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zFastHealingSource = zRuleElementSource.extend({
    key: z.literal("FastHealing"),
    value: zRuleValue.optional(),
    type: z.literal(["fast-healing", "regeneration"]).optional(),
    details: z.string().optional(),
    deactivatedBy: z.array(z.string()).optional()
});

export type zFastHealingSource = z.infer<typeof zFastHealingSource>;
