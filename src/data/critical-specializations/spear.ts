import { GrantItemSource } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";

export const path = ["Critical Specializations", "Spear"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: [
            "check:outcome:critical-success",
            "critical-specialization",
            "item:group:spear",
            { not: "item:rune:property:grievous" }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Critical Specialization (Spear)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>The target is @UUID[${PF2E_CONDITIONS["clumsy"]}]{Clumsy 1} until the start of your next turn.</p>`
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
                    slug: "effect-critical-specialization-spear",
                    publication: {
                        title: "Pathfinder Player Core",
                        license: "ORC",
                        remaster: true
                    },
                    duration: {
                        value: 1,
                        unit: "rounds",
                        expiry: "turn-start",
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
                img: "icons/weapons/polearms/spear-flared-steel.webp"
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: [
            "check:outcome:critical-success",
            "critical-specialization",
            "item:group:spear",
            "item:rune:property:grievous"
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Critical Specialization (Spear)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>The target is @UUID[${PF2E_CONDITIONS["clumsy"]}]{Clumsy 1} for 2 rounds.</p>`
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
                    slug: "effect-critical-specialization-spear",
                    publication: {
                        title: "Pathfinder Player Core",
                        license: "ORC",
                        remaster: true
                    },
                    duration: {
                        value: 2,
                        unit: "rounds",
                        expiry: "turn-start",
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
                img: "icons/weapons/polearms/spear-flared-steel.webp"
            });
        }
    }
];
