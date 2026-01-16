import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS, PF2E_EQUIPMENT } from "compendium-packs.ts";
import { GrantItemSource } from "foundry-pf2e";
import { Utils } from "utils.ts";

export const path = ["Items", "Consumables", "Mistform Elixir"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:mistform-elixir-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.createEmbeddedItem(target.actor, {
                name: "Effect: Mistform Elixir (Lesser)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>Granted by @UUID[${PF2E_EQUIPMENT["mistform-elixir-lesser"]}]{Mistform Elixir (Lesser)}</p><p>A faint mist emanates from your skin, making you @UUID[${PF2E_CONDITIONS["concealed"]}]{Concealed} for 3 rounds.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["concealed"]
                        } as GrantItemSource
                    ],
                    slug: "effect-mistform-elixir-lesser",
                    publication: {
                        title: "Pathfinder GM Core",
                        license: "ORC",
                        remaster: true
                    },
                    level: {
                        value: 4
                    },
                    duration: {
                        value: 3,
                        unit: "rounds",
                        expiry: "turn-start",
                        sustained: false
                    },
                    context: {
                        origin: {
                            actor: data.speaker.actor.uuid,
                            token: data.speaker.token.uuid,
                            item: data.item.uuid,
                            rollOptions: [
                                data.speaker.actor.getSelfRollOptions("origin"),
                                data.item.getRollOptions("origin:item")
                            ]
                                .flat()
                                .filter(Utils.Remeda.isTruthy)
                        },
                        target: {
                            actor: target.actor.uuid,
                            token: target.token.uuid
                        }
                    }
                },
                img: "icons/consumables/potions/bottle-conical-corked-blue.webp"
            });
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:mistform-elixir-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.createEmbeddedItem(target.actor, {
                name: "Effect: Mistform Elixir (Moderate)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>Granted by @UUID[${PF2E_EQUIPMENT["mistform-elixir-moderate"]}]{Mistform Elixir (Moderate)}</p><p>A faint mist emanates from your skin, making you @UUID[${PF2E_CONDITIONS["concealed"]}]{Concealed} for 1 minute.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["concealed"]
                        } as GrantItemSource
                    ],
                    slug: "effect-mistform-elixir-moderate",
                    publication: {
                        title: "Pathfinder GM Core",
                        license: "ORC",
                        remaster: true
                    },
                    level: {
                        value: 6
                    },
                    duration: {
                        value: 1,
                        unit: "minutes",
                        expiry: "turn-start",
                        sustained: false
                    },
                    context: {
                        origin: {
                            actor: data.speaker.actor.uuid,
                            token: data.speaker.token.uuid,
                            item: data.item.uuid,
                            rollOptions: [
                                data.speaker.actor.getSelfRollOptions("origin"),
                                data.item.getRollOptions("origin:item")
                            ]
                                .flat()
                                .filter(Utils.Remeda.isTruthy)
                        },
                        target: {
                            actor: target.actor.uuid,
                            token: target.token.uuid
                        }
                    }
                },
                img: "icons/consumables/potions/bottle-conical-corked-blue.webp"
            });
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:mistform-elixir-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.createEmbeddedItem(target.actor, {
                name: "Effect: Mistform Elixir (Greater)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>Granted by @UUID[${PF2E_EQUIPMENT["mistform-elixir-greater"]}]{Mistform Elixir (Greater)}</p><p>A faint mist emanates from your skin, making you @UUID[${PF2E_CONDITIONS["concealed"]}]{Concealed} for 5 minutes.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["concealed"]
                        } as GrantItemSource
                    ],
                    slug: "effect-mistform-elixir-greater",
                    publication: {
                        title: "Pathfinder GM Core",
                        license: "ORC",
                        remaster: true
                    },
                    level: {
                        value: 10
                    },
                    duration: {
                        value: 5,
                        unit: "minutes",
                        expiry: "turn-start",
                        sustained: false
                    },
                    context: {
                        origin: {
                            actor: data.speaker.actor.uuid,
                            token: data.speaker.token.uuid,
                            item: data.item.uuid,
                            rollOptions: [
                                data.speaker.actor.getSelfRollOptions("origin"),
                                data.item.getRollOptions("origin:item")
                            ]
                                .flat()
                                .filter(Utils.Remeda.isTruthy)
                        },
                        target: {
                            actor: target.actor.uuid,
                            token: target.token.uuid
                        }
                    }
                },
                img: "icons/consumables/potions/bottle-conical-corked-blue.webp"
            });
        }
    }
];
