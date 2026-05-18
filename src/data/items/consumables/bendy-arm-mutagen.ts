import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Bendy-Arm Mutagen"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:bendy-arm-mutagen-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-bendy-arm-mutagen-lesser"],
                { origin: data.speaker, item: data.item }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:bendy-arm-mutagen-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-bendy-arm-mutagen-moderate"],
                { origin: data.speaker, item: data.item }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:bendy-arm-mutagen-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-bendy-arm-mutagen-greater"],
                { origin: data.speaker, item: data.item }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:bendy-arm-mutagen-major"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-bendy-arm-mutagen-major"],
                { origin: data.speaker, item: data.item }
            );
        }
    }
];
