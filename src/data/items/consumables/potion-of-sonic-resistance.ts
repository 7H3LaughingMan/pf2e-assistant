import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Potion of Sonic Resistance"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [
            {
                or: [
                    "item:potion-of-sonic-resistance-lesser",
                    "item:potion-of-sonic-resistance-moderate",
                    "item:potion-of-sonic-resistance-greater"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-potion-of-sonic-resistance"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    }
];
