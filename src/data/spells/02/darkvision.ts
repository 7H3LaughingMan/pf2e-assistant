import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";

export const path = ["Spells", "2nd Rank", "Darkvision"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:darkvision", { lt: ["item:rank", 3] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(data.speaker.actor, PF2E_SPELL_EFFECTS["spell-effect-darkvision"], {
                origin: data.speaker,
                item: data.item,
                target: data.speaker
            });
        }
    },
    {
        trigger: "spell-cast",
        predicate: ["item:darkvision", { gte: ["item:rank", 3] }, { lt: ["item:rank", 5] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_SPELL_EFFECTS["spell-effect-darkvision"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    },
    {
        trigger: "spell-cast",
        predicate: ["item:darkvision", { gte: ["item:rank", 5] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_SPELL_EFFECTS["spell-effect-darkvision-24-hours"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    }
];
