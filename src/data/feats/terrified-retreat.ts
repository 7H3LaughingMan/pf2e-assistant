import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

export const path = ["Feats", "Terrified Retreat"];

export const actions: Assistant.Action[] = [
    {
        trigger: "skill-check",
        predicate: [
            "action:demoralize",
            "feat:terrified-retreat",
            "check:outcome:critical-success",
            { gt: ["self:level", "target:level"] }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(...(await game.assistant.socket.addCondition(data.target.actor, "fleeing")));

            return reroll;
        }
    }
];
