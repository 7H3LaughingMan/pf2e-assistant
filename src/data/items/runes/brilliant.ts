import { SYSTEM } from "@7h3laughingman/pf2e-helpers/utilities";
import { GrantItemSource } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";

export const path = ["Items", "Runes", "Brilliant"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:brilliant"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.rollSave(data.target.actor, "fortitude", {
                origin: data.speaker.actor,
                dc: {
                    label: "Brilliant Rune DC",
                    value: 29
                },
                extraRollOptions: ["brilliant"],
                skipDialog: true
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:greater-brilliant"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.rollSave(data.target.actor, "fortitude", {
                origin: data.speaker.actor,
                dc: {
                    label: "Greater Brilliant Rune DC",
                    value: 41
                },
                extraRollOptions: ["greater-brilliant"],
                skipDialog: true
            });
        }
    },
    {
        trigger: "saving-throw",
        predicate: [
            "check:statistic:fortitude",
            "brilliant",
            { or: ["check:outcome:failure", "check:outcome:critical-failure"] }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Brilliant",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>The target is @UUID[${PF2E_CONDITIONS["blinded"]}]{Blinded} util the end of your next turn.</p>`
                        },
                        rules: [
                            {
                                key: "GrantItem",
                                onDeleteActions: {
                                    grantee: "restrict"
                                },
                                uuid: PF2E_CONDITIONS["blinded"]
                            } as GrantItemSource
                        ],
                        slug: "effect-brilliant",
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
        predicate: [
            "check:statistic:fortitude",
            "greater-brilliant",
            { or: ["check:outcome:failure", "check:outcome:critical-failure"] }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Greater Brilliant",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>The target is @UUID[${PF2E_CONDITIONS["blinded"]}]{Blinded} util the end of your next turn.</p>`
                        },
                        rules: [
                            {
                                key: "GrantItem",
                                onDeleteActions: {
                                    grantee: "restrict"
                                },
                                uuid: PF2E_CONDITIONS["blinded"]
                            } as GrantItemSource
                        ],
                        slug: "effect-greater-brilliant",
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
