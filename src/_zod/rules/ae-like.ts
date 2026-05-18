import * as z from "zod";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zAELikeChangeMode = z.literal([
    "multiply",
    "add",
    "subtract",
    "remove",
    "downgrade",
    "upgrade",
    "override"
]);

export type zAELikeChangeMode = z.infer<typeof zAELikeChangeMode>;

export const zAELikeDataPrepPhase = z.literal(["applyAEs", "beforeDerived", "afterDerived", "beforeRoll"]);

export type zAELikeDataPrepPhase = z.infer<typeof zAELikeDataPrepPhase>;

export const zAELikeSource = zRuleElementSource.extend({
    key: z.literal("ActiveEffectLike"),
    testDomains: z.array(z.string()).optional(),
    mode: zAELikeChangeMode.optional(),
    path: z.string().optional(),
    phase: zAELikeDataPrepPhase.optional(),
    value: zRuleValue.optional(),
    merge: z.boolean().optional()
});

export type zAELikeSource = z.infer<typeof zAELikeSource>;
