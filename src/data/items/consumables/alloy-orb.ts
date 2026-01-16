import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Alloy Orb"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:alloy-orb-low-grade"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-alloy-orb-low-grade"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:alloy-orb-standard-grade"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-alloy-orb-standard-grade"],
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
        predicate: ["item:alloy-orb-exquisite-standard-grade"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-alloy-orb-exquisite-standard-grade"],
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
        predicate: ["item:alloy-orb-high-grade"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-alloy-orb-high-grade"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:alloy-orb-exquisite-high-grade"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-alloy-orb-exquisite-high-grade"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    }
];
