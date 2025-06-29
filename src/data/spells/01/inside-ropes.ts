import { Assistant } from "assistant.ts";

export const path = ["Spells", "1st Rank", "Inside Ropes"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:inside-ropes", { gte: ["item:rank", 3] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                data.speaker.actor,
                PF2E_SPELL_EFFECTS["spell-effect-inside-ropes-3rd-rank"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    }
];
