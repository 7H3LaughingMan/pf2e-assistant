import { Assistant } from "assistant.ts";

export const path = ["Consumables", "Chromatic Jellyfish Oil"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [
            {
                or: [
                    "item:chromatic-jellyfish-oil-lesser",
                    "item:chromatic-jellyfish-oil-moderate",
                    "item:chromatic-jellyfish-oil-greater"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-chromatic-jellyfish-oil"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    }
];
