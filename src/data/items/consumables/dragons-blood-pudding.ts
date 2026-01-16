import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Dragon's Blood Pudding"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [{ or: ["item:dragons-blood-pudding-moderate", "item:dragons-blood-pudding-greater"] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-dragons-blood-pudding"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:dragons-blood-pudding-major"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-dragons-blood-pudding-major"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    }
];
