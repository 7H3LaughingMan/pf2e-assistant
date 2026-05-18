import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Fire and Iceberg"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:fire-and-iceberg"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-fire-and-iceberg"], {
                origin: data.speaker,
                item: data.item
            });
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:fire-and-iceberg-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-fire-and-iceberg-greater"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:fire-and-iceberg-major"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-fire-and-iceberg-major"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    }
];
