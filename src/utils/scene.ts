import { ActorPF2e, ScenePF2e, TokenDocumentPF2e, TokenPF2e } from "@7h3laughingman/pf2e-types";
import * as R from "remeda";
import { isAllyOf, isEnemyOf } from "./alliance.ts";
import { distanceTo, isAdjacentTo } from "./token.ts";

export function getTokens(
    scene: Maybe<ScenePF2e>,
    args: {
        allyOf?: TokenPF2e | TokenDocumentPF2e | ActorPF2e;
        enemyOf?: TokenPF2e | TokenDocumentPF2e | ActorPF2e;
        adjacentTo?: TokenPF2e | TokenDocumentPF2e;
        distanceTo?: { target: TokenPF2e | TokenDocumentPF2e; distance: number };
        predicate?: (value: TokenDocumentPF2e<ScenePF2e>) => boolean;
    } = {}
): TokenDocumentPF2e<ScenePF2e>[] {
    if (R.isNullish(scene)) return [];

    return scene.tokens.filter(
        (token) =>
            (R.isNonNullish(args.allyOf) ? isAllyOf(args.allyOf, token) : true) &&
            (R.isNonNullish(args.enemyOf) ? isEnemyOf(args.enemyOf, token) : true) &&
            (R.isNonNullish(args.adjacentTo) ? isAdjacentTo(args.adjacentTo, token) : true) &&
            (R.isNonNullish(args.distanceTo)
                ? distanceTo(args.distanceTo.target, token) <= args.distanceTo.distance
                : true) &&
            (R.isNonNullish(args.predicate) ? args.predicate(token) : true)
    );
}
