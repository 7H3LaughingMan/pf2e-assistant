import * as z from "zod";
import { zFalse } from "../types.ts";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zSpecialResourceSource = zRuleElementSource.extend({
    key: z.literal("SpecialResource"),
    value: z.number().optional(),
    max: zRuleValue.optional(),
    itemUUID: z.string().optional(),
    level: zRuleValue.optional(),
    renew: z.union([z.literal("daily"), zFalse]).optional()
});

export type zSpecialResourceSource = z.infer<typeof zSpecialResourceSource>;
