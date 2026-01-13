import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "effects.js";

export const path = ["Spells", "1st Rank", "Tailwind"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:tailwind", { lt: ["item:rank", 2] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_SPELL_EFFECTS["spell-effect-tailwind"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    },
    {
        trigger: "spell-cast",
        predicate: ["item:tailwind", { gte: ["item:rank", 2] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_SPELL_EFFECTS["spell-effect-tailwind-8-hours"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
