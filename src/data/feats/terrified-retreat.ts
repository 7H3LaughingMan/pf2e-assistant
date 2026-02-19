import { isRolledCheckRoll } from "@7h3laughingman/pf2e-helpers/utilities";
import { Assistant } from "assistant.ts";

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
            if (!isRolledCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(...(await game.assistant.socket.addCondition(data.target.actor, "fleeing")));

            return reroll;
        }
    }
];
