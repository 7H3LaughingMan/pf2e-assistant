import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Potion of Quickness"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:potion-of-quickness"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_SPELL_EFFECTS["spell-effect-haste"], {
                origin: data.speaker,
                item: data.item
            });
        }
    }
];
