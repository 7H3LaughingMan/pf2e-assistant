import {
    OneToFive,
    OneToFour,
    OneToSix,
    OneToTen,
    OneToThree,
    Rarity,
    Size,
    TwoToThree,
    ZeroToEleven,
    ZeroToFive,
    ZeroToFour,
    ZeroToSix,
    ZeroToTen,
    ZeroToThree,
    ZeroToTwo
} from "@7h3laughingman/pf2e-types/module/data.js";
import * as R from "remeda";
import * as z from "zod";

export const zSize: z.ZodLazy<z.ZodLiteral<Size>> = z.lazy(() => z.literal(R.keys(CONFIG.PF2E.actorSizes)));

export const zRarity: z.ZodLazy<z.ZodLiteral<Rarity>> = z.lazy(() => z.literal(R.keys(CONFIG.PF2E.rarityTraits)));

export const zZeroToTwo: z.ZodLiteral<ZeroToTwo> = z.literal([0, 1, 2]);

export const zZeroToThree: z.ZodLiteral<ZeroToThree> = z.literal([0, 1, 2, 3]);

export const zOneToThree: z.ZodLiteral<OneToThree> = z.literal([1, 2, 3]);

export const zTwoToThree: z.ZodLiteral<TwoToThree> = z.literal([2, 3]);

export const zZeroToFour: z.ZodLiteral<ZeroToFour> = z.literal([0, 1, 2, 3, 4]);

export const zOneToFour: z.ZodLiteral<OneToFour> = z.literal([1, 2, 3, 4]);

export const zZeroToFive: z.ZodLiteral<ZeroToFive> = z.literal([0, 1, 2, 3, 4, 5]);

export const zOneToFive: z.ZodLiteral<OneToFive> = z.literal([1, 2, 3, 4, 5]);

export const zZeroToSix: z.ZodLiteral<ZeroToSix> = z.literal([0, 1, 2, 3, 4, 5, 6]);

export const zOneToSix: z.ZodLiteral<OneToSix> = z.literal([1, 2, 3, 4, 5, 6]);

export const zZeroToTen: z.ZodLiteral<ZeroToTen> = z.literal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

export const zOneToTen: z.ZodLiteral<OneToTen> = z.literal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

export const zZeroToEleven: z.ZodLiteral<ZeroToEleven> = z.literal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
