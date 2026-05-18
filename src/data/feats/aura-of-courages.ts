import { Assistant } from "assistant.ts";

export const path = ["Feats", "Aura of Courage"];

export const actions: Assistant.Action[] = [
    {
        trigger: "end-turn",
        predicate: ["champions-aura", "feat:aura-of-courage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.speaker.token.scene) return;

            const championsAura = data.speaker.token.auras.get("champions-aura");
            if (championsAura) {
                const allies = data.speaker.token.scene.tokens.filter(
                    (token) =>
                        token.actor !== null &&
                        token.actor.isAllyOf(data.speaker!.actor) &&
                        token.actor.uuid !== data.speaker!.actor.uuid
                );
                const inAura = allies.filter((token) => championsAura.containsToken(token));

                for (const ally of inAura) {
                    if (!ally.actor) continue;

                    await game.assistant.socket.decreaseCondition(ally.actor, "frightened");
                }
            }
        }
    }
];
