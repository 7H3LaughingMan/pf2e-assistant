import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Insight Coffee"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [
            { or: ["item:insight-coffee-lesser", "item:insight-coffee-moderate", "item:insight-coffee-greater"] }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-insight-coffee"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
