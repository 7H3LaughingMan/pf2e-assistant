import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "effects.js";

export const path = ["Consumables", "Potency Crystal"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: [{ or: ["item:potency-crystal", "item:potency-crystal-greater", "item:potency-crystal-major"] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;

            await game.assistant.socket.addEffect(
                data.speaker.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-potency-crystal"],
                { origin: data.speaker, item: data.item, target: data.speaker }
            );
        }
    }
];
