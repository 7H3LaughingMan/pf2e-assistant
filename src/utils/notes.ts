import { UserVisibility } from "@7h3laughingman/pf2e-types/scripts/ui/user-visibility.js";
import { createHTMLElement } from "./html.ts";

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
        const element = createHTMLElement("li", {
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
            const strong = createHTMLElement("strong", { innerHTML: game.i18n.localize(title) });
            element.prepend(strong, " ");
        }

        return element;
    }

    if (notes.length === 0) return undefined;
    return createHTMLElement("ul", {
        classes: ["notes"],
        children: [...notes.flatMap((note) => ["\n", toHTML(note), "\n"])]
    }).outerHTML;
}
