import * as z from "zod";
import { zDegreeOfSuccessString } from "../system/degree-of-success.ts";
import { zRuleElementSource } from "./base.ts";

export const zDegreeAdjustmentAmountString = z.literal([
    "one-degree-better",
    "one-degree-worse",
    "two-degrees-better",
    "two-degrees-worse",
    "to-critical-failure",
    "to-failure",
    "to-success",
    "to-critical-success"
]);

export type zDegreeAdjustmentAmountString = z.infer<typeof zDegreeAdjustmentAmountString>;

export const zAdjustDegreeOfSuccessSource = zRuleElementSource.extend({
    key: z.literal("AdjustDegreeOfSuccess"),
    selector: z.array(z.string()).optional(),
    adjustment: z.partialRecord(
        z.union([z.literal("all"), zDegreeOfSuccessString]),
        zDegreeAdjustmentAmountString.optional()
    )
});

export type zAdjustDegreeOfSuccessSource = z.infer<typeof zAdjustDegreeOfSuccessSource>;
