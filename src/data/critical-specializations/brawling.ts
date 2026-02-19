import { isRolledCheckRoll } from "@7h3laughingman/pf2e-helpers/utilities";
import { GrantItemSource } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

export const path = ["Critical Specializations", "Brawling"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: [
            "check:outcome:critical-success",
            "critical-specialization",
            "item:group:brawling",
            { not: "item:rune:property:grievous" }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            game.assistant.socket.rollSave(data.target.actor, "fortitude", {
                origin: data.speaker.actor,
                dc: Utils.Actor.getClassDC(data.speaker.actor),
                extraRollOptions: ["critical-specialization", "item:group:brawling"],
                skipDialog: true
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: [
            "check:outcome:critical-success",
            "critical-specialization",
            "item:group:brawling",
            "item:rune:property:grievous"
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            game.assistant.socket.rollSave(data.target.actor, "fortitude", {
                origin: data.speaker.actor,
                dc: Utils.Actor.getClassDC(data.speaker.actor),
                extraRollOptions: ["critical-specialization", "item:group:brawling", "grievous"],
                modifiers: [{ label: "Grievous", modifier: -4, type: "circumstance" }],
                skipDialog: true
            });
        }
    },
    {
        trigger: "saving-throw",
        predicate: [
            { or: ["check:outcome:failure", "check:outcome:critical-failure"] },
            "critical-specialization",
            "item:group:brawling"
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!isRolledCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Critical Specialization (Brawling)",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>You are @UUID[${PF2E_CONDITIONS["slowed"]}]{Slowed 1} until the end of your foe's next turn.</p>`
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
                        slug: "effect-critical-specialization-brawling",
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
                            },
                            roll: {
                                total: data.roll.total,
                                degreeOfSuccess: data.roll.degreeOfSuccess
                            }
                        }
                    },
                    img: "icons/weapons/fist/fist-knuckles-brass.webp"
                }))
            );

            return reroll;
        }
    }
];
