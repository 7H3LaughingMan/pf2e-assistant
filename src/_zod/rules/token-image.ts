import * as z from "zod";
import { zRuleElementSource } from "./base.ts";

export const zTokenImageSource = zRuleElementSource.extend({
    key: z.literal("TokenImage"),
    value: z.string().optional(),
    tint: z.string().optional(),
    alpha: z.number().optional(),
    scale: z.number().optional(),
    ring: z
        .strictObject({
            subject: z
                .strictObject({
                    texture: z.string().optional(),
                    scale: z.number().optional()
                })
                .optional(),
            colors: z
                .strictObject({
                    background: z.string().optional(),
                    ring: z.string().optional()
                })
                .optional(),
            effects: z.number().optional()
        })
        .optional(),
    animation: z
        .strictObject({
            duration: z.number().optional(),
            transition: z.string().optional(),
            easing: z.literal(["easeInOutCosine", "easeOutCircle", "easeInCircle"]).optional(),
            name: z.string().optional()
        })
        .optional()
});

export type zTokenImageSource = z.infer<typeof zTokenImageSource>;
