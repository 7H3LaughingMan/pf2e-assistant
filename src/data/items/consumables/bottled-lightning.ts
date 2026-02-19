import { isRolledCheckRoll, SYSTEM } from "@7h3laughingman/pf2e-helpers/utilities";
import { GrantItemSource } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS, PF2E_EQUIPMENT } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Bottled Lightning"];

export const actions: Assistant.Action[] = [
    {
        trigger: "attack-roll",
        predicate: [
            { or: ["check:outcome:success", "check:outcome:critical-success"] },
            {
                or: [
                    "item:bottled-lightning-lesser",
                    "item:bottled-lightning-moderate",
                    "item:bottled-lightning-greater",
                    "item:bottled-lightning-major"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("consumable")) return;
            if (!isRolledCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                    name: "Effect: Bottled Lightning",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>Granted by @UUID[${PF2E_EQUIPMENT["bottled-lightning-lesser"]}]{Bottled Lightning (Lesser)}, @UUID[${PF2E_EQUIPMENT["bottled-lightning-moderate"]}]{Bottled Lightning (Moderate)}, @UUID[${PF2E_EQUIPMENT["bottled-lightning-greater"]}]{Bottled Lightning (Greater)}, @UUID[${PF2E_EQUIPMENT["bottled-lightning-major"]}]{Bottled Lightning (Major)}</p><p>You are @UUID[${PF2E_CONDITIONS["off-guard"]}]{Off-Guard} until the start of your foe's next turn.</p>`
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
                        slug: "effect-bottled-lightning",
                        publication: {
                            title: "Pathfinder Player Core 2",
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
                                item: data.item.uuid
                            },
                            target: {
                                actor: data.target.actor.uuid,
                                token: data.target.token.uuid
                            },
                            roll: {
                                total: data.roll.total,
                                degreeOfSuccess: data.roll.degreeOfSuccess
                            }
                        }
                    },
                    img: SYSTEM.path("icons/equipment/alchemical-items/alchemical-bombs/bottled-lightning.webp")
                }))
            );

            return reroll;
        }
    }
];
