import { Assistant } from "assistant.ts";
import { PF2E_ASSISTANT_EFFECTS } from "effects.js";
import { Utils } from "utils.ts";

export const path = ["Actions", "Feint"];

export const actions: Assistant.Action[] = [
    {
        trigger: "skill-check",
        predicate: ["action:feint", "check:outcome:critical-success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.speaker.actor,
                    PF2E_ASSISTANT_EFFECTS["effect-feint-critical-success"],
                    {
                        origin: data.speaker,
                        target: data.target,
                        roll: data.roll,
                        tokenMark: { slug: "feint", token: data.target.token }
                    }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["action:feint", "check:outcome:success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.speaker.actor,
                    PF2E_ASSISTANT_EFFECTS["effect-feint-critical-success"],
                    {
                        origin: data.speaker,
                        target: data.target,
                        roll: data.roll,
                        tokenMark: { slug: "feint", token: data.target.token }
                    }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["action:feint", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_ASSISTANT_EFFECTS["effect-feint-critical-success"],
                    {
                        origin: data.speaker,
                        target: data.speaker,
                        roll: data.roll,
                        tokenMark: { slug: "feint", token: data.speaker.token }
                    }
                ))
            );

            return reroll;
        }
    }
];
