import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";

export const path = ["Spells", "1st Rank", "Boost Eidolon"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:boost-eidolon"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(data.target.actor, PF2E_SPELL_EFFECTS["spell-effect-boost-eidolon"], {
                origin: data.speaker,
                item: data.item,
                target: data.target
            });
        }
    }
];
