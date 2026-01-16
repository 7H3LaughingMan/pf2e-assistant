import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Eagle Eye Elixir"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [
            {
                or: [
                    "item:eagle-eye-elixir-lesser",
                    "item:eagle-eye-elixir-moderate",
                    "item:eagle-eye-elixir-greater",
                    "item:eagle-eye-elixir-major"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-eagle-eye-elixir"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
