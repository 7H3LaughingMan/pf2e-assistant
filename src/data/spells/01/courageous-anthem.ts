import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

export const path = ["Spells", "1st Rank", "Courageous Anthem"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:courageous-anthem"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            for (const target of data.targets) {
                if (Utils.Alliance.isAllyOf(data.speaker.actor, target.actor) || data.speaker.actor === target.actor) {
                    await game.assistant.socket.addEffect(
                        target.actor,
                        PF2E_SPELL_EFFECTS["spell-effect-courageous-anthem"],
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
