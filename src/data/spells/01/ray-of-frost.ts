import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

export const path = ["Spells", "1st Rank", "Ray of Frost"];

export const actions: Assistant.Action[] = [
    {
        trigger: "attack-roll",
        predicate: ["item:type:spell", "item:ray-of-frost", "check:outcome:critical-success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_SPELL_EFFECTS["spell-effect-ray-of-frost"],
                    {
                        origin: data.speaker,
                        item: data.item,
                        target: data.speaker,
                        roll: data.roll
                    }
                ))
            );

            return reroll;
        }
    }
];
