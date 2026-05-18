import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Juggernaut Mutagen"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:juggernaut-mutagen-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-juggernaut-mutagen-lesser"],
                { origin: data.speaker, item: data.item }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:juggernaut-mutagen-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-juggernaut-mutagen-moderate"],
                { origin: data.speaker, item: data.item }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:juggernaut-mutagen-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-juggernaut-mutagen-greater"],
                { origin: data.speaker, item: data.item }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:juggernaut-mutagen-major"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-juggernaut-mutagen-major"],
                { origin: data.speaker, item: data.item }
            );
        }
    }
];
