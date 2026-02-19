import { isRolledDamageRoll, SYSTEM } from "@7h3laughingman/pf2e-helpers/utilities";
import { GrantItemSource } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

export const path = ["Items", "Runes", "Vitalizing"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:disrupting", "target:negative-healing"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!isRolledDamageRoll(data.roll)) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Vitalizing",
                type: "effect",
                system: {
                    description: {
                        value: `<p>The target is @UUID[${PF2E_CONDITIONS["enfeebled"]}]{Enfeebled 1} until the end of your next turn.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["enfeebled"]
                        } as GrantItemSource
                    ],
                    slug: "effect-vitalizing",
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
        predicate: [
            "check:outcome:critical-success",
            "item:rune:property:greater-disrupting",
            "target:negative-healing"
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!isRolledDamageRoll(data.roll)) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Greater Vitalizing",
                type: "effect",
                system: {
                    description: {
                        value: `<p>The target is @UUID[${PF2E_CONDITIONS["enfeebled"]}]{Enfeebled 1} and @UUID[${PF2E_CONDITIONS["stupefied"]}]{Stupefied 1} as long as it has the persistent damage from this rune.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["enfeebled"]
                        } as GrantItemSource,
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["stupefied"]
                        } as GrantItemSource
                    ],
                    slug: "effect-greater-vitalizing",
                    publication: {
                        title: "Pathfinder Player Core",
                        license: "ORC",
                        remaster: true
                    },
                    duration: {
                        value: -1,
                        unit: "unlimited",
                        expiry: null,
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
        trigger: "delete-effect",
        predicate: ["item:persistent-damage", "item:damage:type:vitality", "self:effect:greater-vitalizing"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;

            if (!Utils.Actor.hasPersistentDamage(data.speaker.actor, "vitality")) {
                const effect = Utils.Actor.getEffect(data.speaker.actor, "effect-greater-vitalizing");

                if (effect) {
                    await game.assistant.socket.deleteEmbeddedItem(effect);
                }
            }
        }
    }
];
