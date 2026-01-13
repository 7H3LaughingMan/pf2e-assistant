import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "effects.js";

export const path = ["Consumables", "Elixir of Life"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [
            {
                or: [
                    "item:elixir-of-life-minor",
                    "item:elixir-of-life-lesser",
                    "item:elixir-of-life-moderate",
                    "item:elixir-of-life-greater",
                    "item:elixir-of-life-major",
                    "item:elixir-of-life-true"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-elixir-of-life"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
