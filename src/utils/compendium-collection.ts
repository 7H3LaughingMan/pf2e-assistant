import { ActorPF2e, ItemPF2e, MacroPF2e, ScenePF2e } from "@7h3laughingman/pf2e-types";
import * as R from "remeda";

import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import CompendiumDocument = foundry.documents.CompendiumDocument;
import CompendiumDocumentType = foundry.utils.CompendiumDocumentType;

export function isCompendiumPack<T extends ActorPF2e<null>>(
    pack: unknown,
    type: "Actor"
): pack is CompendiumCollection<T>;
export function isCompendiumPack<T extends Adventure>(
    pack: unknown,
    type: "Adventure"
): pack is CompendiumCollection<T>;
export function isCompendiumPack<T extends Cards>(pack: unknown, type: "Cards"): pack is CompendiumCollection<T>;
export function isCompendiumPack<T extends ItemPF2e<null>>(
    pack: unknown,
    type: "Item"
): pack is CompendiumCollection<T>;
export function isCompendiumPack<T extends JournalEntry>(pack: unknown, type: "Item"): pack is CompendiumCollection<T>;
export function isCompendiumPack<T extends MacroPF2e>(pack: unknown, type: "Macro"): pack is CompendiumCollection<T>;
export function isCompendiumPack<T extends Playlist>(pack: unknown, type: "Playlist"): pack is CompendiumCollection<T>;
export function isCompendiumPack<T extends RollTable>(
    pack: unknown,
    type: "RollTable"
): pack is CompendiumCollection<T>;
export function isCompendiumPack<T extends ScenePF2e>(pack: unknown, type: "Scene"): pack is CompendiumCollection<T>;
export function isCompendiumPack<T extends CompendiumDocument>(
    pack: unknown,
    type: CompendiumDocumentType
): pack is CompendiumCollection<T> {
    return R.isNonNullish(pack) && pack instanceof CompendiumCollection && pack.documentName === type;
}
