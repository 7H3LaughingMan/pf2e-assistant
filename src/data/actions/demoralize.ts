import { Assistant } from "assistant.ts";
import { PF2E_ACTIONS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

export const path = ["Actions", "Demoralize"];

export const actions: Assistant.Action[] = [
    {
        trigger: "skill-check",
        predicate: ["action:demoralize", "check:outcome:critical-success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            if (
                Utils.Actor.hasEffect(data.target.actor, "effect-demoralize-immunity", { origin: data.speaker.actor })
            ) {
                ui.notifications.warn(
                    `The target is temporarily immune to further attempts to Demoralize from ${data.speaker.actor.name}.`
                );
                return;
            }

            // Check Mindless & Mental Immunity
            if (
                !data.target.actor.traits.has("mindless") &&
                !data.target.actor.attributes.immunities.some((i) => i.type === "mental")
            ) {
                reroll.updateCondition.push(
                    ...((await game.assistant.socket.addCondition(data.target.actor, "frightened", { value: 2 })) ?? [])
                );
            }

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                    name: "Effect: Demoralize Immunity",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>Granted when someone uses @UUID[${PF2E_ACTIONS["demoralize"]}]{Demoralize} on you, rendering you temporarily immune to further attempts to Demoralize from them for the duration.</p>`
                        },
                        slug: "effect-demoralize-immunity",
                        publication: {
                            title: "Pathfinder Player Core",
                            license: "ORC",
                            remaster: true
                        },
                        duration: {
                            value: 10,
                            unit: "minutes",
                            expiry: "turn-start",
                            sustained: false
                        },
                        context: {
                            origin: {
                                actor: data.speaker.actor.uuid,
                                token: data.speaker.token.uuid
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
                    img: "icons/skills/social/intimidation-impressing.webp"
                }))
            );

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["action:demoralize", "check:outcome:success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            if (
                Utils.Actor.hasEffect(data.target.actor, "effect-demoralize-immunity", { origin: data.speaker.actor })
            ) {
                ui.notifications.warn(
                    `The target is temporarily immune to further attempts to Demoralize from ${data.speaker.actor.name}.`
                );
                return;
            }

            // Check Mindless & Mental Immunity
            if (
                !data.target.actor.traits.has("mindless") &&
                !data.target.actor.attributes.immunities.some((i) => i.type === "mental")
            ) {
                reroll.updateCondition.push(
                    ...((await game.assistant.socket.addCondition(data.target.actor, "frightened", { value: 1 })) ?? [])
                );
            }

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                    name: "Effect: Demoralize Immunity",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>Granted when someone uses @UUID[${PF2E_ACTIONS["demoralize"]}]{Demoralize} on you, rendering you temporarily immune to further attempts to Demoralize from them for the duration.</p>`
                        },
                        slug: "effect-demoralize-immunity",
                        publication: {
                            title: "Pathfinder Player Core",
                            license: "ORC",
                            remaster: true
                        },
                        duration: {
                            value: 10,
                            unit: "minutes",
                            expiry: "turn-start",
                            sustained: false
                        },
                        context: {
                            origin: {
                                actor: data.speaker.actor.uuid,
                                token: data.speaker.token.uuid
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
                    img: "icons/skills/social/intimidation-impressing.webp"
                }))
            );

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["action:demoralize", { or: ["check:outcome:failure", "check:outcome:critical-failure"] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                    name: "Effect: Demoralize Immunity",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>Granted when someone uses @UUID[${PF2E_ACTIONS["demoralize"]}]{Demoralize} on you, rendering you temporarily immune to further attempts to Demoralize from them for the duration.</p>`
                        },
                        slug: "effect-demoralize-immunity",
                        publication: {
                            title: "Pathfinder Player Core",
                            license: "ORC",
                            remaster: true
                        },
                        duration: {
                            value: 10,
                            unit: "minutes",
                            expiry: "turn-start",
                            sustained: false
                        },
                        context: {
                            origin: {
                                actor: data.speaker.actor.uuid,
                                token: data.speaker.token.uuid
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
                    img: "icons/skills/social/intimidation-impressing.webp"
                }))
            );

            return reroll;
        }
    }
];
