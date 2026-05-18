import * as z from "zod";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zBaseSpeed = zRuleElementSource.extend({
    key: z.literal("BaseSpeed"),
    selector: z.string().optional(),
    value: zRuleValue.optional()
});

export type zBaseSpeed = z.infer<typeof zBaseSpeed>;
