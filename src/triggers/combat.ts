import { CombatantPF2e, EncounterPF2e } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";

Hooks.on("pf2e.startTurn", (combatant: CombatantPF2e) => {
    if (combatant.token === null || combatant.actor === null) return;

    game.assistant.storage.process({
        trigger: "start-turn",
        rollOptions: combatant.actor.getRollOptions(),
        speaker: { actor: combatant.actor, token: combatant.token }
    });
});

Hooks.on("pf2e.endTurn", (combatant: CombatantPF2e) => {
    if (combatant.token === null || combatant.actor === null) return;

    game.assistant.storage.process({
        trigger: "end-turn",
        rollOptions: combatant.actor.getRollOptions(),
        speaker: { actor: combatant.actor, token: combatant.token }
    });
});

Hooks.on("combatStart", (encounter: EncounterPF2e) => {
    for (const combatant of encounter.combatants) {
        if (combatant.token === null || combatant.actor === null) continue;

        const data: Assistant.Data = {
            trigger: "combat-start",
            rollOptions: combatant.actor.getRollOptions(),
            speaker: { actor: combatant.actor, token: combatant.token }
        };

        if (combatant.actor.isOfType("character")) {
            const exploration = combatant.actor.system.exploration;
            const actions = combatant.actor.itemTypes.action.filter((value) => exploration.includes(value.id));

            data.rollOptions.push(
                ...actions.map((value) => `${value.type}:${value.slug ?? game.pf2e.system.sluggify(value.name)}`)
            );
        }

        game.assistant.storage.process(data);
    }
});
