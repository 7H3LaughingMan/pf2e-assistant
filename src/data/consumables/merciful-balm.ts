import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "effects.js";

export const path = ["Consumables", "Merciful Balm"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:merciful-balm"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-merciful-balm"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
