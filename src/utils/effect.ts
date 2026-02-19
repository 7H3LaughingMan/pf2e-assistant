import { zChoiceSetSource, zIs, zTokenMarkSource } from "@7h3laughingman/pf2e-helpers/zod";
import { EffectSource, TokenDocumentPF2e } from "@7h3laughingman/pf2e-types";

export function setChoiceSet(
    effectSource: EffectSource,
    { flag, selection }: { flag?: string; selection: string | number | boolean }
) {
    const returnValue = foundry.utils.deepClone(effectSource);

    const choiceSet = returnValue.system.rules
        .filter((rule) => zIs(rule, zChoiceSetSource))
        .find((rule) => (flag === undefined ? true : rule.flag === flag));

    if (choiceSet) {
        choiceSet.selection = selection;
    }

    return returnValue;
}

export function setTokenMark(effectSource: EffectSource, { slug, token }: { slug: string; token: TokenDocumentPF2e }) {
    const returnValue = foundry.utils.deepClone(effectSource);

    const tokenMark = returnValue.system.rules
        .filter((rule) => zIs(rule, zTokenMarkSource))
        .find((rule) => rule.slug === slug);

    if (tokenMark) {
        tokenMark.uuid = token.uuid;
    }

    return returnValue;
}
