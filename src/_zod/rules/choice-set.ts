import * as z from "zod";
import { zRawPredicate } from "../system/predication.ts";
import { zObject } from "../types.ts";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zPickableThing = z.strictObject({
    value: z.union([z.string(), z.number(), zObject]),
    label: z.string(),
    img: z.string().optional(),
    predicate: zRawPredicate.optional(),
    group: z.string().optional()
});

export type zPickableThing = z.infer<typeof zPickableThing>;

export const zChoiceSetOwnedItems = z.strictObject({
    ownedItems: z.boolean(),
    includeHandwraps: z.boolean().optional(),
    predicate: zRawPredicate.optional(),
    types: z.array(z.string())
});

export type zChoiceSetOwnedItems = z.infer<typeof zChoiceSetOwnedItems>;

export const zChoiceSetAttacks = z.strictObject({
    attacks: z.boolean().optional(),
    unarmedAttacks: z.boolean().optional(),
    predicate: zRawPredicate.optional()
});

export type zChoiceSetAttacks = z.infer<typeof zChoiceSetAttacks>;

export const zChoiceSetPackQuery = z.strictObject({
    itemType: z.string().optional(),
    pack: z.boolean().optional(),
    filter: zRawPredicate.optional(),
    slugsAsValues: z.boolean().optional()
});

export type zChoiceSetPackQuery = z.infer<typeof zChoiceSetPackQuery>;

export const zChoiceSetConfig = z.strictObject({
    config: z.string(),
    predicate: zRawPredicate.optional()
});

export type zChoiceSetConfig = z.infer<typeof zChoiceSetConfig>;

export const zChoiceSetObject = z.union([
    zChoiceSetOwnedItems,
    zChoiceSetAttacks,
    zChoiceSetPackQuery,
    zChoiceSetConfig
]);

export const zChoiceSetSource = zRuleElementSource.extend({
    key: z.literal("ChoiceSet"),
    choices: z.union([z.array(zPickableThing), zChoiceSetObject, z.string()]).optional(),
    selection: zRuleValue.optional(),
    prompt: z.string().optional(),
    adjustName: z.union([z.boolean(), z.string()]).optional(),
    allowedDrops: z
        .strictObject({
            label: z.string().optional(),
            predicate: zRawPredicate.optional()
        })
        .optional(),
    flag: z.string().optional(),
    actorFlag: z.boolean().optional(),
    rollOption: z.string().optional(),
    allowNoSelection: z.boolean().optional()
});

export type zChoiceSetSource = z.infer<typeof zChoiceSetSource>;
