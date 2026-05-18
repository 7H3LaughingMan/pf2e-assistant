import * as z from "zod";

export function zIs<T>(value: unknown, schema: z.ZodType<unknown, T>): value is T {
    return schema.safeParse(value).success;
}
