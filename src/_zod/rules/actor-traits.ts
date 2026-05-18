import * as z from "zod";
import { zRuleElementSchema, zRuleElementSource } from "./base.ts";

export const zActorTraitsSource = zRuleElementSource.extend({
    key: z.literal("ActorTraits"),
    add: z.array(z.string()).optional(),
    removed: z.array(z.string()).optional()
});

export type zActorTraitsSource = z.infer<typeof zActorTraitsSource>;

export const zActorTraitsSchema = zRuleElementSchema.extend({
    key: z.literal("ActorTraits"),
    priority: z.int().default(51),
    add: z.array(z.string()).default([]),
    remove: z.array(z.string()).default([])
});

export type zActorTraitsSchema = z.infer<typeof zActorTraitsSchema>;
