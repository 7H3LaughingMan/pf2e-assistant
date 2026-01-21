import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";
import { GrantItemSource } from "foundry-pf2e";
import { Utils } from "utils.ts";

export const path = ["Spells", "4th Rank", "Painful Vibrations"];

export const actions: Assistant.Action[] = [
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:painful-vibrations", "check:outcome:failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...((await game.assistant.socket.addCondition(data.speaker.actor, "sickened", { value: 1 })) ?? [])
            );

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Spell Effect: Painful Vibrations",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>You are @UUID[${PF2E_CONDITIONS["deafened"]}]{Deafened}.</p>`
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
                        slug: "spell-effect-painful-vibrations",
                        publication: {
                            title: "Pathfinder Secrets of Magic",
                            license: "OGL",
                            remaster: false
                        },
                        level: {
                            value: data.item.rank
                        },
                        duration: {
                            value: 1,
                            unit: "rounds",
                            expiry: "turn-start",
                            sustained: false
                        },
                        context: {
                            origin: {
                                actor: data.origin.actor.uuid,
                                token: data.origin.token.uuid,
                                item: data.item.uuid,
                                spellcasting: {
                                    attribute: {
                                        type: data.item.attribute,
                                        mod: data.item.spellcasting?.statistic?.attributeModifier?.value ?? 0
                                    },
                                    tradition: data.item.spellcasting?.tradition
                                },
                                rollOptions: Utils.RollOptions.getOriginRollOptions(data.origin.actor, data.item)
                            },
                            target: {
                                actor: data.speaker.actor.uuid,
                                token: data.origin.token.uuid
                            },
                            roll: {
                                total: data.roll.total,
                                degreeOfSuccess: data.roll.degreeOfSuccess
                            }
                        }
                    },
                    img: "systems/pf2e/icons/spells/painful-vibrations.webp"
                }))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:painful-vibrations", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "sickened", { value: 2 }))
            );

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Spell Effect: Painful Vibrations",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>You are @UUID[${PF2E_CONDITIONS["deafened"]}]{Deafened}.</p>`
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
                        slug: "spell-effect-painful-vibrations",
                        publication: {
                            title: "Pathfinder Secrets of Magic",
                            license: "OGL",
                            remaster: false
                        },
                        level: {
                            value: data.item.rank
                        },
                        duration: {
                            value: 1,
                            unit: "minutes",
                            expiry: "turn-start",
                            sustained: false
                        },
                        context: {
                            origin: {
                                actor: data.origin.actor.uuid,
                                token: data.origin.token.uuid,
                                item: data.item.uuid,
                                spellcasting: {
                                    attribute: {
                                        type: data.item.attribute,
                                        mod: data.item.spellcasting?.statistic?.attributeModifier?.value ?? 0
                                    },
                                    tradition: data.item.spellcasting?.tradition
                                },
                                rollOptions: Utils.RollOptions.getOriginRollOptions(data.origin.actor, data.item)
                            },
                            target: {
                                actor: data.speaker.actor.uuid,
                                token: data.origin.token.uuid
                            },
                            roll: {
                                total: data.roll.total,
                                degreeOfSuccess: data.roll.degreeOfSuccess
                            }
                        }
                    },
                    img: "systems/pf2e/icons/spells/painful-vibrations.webp"
                }))
            );

            return reroll;
        }
    }
];
