import { ActorPF2e, ItemPF2e } from "@7h3laughingman/pf2e-types";
import * as R from "remeda";

export function getOriginRollOptions(actor: Maybe<ActorPF2e>, item: Maybe<ItemPF2e>) {
    const rollOptions = [];

    if (actor) {
        rollOptions.push(...actor.getSelfRollOptions("origin"));
    }

    if (item) {
        rollOptions.push(...item.getRollOptions("origin:item"));
    }

    return rollOptions.filter(R.isTruthy).sort();
}
