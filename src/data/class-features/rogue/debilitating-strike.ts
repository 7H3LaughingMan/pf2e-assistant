import { Assistant } from "assistant.ts";
import { PF2E_ASSISTANT_EFFECTS, PF2E_FEAT_EFFECTS } from "effects.js";
import { Utils } from "utils.ts";

export const path = ["Class Features", "Rogue", "Debilitating Strike"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: [{ or: ["debilitation:bloody", "second-debilitation:bloody"] }, "target:condition:off-guard"],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addCondition(data.target.actor, "persistent-damage", {
                persistent: {
                    formula: "3d6",
                    damageType: "bleed",
                    dc: 15,
                    criticalHit: false
                }
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: [{ or: ["debilitation:clumsy", "second-debilitation:clumsy"] }, "target:condition:off-guard"],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_ASSISTANT_EFFECTS["effect-vicious-debilitations-clumsy"],
                {
                    origin: data.speaker,
                    target: data.target
                }
            );
        }
    },
    {
        trigger: "damage-roll",
        predicate: [{ or: ["debilitation:critical", "second-debilitation:critical"] }, "target:condition:off-guard"],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            game.assistant.socket.rollSave(data.target.actor, "fortitude", {
                origin: data.speaker.actor,
                dc: Utils.Actor.getClassDC(data.speaker.actor),
                extraRollOptions: ["incapacitation", "critical-debilitation"],
                skipDialog: true
            });
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["critical-debilitation", "check:outcome:success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.speaker.actor,
                    PF2E_ASSISTANT_EFFECTS["effect-critical-debilitations-success"],
                    {
                        origin: data.origin,
                        target: data.speaker
                    }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["critical-debilitation", "check:outcome:failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.speaker.actor,
                    PF2E_ASSISTANT_EFFECTS["effect-critical-debilitations-failure"],
                    {
                        origin: data.origin,
                        target: data.speaker
                    }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["critical-debilitation", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.speaker.actor,
                    PF2E_ASSISTANT_EFFECTS["effect-critical-debilitations-critical-failure"],
                    {
                        origin: data.origin,
                        target: data.speaker
                    }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "damage-roll",
        predicate: [{ or: ["debilitation:enfeebled", "second-debilitation:enfeebled"] }, "target:condition:off-guard"],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_ASSISTANT_EFFECTS["effect-debilitating-strike-enfeebled"],
                {
                    origin: data.speaker,
                    target: data.target
                }
            );
        }
    },
    {
        trigger: "damage-roll",
        predicate: [{ or: ["debilitation:off-guard", "second-debilitation:off-guard"] }, "target:condition:off-guard"],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_ASSISTANT_EFFECTS["effect-precise-debilitations-off-guard"],
                {
                    origin: data.speaker,
                    target: data.target
                }
            );
        }
    },
    {
        trigger: "damage-roll",
        predicate: [
            { or: ["debilitation:precision-damage", "second-debilitation:precision-damage"] },
            "target:condition:off-guard"
        ],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.speaker.actor,
                PF2E_FEAT_EFFECTS["effect-precise-debilitations"],
                {
                    origin: data.speaker,
                    target: data.target,
                    tokenMark: {
                        slug: "precise-debilitations",
                        token: data.target.token
                    }
                }
            );
        }
    },
    {
        trigger: "damage-roll",
        predicate: [
            { or: ["debilitation:prevent-flanking", "second-debilitation:prevent-flanking"] },
            "target:condition:off-guard"
        ],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            if (Utils.Actor.hasFeat(data.speaker.actor, "tactical-debilitations")) {
                await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_FEAT_EFFECTS["effect-tactical-debilitations-no-flanking"],
                    {
                        origin: data.speaker,
                        target: data.target,
                        tokenMark: {
                            slug: "precise-debilitations",
                            token: data.target.token
                        }
                    }
                );
            } else {
                await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_FEAT_EFFECTS["effect-methodical-debilitations-flanking"],
                    {
                        origin: data.speaker,
                        target: data.target,
                        tokenMark: {
                            slug: "precise-debilitations",
                            token: data.target.token
                        }
                    }
                );
            }
        }
    },
    {
        trigger: "damage-roll",
        predicate: [
            { or: ["debilitation:prevent-reactions", "second-debilitation:prevent-reactions"] },
            "target:condition:off-guard"
        ],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_ASSISTANT_EFFECTS["effect-tactical-debilitations-no-reactions"],
                {
                    origin: data.speaker,
                    target: data.target,
                    tokenMark: {
                        slug: "precise-debilitations",
                        token: data.target.token
                    }
                }
            );
        }
    },
    {
        trigger: "damage-roll",
        predicate: [
            { or: ["debilitation:prevent-step", "second-debilitation:prevent-step"] },
            "target:condition:off-guard"
        ],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_ASSISTANT_EFFECTS["effect-eldritch-debilitations-no-steps"],
                {
                    origin: data.speaker,
                    target: data.target,
                    tokenMark: {
                        slug: "precise-debilitations",
                        token: data.target.token
                    }
                }
            );
        }
    },
    {
        trigger: "damage-roll",
        predicate: [
            { or: ["debilitation:reduce-cover", "second-debilitation:reduce-cover"] },
            "target:condition:off-guard"
        ],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_FEAT_EFFECTS["effect-methodical-debilitations-cover"],
                {
                    origin: data.speaker,
                    target: data.target,
                    tokenMark: {
                        slug: "precise-debilitations",
                        token: data.target.token
                    }
                }
            );
        }
    },
    {
        trigger: "damage-roll",
        predicate: [
            { or: ["debilitation:speed-penalty", "second-debilitation:speed-penalty"] },
            "target:condition:off-guard"
        ],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(data.target.actor, PF2E_FEAT_EFFECTS["effect-debilitating-strike"], {
                origin: data.speaker,
                target: data.target
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: [{ or: ["debilitation:stupefied", "second-debilitation:stupefied"] }, "target:condition:off-guard"],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_ASSISTANT_EFFECTS["effect-eldritch-debilitations-stupefied"],
                {
                    origin: data.speaker,
                    target: data.target,
                    tokenMark: {
                        slug: "precise-debilitations",
                        token: data.target.token
                    }
                }
            );
        }
    },
    {
        trigger: "damage-roll",
        predicate: [{ or: ["debilitation:weakness", "second-debilitation:weakness"] }, "target:condition:off-guard"],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.promptChoice(data.target.actor, {
                speaker: { actor: data.speaker.actor, token: data.speaker.token },
                target: { actor: data.target.actor, token: data.target.token },
                data: {
                    description:
                        "The target gains weakness 5 to your choice of bludgeoning, piercing, or slashing damage.",
                    choices: [
                        { label: "Bludgeoning", value: "vicious-debilitations-bludgeoning" },
                        { label: "Piercing", value: "vicious-debilitations-piercing" },
                        { label: "Slashing", value: "vicious-debilitations-slashing" }
                    ]
                }
            });
        }
    },
    {
        trigger: "choice",
        predicate: ["choice:vicious-debilitations-bludgeoning"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_FEAT_EFFECTS["effect-vicious-debilitations"],
                {
                    origin: data.speaker,
                    target: data.target,
                    choiceSet: {
                        flag: "viciousDebilitations",
                        selection: "bludgeoning"
                    }
                }
            );
        }
    },
    {
        trigger: "choice",
        predicate: ["choice:vicious-debilitations-piercing"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_FEAT_EFFECTS["effect-vicious-debilitations"],
                {
                    origin: data.speaker,
                    target: data.target,
                    choiceSet: {
                        flag: "viciousDebilitations",
                        selection: "piercing"
                    }
                }
            );
        }
    },
    {
        trigger: "choice",
        predicate: ["choice:vicious-debilitations-slashing"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_FEAT_EFFECTS["effect-vicious-debilitations"],
                {
                    origin: data.speaker,
                    target: data.target,
                    choiceSet: {
                        flag: "viciousDebilitations",
                        selection: "slashing"
                    }
                }
            );
        }
    }
];
