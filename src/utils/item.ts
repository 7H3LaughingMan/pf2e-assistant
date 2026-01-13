import { ActorPF2e, EffectTrait, ItemPF2e, ItemTrait } from "foundry-pf2e";
import { ItemUUID } from "foundry-pf2e/foundry/common/documents/_module.mjs";

export async function getItem(itemUuid: ItemUUID): Promise<ItemPF2e | null> {
    let item: Maybe<ItemPF2e> = await fromUuid<ItemPF2e>(itemUuid);
    if (!item) {
        const parts = itemUuid.split(".");
        const actor = await fromUuid<ActorPF2e>(parts.slice(0, -2).join("."));
        if (actor) {
            item = actor.system.actions?.find((x) => x.item.uuid === itemUuid)?.item;
        }
    }

    return item ?? null;
}

export function isEffectTrait(trait: ItemTrait): trait is EffectTrait {
    return trait in CONFIG.PF2E.effectTraits;
}
