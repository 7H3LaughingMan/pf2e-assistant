import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

export const path = ["Spells", "1st Rank", "Aqueous Blast"];

export const actions: Assistant.Action[] = [
    {
        trigger: "attack-roll",
        predicate: ["item:type:spell", "item:aqueous-blast", "check:outcome:critical-success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...((await game.assistant.socket.toggleCondition(data.target.actor, "prone", { active: true })) ?? [])
            );

            return reroll;
        }
    }
];
