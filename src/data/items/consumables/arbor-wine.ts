import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Arbor Wine"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [{ or: ["item:arbor-wine", "item:aged-arbor-wine"] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-arbor-wine"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
