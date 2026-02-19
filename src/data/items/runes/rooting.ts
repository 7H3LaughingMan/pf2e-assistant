import { SYSTEM } from "@7h3laughingman/pf2e-helpers/utilities";
import { GrantItemSource } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";

export const path = ["Items", "Runes", "Rooting"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:rooting"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Rooting",
                type: "effect",
                system: {
                    description: {
                        value: `<p>The target is @UUID[${PF2E_CONDITIONS["immobilized"]}]{Immobiliex} for 1 round ([[/act escape dc=23]]) and @UUID[${PF2E_CONDITIONS["clumsy"]}]{Clumsy 1} for a long as the immobiization lasts.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["immobilized"]
                        } as GrantItemSource,
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["clumsy"]
                        } as GrantItemSource
                    ],
                    slug: "effect-rooting",
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
                            actor: data.speaker.actor.uuid,
                            token: data.speaker.token.uuid,
                            rollOptions: data.speaker.actor.getSelfRollOptions("origin")
                        },
                        target: {
                            actor: data.target.actor.uuid,
                            token: data.target.token.uuid
                        }
                    }
                },
                img: SYSTEM.path("icons/equipment/runes/weapon-property-runes/weapon-property-runes.webp")
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:greater-rooting"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Greater Rooting",
                type: "effect",
                system: {
                    description: {
                        value: `<p>The target is @UUID[${PF2E_CONDITIONS["immobilized"]}]{Immobiliex} for 1 round ([[/act escape dc=28]]) and @UUID[${PF2E_CONDITIONS["clumsy"]}]{Clumsy 1} for a long as the immobiization lasts.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["immobilized"]
                        } as GrantItemSource,
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["clumsy"]
                        } as GrantItemSource
                    ],
                    slug: "effect-greater-rooting",
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
                            actor: data.speaker.actor.uuid,
                            token: data.speaker.token.uuid,
                            rollOptions: data.speaker.actor.getSelfRollOptions("origin")
                        },
                        target: {
                            actor: data.target.actor.uuid,
                            token: data.target.token.uuid
                        }
                    }
                },
                img: SYSTEM.path("icons/equipment/runes/weapon-property-runes/weapon-property-runes.webp")
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:major-rooting"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Major Rooting",
                type: "effect",
                system: {
                    description: {
                        value: `<p>The target is @UUID[${PF2E_CONDITIONS["immobilized"]}]{Immobiliex} for 1 round ([[/act escape dc=34]]) and @UUID[${PF2E_CONDITIONS["clumsy"]}]{Clumsy 1} for a long as the immobiization lasts.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["immobilized"]
                        } as GrantItemSource,
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["clumsy"]
                        } as GrantItemSource
                    ],
                    slug: "effect-major-rooting",
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
                            actor: data.speaker.actor.uuid,
                            token: data.speaker.token.uuid,
                            rollOptions: data.speaker.actor.getSelfRollOptions("origin")
                        },
                        target: {
                            actor: data.target.actor.uuid,
                            token: data.target.token.uuid
                        }
                    }
                },
                img: SYSTEM.path("icons/equipment/runes/weapon-property-runes/weapon-property-runes.webp")
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:true-rooting"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: True Rooting",
                type: "effect",
                system: {
                    description: {
                        value: `<p>The target is @UUID[${PF2E_CONDITIONS["immobilized"]}]{Immobiliex} for 1 round ([[/act escape dc=41]]) and @UUID[${PF2E_CONDITIONS["clumsy"]}]{Clumsy 1} for a long as the immobiization lasts.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["immobilized"]
                        } as GrantItemSource,
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["clumsy"]
                        } as GrantItemSource
                    ],
                    slug: "effect-true-rooting",
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
                            actor: data.speaker.actor.uuid,
                            token: data.speaker.token.uuid,
                            rollOptions: data.speaker.actor.getSelfRollOptions("origin")
                        },
                        target: {
                            actor: data.target.actor.uuid,
                            token: data.target.token.uuid
                        }
                    }
                },
                img: SYSTEM.path("icons/equipment/runes/weapon-property-runes/weapon-property-runes.webp")
            });
        }
    }
];
