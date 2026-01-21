import * as R from "remeda";

/**  DOM helper functions that return HTMLElement(s) (or `null`) */

type MaybeHTML = Maybe<Document | Element | EventTarget>;

export function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    options?: CreateHTMLElementOptionsWithChildren
): HTMLElementTagNameMap[K];
export function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    options?: CreateHTMLElementOptionsWithInnerHTML
): HTMLElementTagNameMap[K];
export function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    options?: CreateHTMLElementOptionsWithNeither
): HTMLElementTagNameMap[K];
export function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    { id, classes = [], dataset = {}, aria = {}, children = [], innerHTML }: CreateHTMLElementOptions = {}
): HTMLElementTagNameMap[K] {
    const element = document.createElement(nodeName);
    if (id) element.id = id;
    if (classes.length > 0) element.classList.add(...classes);
    for (const [key, value] of Object.entries(dataset)) {
        if (R.isNullish(value) || value === false) continue;
        element.dataset[key] = value === true ? "" : String(value);
    }
    for (const [key, value] of Object.entries(aria)) {
        if (R.isNullish(value) || value === false) continue;
        element.setAttribute(`aria-${key}`, value);
    }

    if (innerHTML) {
        element.innerHTML = innerHTML;
    } else {
        for (const child of children) {
            const childElement = child instanceof HTMLElement ? child : new Text(child);
            element.appendChild(childElement);
        }
    }

    return element;
}

interface CreateHTMLElementOptions {
    id?: string;
    classes?: string[];
    dataset?: Record<string, Maybe<string | number | boolean>>;
    aria?: Record<string, Maybe<string | false>>;
    children?: (HTMLElement | string)[];
    innerHTML?: string;
}

interface CreateHTMLElementOptionsWithChildren extends CreateHTMLElementOptions {
    children: (HTMLElement | string)[];
    innerHTML?: never;
}

interface CreateHTMLElementOptionsWithInnerHTML extends CreateHTMLElementOptions {
    children?: never;
    innerHTML: string;
}

interface CreateHTMLElementOptionsWithNeither extends CreateHTMLElementOptions {
    children?: never;
    innerHTML?: never;
}

export function htmlQuery<K extends keyof HTMLElementTagNameMap>(
    parent: MaybeHTML,
    selectors: K
): HTMLElementTagNameMap[K] | null;
export function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null;
export function htmlQuery<E extends HTMLElement = HTMLElement>(parent: MaybeHTML, selectors: string): E | null;
export function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null {
    if (!(parent instanceof Element || parent instanceof Document)) return null;
    return parent.querySelector<HTMLElement>(selectors);
}

export function htmlQueryAll<K extends keyof HTMLElementTagNameMap>(
    parent: MaybeHTML,
    selectors: K
): HTMLElementTagNameMap[K][];
export function htmlQueryAll(parent: MaybeHTML, selectors: string): HTMLElement[];
export function htmlQueryAll<E extends HTMLElement = HTMLElement>(parent: MaybeHTML, selectors: string): E[];
export function htmlQueryAll(parent: MaybeHTML, selectors: string): HTMLElement[] {
    if (!(parent instanceof Element || parent instanceof Document)) return [];
    return Array.from(parent.querySelectorAll<HTMLElement>(selectors));
}

export function htmlClosest<K extends keyof HTMLElementTagNameMap>(
    parent: MaybeHTML,
    selectors: K
): HTMLElementTagNameMap[K] | null;
export function htmlClosest(child: MaybeHTML, selectors: string): HTMLElement | null;
export function htmlClosest<E extends HTMLElement = HTMLElement>(parent: MaybeHTML, selectors: string): E | null;
export function htmlClosest(child: MaybeHTML, selectors: string): HTMLElement | null {
    if (!(child instanceof Element)) return null;
    return child.closest<HTMLElement>(selectors);
}

export function htmlSelectorFor(element: HTMLElement): string {
    const nodeName = element.nodeName.toLowerCase();
    const classes = element.className.split(" ").filter(R.isTruthy);
    const classesString = classes.length > 0 ? `.${classes.join(".")}` : "";
    const datasetEntries = Object.entries(element.dataset).map(([k, v]) => [
        k.replace(/([A-Z])/g, "-$1").toLowerCase(),
        v
    ]);
    const datasetString = datasetEntries.map(([k, v]) => `[data-${k}="${v}"]`).join("");

    return `${nodeName}${classesString}${datasetString}`;
}
