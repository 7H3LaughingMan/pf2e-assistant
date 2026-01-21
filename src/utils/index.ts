export * as Actor from "./actor.ts";
export * as Array from "./array.ts";
export * as ChatLog from "./chat-log.ts";
export * as ChatMessage from "./chat-message.ts";
export * as CompendiumCollection from "./compendium-collection.ts";
export * as Damage from "./damage.ts";
export * as DOM from "./dom.ts";
export * as Effect from "./effect.ts";
export * as Item from "./item.ts";
export * as Macros from "./macros.ts";
export * as RollOptions from "./roll-options.ts";
export * as Roll from "./roll.ts";
export * as Rules from "./rules.ts";
export * as User from "./user.ts";

export function objectHasKey<O extends object>(obj: O, key: unknown): key is keyof O {
    return (typeof key === "string" || typeof key === "number") && key in obj;
}
