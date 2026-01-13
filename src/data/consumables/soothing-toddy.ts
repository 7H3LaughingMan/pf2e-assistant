import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "effects.js";

export const path = ["Consumables", "Soothing Toddy"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:soothing-toddy"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-soothing-toddy"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
