import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";

export const path = ["Spells", "1st Rank", "Angelic Halo"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:angelic-halo"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(data.speaker.actor, PF2E_SPELL_EFFECTS["aura-angelic-halo"], {
                origin: data.speaker,
                item: data.item,
                target: data.speaker
            });
        }
    }
];
