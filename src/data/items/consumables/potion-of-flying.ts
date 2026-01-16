import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Potion of Flying"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:potion-of-flying-standard"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-potion-of-flying-standard"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:potion-of-flying-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-potion-of-flying-greater"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    }
];
