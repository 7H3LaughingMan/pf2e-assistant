import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Silvertongue Mutagen"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:silvertongue-mutagen-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-silvertongue-mutagen-lesser"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:silvertongue-mutagen-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-silvertongue-mutagen-moderate"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:silvertongue-mutagen-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-silvertongue-mutagen-greater"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:silvertongue-mutagen-major"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-silvertongue-mutagen-major"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    }
];
