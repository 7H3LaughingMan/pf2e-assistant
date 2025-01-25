import { Assistant } from "assistant.ts";

export const path = ["Consumables", "Assassin Vine Wine"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consume",
        predicate: [
            {
                or: ["item:slug:assassin-vine-wine", "item:slug:aged-assassin-vine-wine"]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-assassin-vine-wine"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                }
            );
        }
    }
];
