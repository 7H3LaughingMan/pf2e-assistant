import { Assistant } from "assistant.ts";
import { PF2E_ASSISTANT_EFFECTS } from "effects.js";

export const path = ["Consumables", "Mistform Elixir"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:mistform-elixir-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_ASSISTANT_EFFECTS["effect-mistform-elixir-lesser"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:mistform-elixir-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_ASSISTANT_EFFECTS["effect-mistform-elixir-moderate"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:mistform-elixir-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_ASSISTANT_EFFECTS["effect-mistform-elixir-greater"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    }
];
