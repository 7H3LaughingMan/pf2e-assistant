import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "effects.js";

export const path = ["Spells", "1st Rank", "Musical Accompaniment"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:musical-accompaniment", { lt: ["item:rank", 2] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(
                data.speaker.actor,
                PF2E_SPELL_EFFECTS["spell-effect-musical-accompaniment"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: data.speaker
                }
            );
        }
    },
    {
        trigger: "spell-cast",
        predicate: ["item:musical-accompaniment", { gte: ["item:rank", 2] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(
                data.speaker.actor,
                PF2E_SPELL_EFFECTS["spell-effect-musical-accompaniment"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: data.speaker,
                    duration: { expiry: "turn-start", sustained: false, unit: "minutes", value: 10 }
                }
            );
        }
    }
];
