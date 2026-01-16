import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Blood Booster"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [{ or: ["item:blood-booster-lesser", "item:blood-booster-moderate", "item:blood-booster-greater"] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-blood-booster"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
