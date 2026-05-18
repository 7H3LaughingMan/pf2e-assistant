import * as R from "remeda";
import * as z from "zod";

export const zFalse: z.ZodLiteral<false> = z.literal(false);

export const zObject: z.ZodType<object, object> = z.custom<object>((data) => R.isPlainObject(data));

export const zSlugField = (
    camel: "dromedary" | "bactrian" | null = null
): z.ZodPipe<z.ZodString, z.ZodTransform<string, string>> =>
    z
        .string()
        .nonempty()
        .transform((arg) => game.pf2e.system.sluggify(arg, { camel }));

export const zTrue: z.ZodLiteral<true> = z.literal(true);
