import { Assistant } from "assistant.ts";

export const path = ["Consumables", "Prey Mutagen"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consume",
        predicate: ["item:slug:prey-mutagen-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-prey-mutagen-lesser"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    },
    {
        trigger: "consume",
        predicate: ["item:slug:prey-mutagen-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-prey-mutagen-moderate"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    },
    {
        trigger: "consume",
        predicate: ["item:slug:prey-mutagen-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-prey-mutagen"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    },
    {
        trigger: "consume",
        predicate: ["item:slug:prey-mutagen-major"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-prey-mutagen"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    }
];
