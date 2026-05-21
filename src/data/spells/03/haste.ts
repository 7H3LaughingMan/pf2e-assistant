import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";

export const path = ["Spells", "3rd Rank", "Haste"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:haste"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (data.targets.length === 0) return;
            if (!data.item?.isOfType("spell")) return;

            for (const target of data.targets) {
                await game.assistant.socket.addEffect(target.actor, PF2E_SPELL_EFFECTS["spell-effect-haste"], {
                    origin: data.speaker,
                    item: data.item,
                    target: target
                });
            }
        }
    }
];
