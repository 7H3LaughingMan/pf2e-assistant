import * as z from "zod";
import { zRuleElementSource } from "./base.ts";
import { zItemAlteration } from "./item-alteration.ts";

export const zGrantItemSource = zRuleElementSource.extend({
    key: z.literal("GrantItem"),
    uuid: z.string().optional(),
    flags: z.string().optional(),
    reevaluateOnUpdate: z.boolean().optional(),
    inMemoryOnly: z.boolean().optional(),
    allowDuplicates: z.boolean().optional(),
    onDeleteActions: z
        .strictObject({
            granter: z.literal(["cascade", "detach", "restrict"]).optional(),
            grantee: z.literal(["cascade", "detach", "restrict"]).optional()
        })
        .optional(),
    nestUnderGranter: z.boolean().optional(),
    alterations: z.array(zItemAlteration).optional(),
    track: z.boolean().optional()
});

export type zGrantItemSource = z.infer<typeof zGrantItemSource>;
