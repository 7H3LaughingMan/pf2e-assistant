import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Necrotic Cap"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [
            {
                or: [
                    "item:necrotic-cap-lesser",
                    "item:necrotic-cap-moderate",
                    "item:necrotic-cap-greater",
                    "item:necrotic-cap-major"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            await game.assistant.socket.addEffect(data.speaker.actor, PF2E_EQUIPMENT_EFFECTS["effect-necrotic-cap"], {
                origin: data.speaker,
                item: data.item
            });
        }
    }
];
