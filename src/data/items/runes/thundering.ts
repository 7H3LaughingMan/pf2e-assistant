import { SYSTEM } from "@7h3laughingman/pf2e-helpers/utilities";
import { GrantItemSource } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";

export const path = ["Items", "Runes", "Thundering"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:thundering"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.rollSave(data.target.actor, "fortitude", {
                origin: data.speaker.actor,
                dc: {
                    label: "Thundering Rune DC",
                    value: 24
                },
                extraRollOptions: ["thundering"],
                skipDialog: true
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:greater-thundering"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.rollSave(data.target.actor, "fortitude", {
                origin: data.speaker.actor,
                dc: {
                    label: "Greater Thundering Rune DC",
                    value: 34
                },
                extraRollOptions: ["greater-thundering"],
                skipDialog: true
            });
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["thundering", "check:outcome:failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Thundering",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>The target is @UUID[${PF2E_CONDITIONS["deafened"]}]{Deafened} for 1 minute.</p>`
                        },
                        rules: [
                            {
                                key: "GrantItem",
                                onDeleteActions: {
                                    grantee: "restrict"
                                },
                                uuid: PF2E_CONDITIONS["deafened"]
                            } as GrantItemSource
                        ],
                        slug: "effect-thundering",
                        publication: {
                            title: "Pathfinder Player Core",
                            license: "ORC",
                            remaster: true
                        },
                        duration: {
                            value: 1,
                            unit: "minutes",
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
                            }
                        }
                    },
                    img: SYSTEM.path("icons/equipment/runes/weapon-property-runes/weapon-property-runes.webp")
                }))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["thundering", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Thundering",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>The target is @UUID[${PF2E_CONDITIONS["deafened"]}]{Deafened} for 1 hour.</p>`
                        },
                        rules: [
                            {
                                key: "GrantItem",
                                onDeleteActions: {
                                    grantee: "restrict"
                                },
                                uuid: PF2E_CONDITIONS["deafened"]
                            } as GrantItemSource
                        ],
                        slug: "effect-thundering",
                        publication: {
                            title: "Pathfinder Player Core",
                            license: "ORC",
                            remaster: true
                        },
                        duration: {
                            value: 1,
                            unit: "hours",
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
                            }
                        }
                    },
                    img: SYSTEM.path("icons/equipment/runes/weapon-property-runes/weapon-property-runes.webp")
                }))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["greater-thundering", { or: ["check:outcome:failure", "check:outcome:critical-failure"] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Greater Thundering",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>The target is @UUID[${PF2E_CONDITIONS["deafened"]}]{Deafened} permanently.</p>`
                        },
                        rules: [
                            {
                                key: "GrantItem",
                                onDeleteActions: {
                                    grantee: "restrict"
                                },
                                uuid: PF2E_CONDITIONS["deafened"]
                            } as GrantItemSource
                        ],
                        slug: "effect-greater-thundering",
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
                                actor: data.origin.actor.uuid,
                                token: data.origin.token.uuid,
                                rollOptions: data.origin.actor.getSelfRollOptions("origin")
                            },
                            target: {
                                actor: data.speaker.actor.uuid,
                                token: data.speaker.token.uuid
                            }
                        }
                    },
                    img: SYSTEM.path("icons/equipment/runes/weapon-property-runes/weapon-property-runes.webp")
                }))
            );

            return reroll;
        }
    }
];
