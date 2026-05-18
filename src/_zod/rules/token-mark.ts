import * as z from "zod";
import { zRuleElementSource } from "./base.ts";

export const zTokenMarkSource = zRuleElementSource.extend({
    key: z.literal("TokenMark"),
    slug: z.string().optional(),
    uuid: z.string().optional()
});

export type zTokenMarkSource = z.infer<typeof zTokenMarkSource>;
