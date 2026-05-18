import { ActorPF2e, TokenDocumentPF2e, TokenPF2e } from "@7h3laughingman/pf2e-types";
import * as R from "remeda";

export function isAllyOf(
    a: Maybe<TokenPF2e | TokenDocumentPF2e | ActorPF2e>,
    b: Maybe<TokenPF2e | TokenDocumentPF2e | ActorPF2e>
): boolean {
    const actorA =
        a instanceof foundry.canvas.placeables.Token
            ? (a as TokenPF2e).actor
            : a instanceof TokenDocument
              ? (a as TokenDocumentPF2e).actor
              : (a as Maybe<ActorPF2e>);

    const actorB =
        b instanceof foundry.canvas.placeables.Token
            ? (b as TokenPF2e).actor
            : b instanceof TokenDocument
              ? (b as TokenDocumentPF2e).actor
              : (b as Maybe<ActorPF2e>);

    return R.isNonNullish(actorA) && R.isNonNullish(actorB) && actorA.isAllyOf(actorB);
}

export function isEnemyOf(
    a: Maybe<TokenPF2e | TokenDocumentPF2e | ActorPF2e>,
    b: Maybe<TokenPF2e | TokenDocumentPF2e | ActorPF2e>
): boolean {
    const actorA =
        a instanceof foundry.canvas.placeables.Token
            ? (a as TokenPF2e).actor
            : a instanceof TokenDocument
              ? (a as TokenDocumentPF2e).actor
              : (a as Maybe<ActorPF2e>);
    const actorB =
        b instanceof foundry.canvas.placeables.Token
            ? (b as TokenPF2e).actor
            : b instanceof TokenDocument
              ? (b as TokenDocumentPF2e).actor
              : (b as Maybe<ActorPF2e>);

    return R.isNonNullish(actorA) && R.isNonNullish(actorB) && actorA.isEnemyOf(actorB);
}
