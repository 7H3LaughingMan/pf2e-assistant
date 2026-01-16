import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Potion of Emergency Escape"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:potion-of-emergency-escape"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-potion-of-emergency-escape"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    }
];
