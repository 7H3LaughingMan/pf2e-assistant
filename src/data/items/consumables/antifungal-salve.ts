import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Antifungal Salve"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [
            {
                or: [
                    "item:antifungal-salve-lesser",
                    "item:antifungal-salve-moderate",
                    "item:antifungal-salve-greater",
                    "item:antifungal-salve-major"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-antifungal-salve"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
