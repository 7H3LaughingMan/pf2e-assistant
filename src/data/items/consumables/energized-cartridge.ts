import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Energized Cartridge"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:energized-cartridge"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            await game.assistant.socket.addEffect(
                data.speaker.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-energized-cartridge"],
                {
                    origin: data.speaker,
                    item: data.item
                }
            );
        }
    }
];
