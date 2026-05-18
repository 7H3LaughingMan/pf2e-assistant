import * as z from "zod";
import { zRuleElementSource } from "./base.ts";
import { zItemAlteration } from "./item-alteration.ts";

export const zEphemeralEffectSource = zRuleElementSource.extend({
    key: z.literal("EphemeralEffect"),
    affects: z.literal(["target", "origin"]).optional(),
    selectors: z.array(z.string()).optional(),
    uuid: z.string().optional(),
    adjustName: z.boolean().optional(),
    alterations: z.array(zItemAlteration).optional()
});

export type zEphemeralEffectSource = z.infer<typeof zEphemeralEffectSource>;
