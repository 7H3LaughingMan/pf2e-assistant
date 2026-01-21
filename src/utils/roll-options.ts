import { ActorPF2e, ItemPF2e } from "foundry-pf2e";
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
