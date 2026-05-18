import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Bravo's Brew"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [{ or: ["item:bravos-brew-lesser", "item:bravos-brew-moderate", "item:bravos-brew-greater"] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-bravos-brew"], {
                origin: data.speaker,
                item: data.item
            });
        }
    }
];
