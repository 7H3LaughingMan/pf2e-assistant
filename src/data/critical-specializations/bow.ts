import { GrantItemSource } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { PF2E_ACTIONS, PF2E_CONDITIONS } from "compendium-packs.ts";

export const path = ["Critical Specializations", "Bow"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: [
            "check:outcome:critical-success",
            "critical-specialization",
            "item:group:bow",
            { not: "item:rune:property:grievous" }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Critical Specialization (Bow)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>The target is @UUID[${PF2E_CONDITIONS["immobilized"]}]{Immobilized} and must spend an @UUID[${PF2E_ACTIONS["interact"]}]{Interact} action to attempt a @Check[athletics|dc:10|name:Pull the Missile Free|showDC:all] check to pull the missle free; it can't move from its space until it succeeds. The creature doesn't become stuck if it is incorporeal, is liquid, or could otherwise escape without effort.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["immobilized"]
                        } as GrantItemSource
                    ],
                    slug: "effect-critical-specialization-bow",
                    publication: {
                        title: "Pathfinder Player Core",
                        license: "ORC",
                        remaster: true
                    },
                    duration: {
                        value: -1,
                        unit: "unlimited",
                        expiry: null,
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
                img: "icons/weapons/bows/longbow-recurve-leather-brown.webp"
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: [
            "check:outcome:critical-success",
            "critical-specialization",
            "item:group:bow",
            "item:rune:property:grievous"
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Critical Specialization (Bow)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>The target is @UUID[${PF2E_CONDITIONS["immobilized"]}]{Immobilized} and must spend an @UUID[${PF2E_ACTIONS["interact"]}]{Interact} action to attempt a @Check[athletics|dc:20|name:Pull the Missile Free|showDC:all] check to pull the missle free; it can't move from its space until it succeeds. The creature doesn't become stuck if it is incorporeal, is liquid, or could otherwise escape without effort.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["immobilized"]
                        } as GrantItemSource
                    ],
                    slug: "effect-critical-specialization-bow",
                    publication: {
                        title: "Pathfinder Player Core",
                        license: "ORC",
                        remaster: true
                    },
                    duration: {
                        value: -1,
                        unit: "unlimited",
                        expiry: null,
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
                img: "icons/weapons/bows/longbow-recurve-leather-brown.webp"
            });
        }
    }
];
