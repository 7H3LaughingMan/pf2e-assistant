import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";

export const path = ["Spells", "1st Rank", "Athletic Rush"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:athletic-rush"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(
                data.speaker.actor,
                PF2E_SPELL_EFFECTS["spell-effect-athletic-rush"],
                { origin: data.speaker, item: data.item, target: data.speaker }
            );
        }
    }
];
