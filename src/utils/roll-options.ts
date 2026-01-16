import { ActorPF2e, ItemPF2e } from "foundry-pf2e";
import { Utils } from "utils.ts";

export function getOriginRollOptions(actor: Maybe<ActorPF2e>, item: Maybe<ItemPF2e>) {
    const rollOptions = [];

    if (actor) {
        rollOptions.push(...actor.getSelfRollOptions("origin"));
    }

    if (item) {
        rollOptions.push(...item.getRollOptions("origin:item"));
    }

    return rollOptions.filter(Utils.Remeda.isTruthy).sort();
}
