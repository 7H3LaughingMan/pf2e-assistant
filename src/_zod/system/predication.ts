import { PredicateStatement, RawPredicate } from "@7h3laughingman/pf2e-types/module/system/predication.js";
import * as z from "zod";

const zEqualTo = z.strictObject({ eq: z.tuple([z.string(), z.union([z.string(), z.number()])]) });

const zGreaterThan = z.strictObject({ gt: z.tuple([z.string(), z.union([z.string(), z.number()])]) });

const zGreaterThanEqualTo = z.strictObject({ gte: z.tuple([z.string(), z.union([z.string(), z.number()])]) });

const zLessThan = z.strictObject({ lt: z.tuple([z.string(), z.union([z.string(), z.number()])]) });

const zLessThanEqualTo = z.strictObject({ lte: z.tuple([z.string(), z.union([z.string(), z.number()])]) });

const zBinaryOperation = z.union([zEqualTo, zGreaterThan, zGreaterThanEqualTo, zLessThan, zLessThanEqualTo]);

const zAtom = z.union([z.string(), zBinaryOperation]);

const zConjunction = z.strictObject({ and: z.lazy(() => z.array(zPredicateStatement)) });

const zDisjunction = z.strictObject({ or: z.lazy(() => z.array(zPredicateStatement)) });

const zExclusiveDisjunction = z.strictObject({ xor: z.lazy(() => z.array(zPredicateStatement)) });

const zNegation = z.strictObject({ not: z.lazy(() => zPredicateStatement) });

const zAlternativeDenial = z.strictObject({ nand: z.lazy(() => z.array(zPredicateStatement)) });

const zJointDenial = z.strictObject({ nor: z.lazy(() => z.array(zPredicateStatement)) });

const zConditional = z.strictObject({
    if: z.lazy(() => zPredicateStatement),
    then: z.lazy(() => zPredicateStatement)
});

const zBiconditional = z.strictObject({ iff: z.lazy(() => z.array(zPredicateStatement)) });

const zCompoundStatement = z.union([
    zConjunction,
    zDisjunction,
    zExclusiveDisjunction,
    zAlternativeDenial,
    zJointDenial,
    zNegation,
    zConditional,
    zBiconditional
]);

export const zPredicateStatement: z.ZodType<PredicateStatement, PredicateStatement> = z.union([
    zAtom,
    zCompoundStatement
]);

export const zRawPredicate: z.ZodType<RawPredicate, RawPredicate> = z.array(zPredicateStatement);
