import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";

export const path = ["Spells", "4th Rank", "Darkened Sight"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:darkened-sight"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_SPELL_EFFECTS["spell-effect-darkened-sight"],
                { origin: data.speaker, item: data.item, target: data.target }
            );
        }
    }
];
