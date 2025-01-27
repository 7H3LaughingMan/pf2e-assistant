import { Assistant } from "assistant.ts";

export const path = ["Spells", "3rd Rank", "Deep Sight"];

export const actions: Assistant.Action[] = [
    {
        trigger: "action",
        predicate: ["item:deep-sight", { lt: ["item:rank", 6] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(
                data.speaker.actor,
                PF2E_SPELL_EFFECTS["spell-effect-deep-sight"],
                { origin: data.speaker, item: data.item, target: data.speaker }
            );
        }
    },
    {
        trigger: "action",
        predicate: ["item:angelic-wings", { gte: ["item:rank", 7] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(
                data.speaker.actor,
                PF2E_SPELL_EFFECTS["spell-effect-deep-sight"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: data.speaker,
                    duration: { expiry: "turn-start", sustained: false, unit: "days", value: 1 }
                }
            );
        }
    }
];
