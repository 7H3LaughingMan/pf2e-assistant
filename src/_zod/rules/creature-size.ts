import * as z from "zod";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zCreatureSizeSource = zRuleElementSource.extend({
    key: z.literal("CreatureSize"),
    value: zRuleValue.optional(),
    reach: z.partialRecord(z.literal(["add", "upgrade", "override"]), zRuleValue).optional(),
    resizeEquipment: z.boolean().optional(),
    minimuSize: z.string().optional(),
    maximumSize: z.string().optional()
});

export type zCreatureSizeSource = z.infer<typeof zCreatureSizeSource>;
