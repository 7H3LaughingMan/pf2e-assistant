import { Assistant } from "assistant.ts";

export const path = ["Consumables", "Shielding Salve"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:shielding-salve"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-shielding-salve"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    }
];
