import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Ablative Armor Plating"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:ablative-armor-plating-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-ablative-armor-plating-lesser"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:ablative-armor-plating-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-ablative-armor-plating-moderate"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:ablative-armor-plating-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-ablative-armor-plating-greater"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:ablative-armor-plating-major"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-ablative-armor-plating-major"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:ablative-armor-plating-true"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-ablative-armor-plating-true"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    }
];
