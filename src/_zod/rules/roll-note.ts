import * as z from "zod";
import { zDegreeOfSuccessString } from "../system/degree-of-success.ts";
import { zRuleElementSource } from "./base.ts";

export const zRollNoteSource = zRuleElementSource.extend({
    key: z.literal("Note"),
    selector: z.array(z.string()).optional(),
    title: z.string().optional(),
    visibility: z.literal("gm", "owner").optional(),
    outcome: z.array(zDegreeOfSuccessString).optional(),
    text: z.string().optional(),
    battleForm: z.boolean().optional()
});

export type zRollNoteSource = z.infer<typeof zRollNoteSource>;
