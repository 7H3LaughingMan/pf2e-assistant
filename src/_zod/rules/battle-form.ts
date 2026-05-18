import * as z from "zod";
import { zRuleElementSource } from "./base.ts";

export const zBattleFormSource = zRuleElementSource.extend({
    key: z.literal("BattleForm")
});

export type zBattleFormSource = z.infer<typeof zBattleFormSource>;
