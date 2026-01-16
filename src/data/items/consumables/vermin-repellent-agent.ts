import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Vermin Repellent Agent"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [
            {
                or: [
                    "item:vermin-repellent-agent-lesser",
                    "item:vermin-repellent-agent-moderate",
                    "item:vermin-repellent-agent-greater",
                    "item:vermin-repellent-agent-major"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-vermin-repellent-agent"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    }
];
