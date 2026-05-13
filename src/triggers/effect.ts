import { ItemPF2e } from "@7h3laughingman/pf2e-types";

// @ts-expect-error No overload matches this call.
Hooks.on("createItem", (item: ItemPF2e) => {
    if (!(item.isOfType("effect") || item.isOfType("condition"))) return;
    if (!item.actor) return;
    const tokens = item.actor.getActiveTokens(true, true);
    if (tokens.length !== 1) return;

    game.assistant.storage.process({
        trigger: "create-effect",
        rollOptions: [...item.actor.getRollOptions(), ...item.getRollOptions("item")],
        speaker: { actor: item.actor, token: tokens[0] }
    });
});

// @ts-expect-error No overload matches this call.
Hooks.on("deleteItem", (item: ItemPF2e) => {
    if (!(item.isOfType("effect") || item.isOfType("condition"))) return;
    if (!item.actor) return;
    const tokens = item.actor.getActiveTokens(true, true);
    if (tokens.length !== 1) return;

    game.assistant.storage.process({
        trigger: "delete-effect",
        rollOptions: [...item.actor.getRollOptions(), ...item.getRollOptions("item")],
        speaker: { actor: item.actor, token: tokens[0] }
    });
});
