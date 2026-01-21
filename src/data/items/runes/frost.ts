import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";
import { GrantItemSource } from "foundry-pf2e";

export const path = ["Items", "Runes", "Frost"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:frost"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.rollSave(data.target.actor, "fortitude", {
                origin: data.speaker.actor,
                dc: {
                    label: "Frost Rune DC",
                    value: 24
                },
                extraRollOptions: ["frost"],
                skipDialog: true
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:greater-frost"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.rollSave(data.target.actor, "fortitude", {
                origin: data.speaker.actor,
                dc: {
                    label: "Greater Frost Rune DC",
                    value: 34
                },
                extraRollOptions: ["greater-frost"],
                skipDialog: true
            });
        }
    },
    {
        trigger: "saving-throw",
        predicate: [
            "check:statistic:fortitude",
            "frost",
            { or: ["check:outcome:failure", "check:outcome:critical-failure"] }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Frost",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>The target is @UUID[${PF2E_CONDITIONS["slowed"]}]{Slowed 1} util the end of your next turn.</p>`
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
                        slug: "effect-frost",
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
                    img: "systems/pf2e/icons/equipment/runes/weapon-property-runes/weapon-property-runes.webp"
                }))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: [
            "check:statistic:fortitude",
            "greater-frost",
            { or: ["check:outcome:failure", "check:outcome:critical-failure"] }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Greater Frost",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>The target is @UUID[${PF2E_CONDITIONS["slowed"]}]{Slowed 1} util the end of your next turn.</p>`
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
                        slug: "effect-greater-frost",
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
                    img: "systems/pf2e/icons/equipment/runes/weapon-property-runes/weapon-property-runes.webp"
                }))
            );

            return reroll;
        }
    }
];
