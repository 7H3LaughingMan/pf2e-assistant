import { TokenDocumentPF2e, TokenPF2e } from "@7h3laughingman/pf2e-types";
import * as R from "remeda";

export function isAdjacentTo(
    a: Maybe<TokenPF2e | TokenDocumentPF2e>,
    b: Maybe<TokenPF2e | TokenDocumentPF2e>
): boolean {
    const tokenA = a instanceof TokenDocument ? (a as TokenDocumentPF2e).object : (a as Maybe<TokenPF2e>);
    const tokenB = b instanceof TokenDocument ? (b as TokenDocumentPF2e).object : (b as Maybe<TokenPF2e>);

    return R.isNonNullish(tokenA) && R.isNonNullish(tokenB) && tokenA.isAdjacentTo(tokenB);
}

export function distanceTo(
    a: Maybe<TokenPF2e | TokenDocumentPF2e>,
    b: Maybe<TokenPF2e | TokenDocumentPF2e>,
    { reach }: { reach?: number } = {}
): number {
    const tokenA = a instanceof TokenDocument ? (a as TokenDocumentPF2e).object : (a as Maybe<TokenPF2e>);
    const tokenB = b instanceof TokenDocument ? (b as TokenDocumentPF2e).object : (b as Maybe<TokenPF2e>);

    return R.isNonNullish(tokenA) && R.isNonNullish(tokenB) ? tokenA.distanceTo(tokenB, { reach }) : 0;
}
