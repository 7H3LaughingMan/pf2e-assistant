import { Assistant } from "assistant.ts";

export const path = ["Consumables", "Silvertongue Mutagen"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consume",
        predicate: ["item:slug:silvertongue-mutagen-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-silvertongue-mutagen-lesser"],
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
        predicate: ["item:slug:silvertongue-mutagen-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-silvertongue-mutagen-moderate"],
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
        predicate: ["item:slug:silvertongue-mutagen-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-silvertongue-mutagen-greater"],
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
        predicate: ["item:slug:silvertongue-mutagen-major"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-silvertongue-mutagen-major"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    }
];
