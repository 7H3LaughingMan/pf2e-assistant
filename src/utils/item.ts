import { AbilityItemPF2e, ActorPF2e, ItemPF2e, MeleePF2e, WeaponPF2e } from "@7h3laughingman/pf2e-types";
import * as R from "remeda";
import { isDocumentType } from "./document.ts";

export function isWeapon(
    value: unknown
): value is AbilityItemPF2e<ActorPF2e> | WeaponPF2e<ActorPF2e> | MeleePF2e<ActorPF2e> {
    return (
        isDocumentType<ItemPF2e>(value, "Item") &&
        R.isNonNullish(value.parent) &&
        value.isOfType("action", "weapon", "melee")
    );
}
