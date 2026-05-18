import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Impossible Cake"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:impossible-cake"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-impossible-cake"], {
                origin: data.speaker,
                item: data.item
            });
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:impossible-cake-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-impossible-cake-greater"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:impossible-cake-major"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-impossible-cake-major"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    }
];
