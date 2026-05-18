import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Ascendant Dragon Spirit"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:ascendant-dragon-spirit"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-ascendant-dragon-spirit"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    }
];
