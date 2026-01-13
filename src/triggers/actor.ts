import { Assistant } from "assistant.ts";
import { ActorPF2e, ActorSourcePF2e, CharacterPF2e } from "foundry-pf2e";
import { DatabaseUpdateOperation } from "foundry-pf2e/foundry/common/abstract/_module.mjs";
import { Utils } from "utils.ts";

Hooks.on(
    "preUpdateActor",
    (
        document: ActorPF2e,
        changed: PreCreate<ActorSourcePF2e>,
        _options: DatabaseUpdateOperation<ActorPF2e>,
        userId: string
    ) => {
        if (game.userId !== userId) return;

        if (document.isOfType("character") && changed.system !== undefined) {
            const system = changed.system as DeepPartial<CharacterPF2e["system"]>;
            if (system.exploration) {
                const activated = system.exploration.filter((value) => !document.system.exploration.includes(value));
                const deactivated = document.system.exploration.filter((value) => !system.exploration?.includes(value));

                activated.forEach((value) => processExploration(document, value, "activate-exploration"));
                deactivated.forEach((value) => processExploration(document, value, "deactivate-exploration"));
            }
        }
    }
);

function processExploration(
    character: CharacterPF2e,
    id: string,
    trigger: "activate-exploration" | "deactivate-exploration"
) {
    const data: Assistant.Data = {
        trigger: trigger,
        rollOptions: []
    };

    const tokens = character.getActiveTokens(true, true);
    const action = character.itemTypes.action.find((value) => value.id === id);

    if (tokens.length === 1 && action !== undefined) {
        data.speaker = {
            actor: character,
            token: tokens[0]
        };

        data.rollOptions.push(...Utils.Actor.getRollOptions(character, "self"));

        data.item = action;

        data.rollOptions.push(...action.getRollOptions());

        game.assistant.storage.process(data);

        console.log("Hello World!");
    }
}
