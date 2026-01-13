import { Assistant } from "assistant.ts";
import { PF2E_ASSISTANT_EFFECTS } from "effects.js";
import { Utils } from "utils.ts";

export const path = ["Actions", "Grapple"];

export const actions: Assistant.Action[] = [
    {
        trigger: "skill-check",
        predicate: ["action:grapple", "check:outcome:critical-success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_ASSISTANT_EFFECTS["effect-grapple-critical-success"],
                    { origin: data.speaker, target: data.target, roll: data.roll }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["action:grapple", "check:outcome:success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_ASSISTANT_EFFECTS["effect-grapple-success"],
                    { origin: data.speaker, target: data.target, roll: data.roll }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["action:grapple", "check:outcome:failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.addItem.push(
                ...(await game.assistant.socket.deleteEmbeddedItems(
                    Utils.Actor.getEffects(
                        data.target.actor,
                        ["effect-grapple-critical-success", "effect-grapple-success"],
                        { origin: data.speaker.actor, target: data.target.actor }
                    )
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["action:grapple", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.addItem.push(
                ...(await game.assistant.socket.deleteEmbeddedItems(
                    Utils.Actor.getEffects(
                        data.target.actor,
                        ["effect-grapple-critical-success", "effect-grapple-success"],
                        { origin: data.speaker.actor, target: data.target.actor }
                    )
                ))
            );

            reroll.deleteChatMessage.push(
                ...(await game.assistant.socket.promptChoice(data.target.actor, {
                    speaker: { actor: data.target.actor, token: data.target.token },
                    target: { actor: data.speaker.actor, token: data.speaker.token },
                    data: {
                        description: "My foe has critically failed to grapple me, what should I do?",
                        choices: [
                            { label: "Grab Foe", value: "grapple-foe" },
                            { label: "Force Foe Prone", value: "prone-foe" }
                        ]
                    }
                }))
            );

            return reroll;
        }
    },
    {
        trigger: "choice",
        predicate: ["choice:grapple-foe"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(data.target.actor, PF2E_ASSISTANT_EFFECTS["effect-grapple-success"], {
                origin: data.speaker,
                target: data.target
            });
        }
    },
    {
        trigger: "choice",
        predicate: ["choice:prone-foe"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.toggleCondition(data.target.actor, "prone", { active: true });
        }
    }
];
