import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Life-Boosting Oil"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [
            {
                or: [
                    "item:life-boosting-oil-lesser",
                    "item:life-boosting-oil-moderate",
                    "item:life-boosting-oil-greater",
                    "item:life-boosting-oil-major"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-life-boosting-oil"], {
                origin: data.speaker,
                item: data.item
            });
        }
    }
];
