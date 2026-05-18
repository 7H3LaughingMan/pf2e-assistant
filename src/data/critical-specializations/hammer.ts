import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

export const path = ["Critical Specializations", "Hammer"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "critical-specialization", "item:group:hammer"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            game.assistant.socket.rollSave(data.target.actor, "fortitude", {
                origin: data.speaker.actor,
                dc: Utils.Actor.getClassDC(data.speaker.actor),
                extraRollOptions: ["critical-specialization", "item:group:hammer"]
            });
        }
    },
    {
        trigger: "saving-throw",
        predicate: [
            { or: ["check:outcome:failure", "check:outcome:critical-failure"] },
            "critical-specialization",
            "item:group:hammer"
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...((await game.assistant.socket.toggleCondition(data.speaker.actor, "prone", { active: true })) ?? [])
            );

            return reroll;
        }
    }
];
