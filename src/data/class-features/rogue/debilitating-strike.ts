import { isRolledCheckRoll, SYSTEM } from "@7h3laughingman/pf2e-helpers/utilities";
import { GrantItemSource } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { PF2E_ACTIONS, PF2E_CLASS_FEATURES, PF2E_CONDITIONS, PF2E_FEAT_EFFECTS, PF2E_FEATS } from "compendium-packs.ts";
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

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Vicious Debilitations (Clumsy)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>Granted by @UUID[${PF2E_FEATS["vicious-debilitations"]}]{Vicious Debilitations}</p><p>The target becomes @UUID[${PF2E_CONDITIONS["clumsy"]}]{Clumsy 1}.</p>`
                    },
                    publication: {
                        title: "Pathfinder Player Core",
                        license: "ORC",
                        remaster: true
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["clumsy"]
                        } as GrantItemSource
                    ],
                    slug: "effect-vicious-debilitations-clumsy",
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
                img: "icons/skills/melee/strike-dagger-white-orange.webp"
            });
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
            if (!isRolledCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Critical Debilitations (Success)",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>Granted by @UUID[${PF2E_FEATS["critical-debilitation"]}]{Critical Debilitation}</p><p>The target is @UUID[${PF2E_CONDITIONS["slowed"]}]{Slowed 1} until the end of your next turn.</p>`
                        },
                        publication: {
                            title: "Pathfinder Player Core",
                            license: "ORC",
                            remaster: true
                        },
                        rules: [
                            {
                                key: "GrantItem",
                                onDeleteActions: {
                                    grantee: "restrict"
                                },
                                uuid: PF2E_CONDITIONS["slowed"]
                            } as GrantItemSource
                        ],
                        slug: "effect-critical-debilitations-success",
                        duration: {
                            value: 1,
                            unit: "rounds",
                            expiry: "turn-end",
                            sustained: false
                        },
                        context: {
                            origin: {
                                actor: data.origin.actor.uuid,
                                token: data.origin.token.uuid,
                                rollOptions: data.origin.actor.getSelfRollOptions("origin")
                            },
                            target: {
                                actor: data.speaker.actor.uuid,
                                token: data.speaker.token.uuid
                            },
                            roll: {
                                total: data.roll.total,
                                degreeOfSuccess: data.roll.degreeOfSuccess
                            }
                        }
                    },
                    img: "icons/skills/melee/strike-dagger-blood-red.webp"
                }))
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
            if (!isRolledCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Critical Debilitations (Failure)",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>Granted by @UUID[${PF2E_FEATS["critical-debilitation"]}]{Critical Debilitation}</p><p>The target is @UUID[${PF2E_CONDITIONS["slowed"]}]{Slowed 2} until the end of your next turn.</p>`
                        },
                        publication: {
                            title: "Pathfinder Player Core",
                            license: "ORC",
                            remaster: true
                        },
                        rules: [
                            {
                                alterations: [
                                    {
                                        mode: "override",
                                        property: "badge-value",
                                        value: 2
                                    }
                                ],
                                key: "GrantItem",
                                onDeleteActions: {
                                    grantee: "restrict"
                                },
                                uuid: PF2E_CONDITIONS["slowed"]
                            } as GrantItemSource
                        ],
                        slug: "effect-critical-debilitations-failure",
                        duration: {
                            value: 1,
                            unit: "rounds",
                            expiry: "turn-end",
                            sustained: false
                        },
                        context: {
                            origin: {
                                actor: data.origin.actor.uuid,
                                token: data.origin.token.uuid,
                                rollOptions: data.origin.actor.getSelfRollOptions("origin")
                            },
                            target: {
                                actor: data.speaker.actor.uuid,
                                token: data.speaker.token.uuid
                            },
                            roll: {
                                total: data.roll.total,
                                degreeOfSuccess: data.roll.degreeOfSuccess
                            }
                        }
                    },
                    img: "icons/skills/melee/strike-dagger-blood-red.webp"
                }))
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
            if (!isRolledCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Critical Debilitations (Critical Failure)",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>Granted by @UUID[${PF2E_FEATS["critical-debilitation"]}]{Critical Debilitation}</p><p>The target is @UUID[${PF2E_CONDITIONS["paralyzed"]}]{Paralyzed} until the end of your next turn.</p>`
                        },
                        publication: {
                            title: "Pathfinder Player Core",
                            license: "ORC",
                            remaster: true
                        },
                        rules: [
                            {
                                key: "GrantItem",
                                onDeleteActions: {
                                    grantee: "restrict"
                                },
                                uuid: PF2E_CONDITIONS["paralyzed"]
                            } as GrantItemSource
                        ],
                        slug: "effect-critical-debilitations-critical-failure",
                        duration: {
                            value: 1,
                            unit: "rounds",
                            expiry: "turn-end",
                            sustained: false
                        },
                        context: {
                            origin: {
                                actor: data.origin.actor.uuid,
                                token: data.origin.token.uuid,
                                rollOptions: data.origin.actor.getSelfRollOptions("origin")
                            },
                            target: {
                                actor: data.speaker.actor.uuid,
                                token: data.speaker.token.uuid
                            },
                            roll: {
                                total: data.roll.total,
                                degreeOfSuccess: data.roll.degreeOfSuccess
                            }
                        }
                    },
                    img: "icons/skills/melee/strike-dagger-blood-red.webp"
                }))
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

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Debilitating Strike (Enfeebled)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>Granted by @UUID[${PF2E_CLASS_FEATURES["debilitating-strike"]}]{Debilitating Strike}</p><p>The target becomes @UUID[${PF2E_CONDITIONS["enfeebled"]}]{Enfeebled 1}.</p>`
                    },
                    publication: {
                        title: "Pathfinder Core Rulebook",
                        license: "ORC",
                        remaster: true
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["enfeebled"]
                        } as GrantItemSource
                    ],
                    slug: "effect-debilitating-strike-enfeebled",
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
                img: "icons/skills/melee/strike-sword-blood-red.webp"
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: [{ or: ["debilitation:off-guard", "second-debilitation:off-guard"] }, "target:condition:off-guard"],
        selectors: ["strike-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Precise Debilitations (Off-Guard)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>Granted by @UUID[${PF2E_FEATS["precise-debilitations"]}]{Precise Debilitations}</p><p>The target becomes @UUID[${PF2E_CONDITIONS["off-guard"]}]{Off-Guard}.</p>`
                    },
                    publication: {
                        title: "Pathfinder Player Core",
                        license: "ORC",
                        remaster: true
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["off-guard"]
                        } as GrantItemSource
                    ],
                    slug: "effect-precise-debilitations-off-guard",
                    duration: {
                        value: 1,
                        unit: "rounds",
                        expiry: "turn-end"
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
                img: "icons/skills/targeting/target-strike-triple-blue.webp"
            });
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
                        target: data.target
                    }
                );
            } else {
                await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_FEAT_EFFECTS["effect-methodical-debilitations-flanking"],
                    {
                        origin: data.speaker,
                        target: data.target
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

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Tactical Debilitations (No Reactions)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>Granted by @UUID[${PF2E_FEATS["tactical-debilitations"]}]{Tactical Debilitations}</p><p>The target can't use reactions.</p>`
                    },
                    publication: {
                        title: "Pathfinder Player Core",
                        license: "ORC",
                        remaster: true
                    },
                    slug: "effect-tactical-debilitations-no-reactions",
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
                img: SYSTEM.path("icons/spells/clairvoyance.webp")
            });
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

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Eldritch Debilitations (No Steps)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>Granted by @UUID[${PF2E_FEATS["eldritch-debilitations"]}]{Eldritch Debilitations}</p><p>The target can't @UUID[${PF2E_ACTIONS["step"]}]{Step}.</p>`
                    },
                    publication: {
                        title: "Pathfinder Advanced Player's Guide",
                        license: "OGL",
                        remaster: false
                    },
                    slug: "effect-eldritch-debilitations-no-steps",
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
                img: "icons/sundries/gaming/rune-card.webp"
            });
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
                    target: data.target
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

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Eldritch Debilitations (Stupefied)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>Granted by @UUID[${PF2E_FEATS["eldritch-debilitations"]}]{Eldritch Debilitations}</p><p>The target is @UUID[${PF2E_CONDITIONS["stupefied"]}]{Stupefied 1}.</p>`
                    },
                    publication: {
                        title: "Pathfinder Advanced Player's Guide",
                        license: "OGL",
                        remaster: false
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["stupefied"]
                        } as GrantItemSource
                    ],
                    slug: "effect-eldritch-debilitations-stupefied",
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
                img: "icons/sundries/gaming/rune-card.webp"
            });
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
