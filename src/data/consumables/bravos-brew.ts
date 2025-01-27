import { Assistant } from "assistant.ts";

export const path = ["Consumables", "Bravo's Brew"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consume",
        predicate: [
            {
                or: [
                    "item:bravos-brew-lesser",
                    "item:bravos-brew-moderate",
                    "item:bravos-brew-greater"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-bravos-brew"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    }
];
