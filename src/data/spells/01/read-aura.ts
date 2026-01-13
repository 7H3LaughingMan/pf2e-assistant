import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "effects.js";

export const path = ["Spells", "1st Rank", "Read Aura"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:read-aura"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_SPELL_EFFECTS["spell-effect-read-aura"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
