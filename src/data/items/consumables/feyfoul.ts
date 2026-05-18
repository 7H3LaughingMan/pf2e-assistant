import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Feyfoul"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:feyfoul-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-feyfoul-lesser"], {
                origin: data.speaker,
                item: data.item
            });
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:feyfoul-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-feyfoul-moderate"], {
                origin: data.speaker,
                item: data.item
            });
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:feyfoul-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-feyfoul-greater"], {
                origin: data.speaker,
                item: data.item
            });
        }
    }
];
