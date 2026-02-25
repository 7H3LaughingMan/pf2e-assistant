import { AbilityItemPF2e, ActorPF2e, ItemPF2e, MeleePF2e, WeaponPF2e } from "@7h3laughingman/pf2e-types";
import * as R from "remeda";

export function isWeapon(
    item: Maybe<ItemPF2e>
): item is AbilityItemPF2e<ActorPF2e> | WeaponPF2e<ActorPF2e> | MeleePF2e<ActorPF2e> {
    return R.isNonNullish(item) && item.isOfType("action", "weapon", "melee") && R.isNonNullish(item.parent);
}
