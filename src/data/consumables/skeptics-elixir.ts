import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "effects.js";

export const path = ["Consumables", "Skeptic's Elixir"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:skeptics-elixir-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-skeptics-elixir-lesser"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:skeptics-elixir-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-skeptics-elixir-moderate"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:skeptics-elixir-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-skeptics-elixir-greater"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    }
];
