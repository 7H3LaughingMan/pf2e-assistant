import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "effects.js";

export const path = ["Consumables", "Soothing Tonic"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [
            {
                or: [
                    "item:soothing-tonic-lesser",
                    "item:soothing-tonic-moderate",
                    "item:soothing-tonic-greater",
                    "item:soothing-tonic-major"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-soothing-tonic"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
