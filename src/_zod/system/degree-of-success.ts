import {
    DegreeAdjustmentAmount,
    DegreeOfSuccessIndex,
    DegreeOfSuccessString
} from "@7h3laughingman/pf2e-types/module/system/degree-of-success.js";
import * as z from "zod";
import { zZeroToThree } from "../data.ts";

export const zDegreeAdjustmentAmount: z.ZodLiteral<DegreeAdjustmentAmount> = z.literal([
    -2,
    -1,
    1,
    2,
    "criticalFailure",
    "failure",
    "success",
    "criticalSuccess"
]);

export const zDegreeOfSuccessIndex: z.ZodLiteral<DegreeOfSuccessIndex> = zZeroToThree;

export const zDegreeOfSuccessString: z.ZodLiteral<DegreeOfSuccessString> = z.literal([
    "criticalFailure",
    "failure",
    "success",
    "criticalSuccess"
]);
