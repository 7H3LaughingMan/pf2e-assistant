import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Bloodhound Mask"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:bloodhound-mask-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-bloodhound-mask-lesser"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:bloodhound-mask-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-bloodhound-mask-moderate"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:bloodhound-mask-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-bloodhound-mask-greater"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    }
];
