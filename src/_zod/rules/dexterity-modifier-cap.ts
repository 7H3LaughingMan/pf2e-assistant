import * as z from "zod";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zDexterityModifierCapSource = zRuleElementSource.extend({
    key: z.literal("DexterityModifierCap"),
    value: zRuleValue.optional()
});

export type zDexterityModifierCapSource = z.infer<typeof zDexterityModifierCapSource>;
