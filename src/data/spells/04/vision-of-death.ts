import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";
import { GrantItemSource } from "foundry-pf2e";
import { Utils } from "utils.ts";

export const path = ["Spells", "4th Rank", "Vision of Death"];

export const actions: Assistant.Action[] = [
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:vision-of-death", "check:outcome:success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "frightened", { value: 1 }))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:vision-of-death", "check:outcome:failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "frightened", { value: 2 }))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:vision-of-death", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "frightened", { value: 4 }))
            );

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Spell Effect: Vision of Death",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>You have become @UUID[${PF2E_CONDITIONS["frightened"]}]{Frightened 4} and are also @UUID[${PF2E_CONDITIONS["fleeing"]}]{Fleeing} for as long are you are frightened.</p>`
                        },
                        rules: [
                            {
                                key: "GrantItem",
                                onDeleteActions: {
                                    grantee: "restrict"
                                },
                                uuid: PF2E_CONDITIONS["fleeing"]
                            } as GrantItemSource
                        ],
                        slug: "spell-effect-vision-of-death",
                        publication: {
                            title: "Pathfinder Player Core",
                            license: "ORC",
                            remaster: true
                        },
                        level: {
                            value: data.item.rank
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
                                rollOptions: [
                                    data.origin.actor.getSelfRollOptions("origin"),
                                    data.item.getRollOptions("origin:item")
                                ]
                                    .flat()
                                    .filter(Utils.Remeda.isTruthy)
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
                    img: "systems/pf2e/icons/spells/phantasmal-killer.webp"
                }))
            );

            return reroll;
        }
    },
    {
        trigger: "delete-effect",
        predicate: ["item:frightened", "self:effect:vision-of-death"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;

            if (!data.speaker.actor.hasCondition("frightened")) {
                const effect = Utils.Actor.getEffect(data.speaker.actor, "spell-effect-vision-of-death");

                if (effect) {
                    await game.assistant.socket.deleteEmbeddedItem(effect);
                }
            }
        }
    }
];
