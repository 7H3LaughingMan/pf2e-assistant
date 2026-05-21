import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

export const path = ["Spells", "1st Rank", "Song of Strength"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:song-of-strength"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            for (const target of data.targets) {
                if (Utils.Alliance.isAllyOf(data.speaker.actor, target.actor) || data.speaker.actor === target.actor) {
                    await game.assistant.socket.addEffect(
                        target.actor,
                        PF2E_SPELL_EFFECTS["spell-effect-song-of-strength"],
                        {
                            origin: data.speaker,
                            item: data.item,
                            target: target
                        }
                    );
                }
            }
        }
    }
];
