import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Phoenix Flask"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:phoenix-flask"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-phoenix-flask"], {
                origin: data.speaker,
                item: data.item
            });
        }
    }
];
