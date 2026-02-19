import { isRolledCheckRoll } from "@7h3laughingman/pf2e-helpers/utilities";
import { GrantItemSource } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

export const path = ["Spells", "1st Rank", "Buzzing Bites"];

export const actions: Assistant.Action[] = [
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:buzzing-bites", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.origin) return;
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;
            if (!isRolledCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Spell Effect: Buzzing Bites",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>The target is @UUID[${PF2E_CONDITIONS["sickened"]}]{Sickened 1} by the crawling insects. The sickened value can't be reduced below 1 while the spell is active.</p>`
                        },
                        rules: [
                            {
                                key: "GrantItem",
                                onDeleteActions: {
                                    grantee: "restrict"
                                },
                                uuid: PF2E_CONDITIONS["sickened"]
                            } as GrantItemSource
                        ],
                        slug: "spell-effect-buzzing-bites",
                        publication: {
                            license: "ORC",
                            remaster: true,
                            title: "Pathfinder Lost Omens Divine Mysteries"
                        },
                        level: {
                            value: data.item.rank
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
                                token: data.speaker.token.uuid
                            },
                            roll: {
                                total: data.roll.total,
                                degreeOfSuccess: data.roll.degreeOfSuccess
                            }
                        }
                    },
                    img: "icons/creatures/invertebrates/fly-wasp-mosquito-green.webp"
                }))
            );

            return reroll;
        }
    }
];
