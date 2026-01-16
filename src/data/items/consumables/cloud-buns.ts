import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Cloud Buns"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:cloud-buns"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-cloud-buns"], {
                origin: data.speaker,
                item: data.item
            });
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:cloud-buns-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-cloud-buns-greater"], {
                origin: data.speaker,
                item: data.item
            });
        }
    }
];
