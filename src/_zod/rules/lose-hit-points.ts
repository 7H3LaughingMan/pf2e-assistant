import * as z from "zod";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zLoseHitPointsSource = zRuleElementSource.extend({
    key: z.literal("LoseHitPoints"),
    value: zRuleValue.optional(),
    reevaluateOnUpdate: z.boolean().optional(),
    recoverable: z.boolean().optional()
});

export type zLoseHitPointsSource = z.infer<typeof zLoseHitPointsSource>;
