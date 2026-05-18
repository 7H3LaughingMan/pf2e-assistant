import * as z from "zod";
import { zRuleElementSource } from "./base.ts";

export const zRollTwiceSource = zRuleElementSource.extend({
    key: z.literal("RollTwice"),
    selector: z.array(z.string()).optional(),
    keep: z.literal(["lower", "higher"]).optional(),
    removeAfterRoll: z.boolean().optional()
});

export type zRollTwiceSource = z.infer<typeof zRollTwiceSource>;
