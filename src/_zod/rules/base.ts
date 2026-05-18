import * as z from "zod";
import { zRawPredicate } from "../system/predication.ts";
import { zObject, zSlugField } from "../types.ts";

export const zRuleValue = z.union([z.string(), z.number(), z.boolean(), zObject]);

export type zRuleValue = z.infer<typeof zRuleValue>;

export const zRuleElementSource = z.looseObject({
    key: z.string(),
    slug: z.string().optional(),
    label: z.string().optional(),
    priority: z.number().optional(),
    ignored: z.boolean().optional(),
    predicate: zRawPredicate.optional(),
    requiresEquipped: z.boolean().optional(),
    requiresInvestment: z.boolean().optional(),
    spinoff: z.string().optional()
});

export type zRuleElementSource = z.infer<typeof zRuleElementSource>;

export const zRuleElementSchema = z.looseObject({
    key: z.string().nonempty(),
    slug: zSlugField().nullable().default(null),
    label: z.string().nonempty().optional(),
    priority: z.int().default(100),
    ignored: z.boolean().default(false),
    predicate: zRawPredicate.default([]),
    requiresEquipped: z.boolean().nullable().default(null),
    requiresInvestment: z.boolean().nullable().default(null),
    spinoff: zSlugField().optional()
});

export type zRuleElementSchema = z.infer<typeof zRuleElementSchema>;
