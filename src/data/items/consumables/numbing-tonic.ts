import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Numbing Tonic"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [
            {
                or: [
                    "item:numbing-tonic-minor",
                    "item:numbing-tonic-lesser",
                    "item:numbing-tonic-moderate",
                    "item:numbing-tonic-greater",
                    "item:numbing-tonic-major",
                    "item:numbing-tonic-true"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-numbing-tonic"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
