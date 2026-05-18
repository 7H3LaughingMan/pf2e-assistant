import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Applereed Mutagen"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:applereed-mutagen-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-applereed-mutagen-lesser"],
                { origin: data.speaker, item: data.item }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:applereed-mutagen-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-applereed-mutagen-moderate"],
                { origin: data.speaker, item: data.item }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:applereed-mutagen-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-applereed-mutagen-greater"],
                { origin: data.speaker, item: data.item }
            );
        }
    }
];
