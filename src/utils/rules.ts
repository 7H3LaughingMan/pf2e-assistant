import { ChoiceSetRuleElement, RollOptionRuleElement, RuleElementSource, TokenMarkRuleElement } from "foundry-pf2e";
import { UserVisibility } from "foundry-pf2e/pf2e/scripts/ui/user-visibility.js";
import { Utils } from "utils.ts";

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

export const isChoiceSet = (ruleElement: RuleElementSource): ruleElement is ChoiceSetRuleElement["_source"] =>
    ruleElement.key === "ChoiceSet";
export const isTokenMark = (ruleElement: RuleElementSource): ruleElement is TokenMarkRuleElement["_source"] =>
    ruleElement.key === "TokenMark";
export const isRollOption = (ruleElement: RuleElementSource): ruleElement is RollOptionRuleElement["_source"] =>
    ruleElement.key === "RollOption";

export function notesToHTML(
    notes: { title?: string | null; text: string; visibility?: UserVisibility | null }[]
): string | undefined {
    function toHTML({
        title,
        text,
        visibility
    }: {
        title?: string | null;
        text: string;
        visibility?: UserVisibility | null;
    }): HTMLLIElement {
        const element = Utils.DOM.createHTMLElement("li", {
            classes: ["roll-note"],
            dataset: {
                visibility: visibility
            },
            innerHTML: game.i18n.localize(text)
        });

        if (element.childNodes.length === 1 && element.firstChild instanceof HTMLElement) {
            element.innerHTML = element.firstChild.innerHTML;
        }

        if (title) {
            const strong = Utils.DOM.createHTMLElement("strong", { innerHTML: game.i18n.localize(title) });
            element.prepend(strong, " ");
        }

        return element;
    }

    if (notes.length === 0) return undefined;
    return Utils.DOM.createHTMLElement("ul", {
        classes: ["notes"],
        children: [...notes.flatMap((note) => ["\n", toHTML(note), "\n"])]
    }).outerHTML;
}
