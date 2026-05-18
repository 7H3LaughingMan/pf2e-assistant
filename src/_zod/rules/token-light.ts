import * as z from "zod";
import { zRuleElementSource, zRuleValue } from "./base.ts";

export const zTokenLightSource = zRuleElementSource.extend({
    key: z.literal("TokenLight"),
    value: z
        .strictObject({
            alpha: z.number().optional(),
            angle: z.number().optional(),
            bright: zRuleValue.optional(),
            color: z.string().optional(),
            coloration: z.number().optional(),
            dim: zRuleValue.optional(),
            attenuation: z.number().optional(),
            luminosity: z.number().optional(),
            saturation: z.number().optional(),
            contrast: z.number().optional(),
            shadows: z.number().optional(),
            animation: z
                .strictObject({
                    type: z.string().optional(),
                    speed: z.number().optional(),
                    intensity: z.number().optional(),
                    reverse: z.boolean().optional()
                })
                .optional(),
            darkness: z
                .strictObject({
                    min: z.number().optional(),
                    max: z.number().optional(),
                    speed: z.number().optional()
                })
                .optional()
        })
        .optional()
});

export type zTokenLightSource = z.infer<typeof zTokenLightSource>;
