import { ItemSourcePF2e, RuleElementSource, TokenDocumentPF2e } from "@7h3laughingman/pf2e-types";
import { zChoiceSetSource } from "_zod/rules/choice-set.ts";
import { zTokenMarkSource } from "_zod/rules/token-mark.ts";
import { zIs } from "_zod/type-guards.ts";

export interface ModifyFlatDCRuleElementSource extends RuleElementSource {
    type: string;
    mode: "add" | "upgrade" | "downgrade" | "override";
    value: string | number;
    affects?: "origin" | "self";
}

export interface TreatAsRuleElementSource extends RuleElementSource {
    condition: "observed" | "concealed" | "hidden";
    treatAs: "observed" | "concaled" | "hidden";
    mode: "upgrade" | "downgrade" | "override";
    affects?: "origin" | "self";
}

export interface TokenMarkSource extends RuleElementSource {
    slug?: string;
    uuid?: string;
}

export function getChoiceSetSelect<T extends ItemSourcePF2e>(itemSource: T, { flag }: { flag?: string } = {}) {
    return itemSource.system.rules
        .filter((value) => zIs(value, zChoiceSetSource))
        .find((value) => (flag === undefined ? true : value.flag === flag))?.selection;
}

export function setChoiceSet<T extends ItemSourcePF2e>(
    itemSource: T,
    { flag, selection }: { flag?: string; selection: string | number | boolean }
) {
    const choiceSet = itemSource.system.rules
        .filter((value) => zIs(value, zChoiceSetSource))
        .find((value) => (flag === undefined ? true : value.flag === flag));

    if (choiceSet) choiceSet.selection = selection;
}

export function setTokenMark<T extends ItemSourcePF2e>(
    itemSource: T,
    { slug, token }: { slug: string; token: TokenDocumentPF2e }
) {
    const tokenMark = itemSource.system.rules
        .filter((value) => zIs(value, zTokenMarkSource))
        .find((value) => value.slug === slug);

    if (tokenMark) tokenMark.uuid = token.uuid;
}
