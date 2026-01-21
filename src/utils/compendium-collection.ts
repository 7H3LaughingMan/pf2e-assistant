import { ActorPF2e, ItemPF2e, MacroPF2e, ScenePF2e } from "foundry-pf2e";
import * as R from "remeda";

export function isActorPack(
    pack: Maybe<foundry.documents.collections.CompendiumCollection>
): pack is foundry.documents.collections.CompendiumCollection<ActorPF2e<null>> {
    if (R.isNullish(pack)) return false;
    return pack.documentName === "Actor";
}

export function isAdventurePack(
    pack: Maybe<foundry.documents.collections.CompendiumCollection>
): pack is foundry.documents.collections.CompendiumCollection<foundry.documents.Adventure> {
    if (R.isNullish(pack)) return false;
    return pack.documentName === "Adventure";
}

export function isCardsPack(
    pack: Maybe<foundry.documents.collections.CompendiumCollection>
): pack is foundry.documents.collections.CompendiumCollection<foundry.documents.Cards> {
    if (R.isNullish(pack)) return false;
    return pack.documentName === "Cards";
}

export function isItemPack(
    pack: Maybe<foundry.documents.collections.CompendiumCollection>
): pack is foundry.documents.collections.CompendiumCollection<ItemPF2e<null>> {
    if (R.isNullish(pack)) return false;
    return pack.documentName === "Item";
}

export function isJournalEntryPack(
    pack: Maybe<foundry.documents.collections.CompendiumCollection>
): pack is foundry.documents.collections.CompendiumCollection<foundry.documents.JournalEntry> {
    if (R.isNullish(pack)) return false;
    return pack.documentName === "JournalEntry";
}

export function isMacroPack(
    pack: Maybe<foundry.documents.collections.CompendiumCollection>
): pack is foundry.documents.collections.CompendiumCollection<MacroPF2e> {
    if (R.isNullish(pack)) return false;
    return pack.documentName === "Macro";
}

export function isPlaylistPack(
    pack: Maybe<foundry.documents.collections.CompendiumCollection>
): pack is foundry.documents.collections.CompendiumCollection<foundry.documents.Playlist> {
    if (R.isNullish(pack)) return false;
    return pack.documentName === "Playlist";
}

export function isRollTablePack(
    pack: Maybe<foundry.documents.collections.CompendiumCollection>
): pack is foundry.documents.collections.CompendiumCollection<foundry.documents.RollTable> {
    if (R.isNullish(pack)) return false;
    return pack.documentName === "RollTable";
}

export function isScenePack(
    pack: Maybe<foundry.documents.collections.CompendiumCollection>
): pack is foundry.documents.collections.CompendiumCollection<ScenePF2e> {
    if (R.isNullish(pack)) return false;
    return pack.documentName === "Scene";
}
