import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";

export const path = ["Spells", "3rd Rank", "Angelic Wings"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:angelic-wings", { lt: ["item:rank", 5] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(
                data.speaker.actor,
                PF2E_SPELL_EFFECTS["spell-effect-angelic-wings"],
                { origin: data.speaker, item: data.item, target: data.speaker }
            );
        }
    },
    {
        trigger: "spell-cast",
        predicate: ["item:angelic-wings", { gte: ["item:rank", 5] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(
                data.speaker.actor,
                PF2E_SPELL_EFFECTS["spell-effect-angelic-wings"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: data.speaker,
                    duration: { expiry: "turn-start", sustained: false, unit: "minutes", value: 1 }
                }
            );
        }
    }
];
