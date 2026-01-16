import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS, PF2E_OTHER_EFFECTS } from "compendium-packs.ts";
import { GrantItemSource } from "foundry-pf2e";
import { Utils } from "utils.ts";

export const path = ["Actions", "Disarm"];

export const actions: Assistant.Action[] = [
    {
        trigger: "skill-check",
        predicate: ["action:disarm", "check:outcome:success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_OTHER_EFFECTS["effect-disarm-success"],
                    { origin: data.speaker, target: data.target, roll: data.roll }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["action:disarm", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Disarm (Critical Failure)",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>You lose your balance and become @UUID[${PF2E_CONDITIONS["off-guard"]}]{Off-Guard} until the start of your next turn.</p>`
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
                        slug: "effect-disarm-critical-failure",
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
                                token: data.speaker.token.uuid
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
    }
];
