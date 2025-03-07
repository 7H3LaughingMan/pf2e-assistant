import { Assistant } from "assistant.ts";

export const path = ["Consumables", "Soothing Tonic"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:soothing-tonic-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-soothing-tonic-lesser"],
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
        predicate: ["item:soothing-tonic-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-soothing-tonic-moderate"],
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
        predicate: ["item:soothing-tonic-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-soothing-tonic-greater"],
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
        predicate: ["item:soothing-tonic-major"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-soothing-tonic-major"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
