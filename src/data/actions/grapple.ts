import { Assistant } from "assistant.ts";
import { PF2E_ACTIONS, PF2E_CONDITIONS } from "compendium-packs.ts";
import { GrantItemSource } from "foundry-pf2e";
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
                ...(await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                    name: "Effect: Grapple (Critical Success)",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>You are @UUID[${PF2E_CONDITIONS["restrained"]}]{Restrained} until the end of your foe's next turn unless they move or you @UUID[${PF2E_ACTIONS["escape"]}]{Escape}.</p>`
                        },
                        rules: [
                            {
                                key: "GrantItem",
                                onDeleteActions: {
                                    grantee: "restrict"
                                },
                                uuid: PF2E_CONDITIONS["restrained"]
                            } as GrantItemSource
                        ],
                        slug: "effect-grapple-critical-success",
                        publication: {
                            title: "Pathfinder Player Core",
                            license: "ORC",
                            remaster: true
                        },
                        duration: {
                            value: 1,
                            unit: "rounds",
                            expiry: "turn-end",
                            sustained: false
                        },
                        context: {
                            origin: {
                                actor: data.speaker.actor.uuid,
                                token: data.speaker.token.uuid,
                                rollOptions: data.speaker.actor.getSelfRollOptions("origin")
                            },
                            target: {
                                actor: data.target.actor.uuid,
                                token: data.target.token.uuid
                            },
                            roll: {
                                total: data.roll.total,
                                degreeOfSuccess: data.roll.degreeOfSuccess
                            }
                        }
                    },
                    img: "icons/skills/melee/unarmed-punch-fist-white.webp"
                }))
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
                ...(await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                    name: "Effect: Grapple (Success)",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>You are @UUID[${PF2E_CONDITIONS["grabbed"]}]{Grabbed} until the end of your foe's next turn unless they move or you @UUID[${PF2E_ACTIONS["escape"]}]{Escape}.</p>`
                        },
                        rules: [
                            {
                                key: "GrantItem",
                                onDeleteActions: {
                                    grantee: "restrict"
                                },
                                uuid: PF2E_CONDITIONS["grabbed"]
                            } as GrantItemSource
                        ],
                        slug: "effect-grapple-success",
                        publication: {
                            title: "Pathfinder Player Core",
                            license: "ORC",
                            remaster: true
                        },
                        duration: {
                            value: 1,
                            unit: "rounds",
                            expiry: "turn-end",
                            sustained: false
                        },
                        context: {
                            origin: {
                                actor: data.speaker.actor.uuid,
                                token: data.speaker.token.uuid,
                                rollOptions: data.speaker.actor.getSelfRollOptions("origin")
                            },
                            target: {
                                actor: data.target.actor.uuid,
                                token: data.target.token.uuid
                            },
                            roll: {
                                total: data.roll.total,
                                degreeOfSuccess: data.roll.degreeOfSuccess
                            }
                        }
                    },
                    img: "icons/skills/melee/unarmed-punch-fist-white.webp"
                }))
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

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Grapple (Success)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>You are @UUID[${PF2E_CONDITIONS["grabbed"]}]{Grabbed} until the end of your foe's next turn unless they move or you @UUID[${PF2E_ACTIONS["escape"]}]{Escape}.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["grabbed"]
                        } as GrantItemSource
                    ],
                    slug: "effect-grapple-success",
                    publication: {
                        title: "Pathfinder Player Core",
                        license: "ORC",
                        remaster: true
                    },
                    duration: {
                        value: 1,
                        unit: "rounds",
                        expiry: "turn-end",
                        sustained: false
                    },
                    context: {
                        origin: {
                            actor: data.speaker.actor.uuid,
                            token: data.speaker.token.uuid,
                            rollOptions: data.speaker.actor.getSelfRollOptions("origin")
                        },
                        target: {
                            actor: data.target.actor.uuid,
                            token: data.target.token.uuid
                        }
                    }
                },
                img: "icons/skills/melee/unarmed-punch-fist-white.webp"
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
