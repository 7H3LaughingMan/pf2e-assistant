import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";
import { EphemeralEffectRuleElement, TokenMarkRuleElement } from "foundry-pf2e";
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
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Feint (Critical Success)",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>You throw your enemy's defenses against you entirely off. The target is @UUID[${PF2E_CONDITIONS["off-guard"]}]{Off-Guard} against melee attacks that you attempt against it until the end of your next turn.</p>`
                        },
                        rules: [
                            {
                                key: "TokenMark",
                                slug: "feint",
                                uuid: data.target.token.uuid
                            } as TokenMarkRuleElement["_source"],
                            {
                                key: "EphemeralEffect",
                                predicate: ["target:mark:feint"],
                                selectors: ["melee-attack-roll", "melee-damage"],
                                uuid: PF2E_CONDITIONS["off-guard"]
                            } as EphemeralEffectRuleElement["_source"]
                        ],
                        slug: "effect-feint-critical-success",
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
                        context: null
                    },
                    img: "icons/skills/social/theft-pickpocket-bribery-brown.webp"
                }))
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
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Feint (Success)",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>Your foe is fooled, but only momentarily. The target is @UUID[${PF2E_CONDITIONS["off-guard"]}]{Off-Guard} against the next melee attack that you attempt against it before the end of your current turn.</p>`
                        },
                        rules: [
                            {
                                key: "TokenMark",
                                slug: "feint",
                                uuid: data.target.token.uuid
                            } as TokenMarkRuleElement["_source"],
                            {
                                key: "EphemeralEffect",
                                predicate: ["target:mark:feint"],
                                selectors: ["melee-attack-roll", "melee-damage"],
                                uuid: PF2E_CONDITIONS["off-guard"]
                            } as EphemeralEffectRuleElement["_source"]
                        ],
                        slug: "effect-feint-success",
                        publication: {
                            title: "Pathfinder Player Core",
                            license: "ORC",
                            remaster: true
                        },
                        duration: {
                            value: 0,
                            unit: "rounds",
                            expiry: "turn-end",
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
                    img: "icons/skills/social/theft-pickpocket-bribery-brown.webp"
                }))
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
                ...(await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                    name: "Effect: Feint (Critical Failure)",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>Your foe's feint backfired, They are now @UUID[${PF2E_CONDITIONS["off-guard"]}]{Off-Guard} against your melee attacks until the end of their next turn.</p>`
                        },
                        rules: [
                            {
                                key: "TokenMark",
                                slug: "feint",
                                uuid: data.speaker.token.uuid
                            } as TokenMarkRuleElement["_source"],
                            {
                                key: "EphemeralEffect",
                                predicate: ["target:mark:feint"],
                                selectors: ["melee-attack-roll", "melee-damage"],
                                uuid: PF2E_CONDITIONS["off-guard"]
                            } as EphemeralEffectRuleElement["_source"]
                        ],
                        slug: "effect-feint-critical-failure",
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
                    img: "icons/skills/social/theft-pickpocket-bribery-brown.webp"
                }))
            );

            return reroll;
        }
    }
];
