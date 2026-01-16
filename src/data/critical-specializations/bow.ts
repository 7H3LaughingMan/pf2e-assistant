import { Assistant } from "assistant.ts";
import { PF2E_ACTIONS, PF2E_CONDITIONS } from "compendium-packs.ts";
import { GrantItemSource } from "foundry-pf2e";

export const path = ["Critical Specializations", "Bow"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "critical-specialization", "item:group:bow"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Critical Specialization (Bow)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>You are @UUID[${PF2E_CONDITIONS["immobilized"]}]{Immobilized} and must spend an @UUID[${PF2E_ACTIONS["interact"]}]{Interact} action to attempt a @Check[athletics|dc:10|name:Pull the Missile Free|showDC:all] to pull the missle free; you are unable to move from your space until you succeed.</p>`
                    },
                    rules: [
                        {
                            key: "GrantItem",
                            onDeleteActions: {
                                grantee: "restrict"
                            },
                            uuid: PF2E_CONDITIONS["immobilized"]
                        } as GrantItemSource
                    ],
                    slug: "effect-critical-specialization-bow",
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
                            token: data.target.token.uuid,
                            rollOptions: data.speaker.actor.getSelfRollOptions("origin")
                        },
                        target: {
                            actor: data.target.actor.uuid,
                            token: data.target.token.uuid
                        }
                    }
                },
                img: "icons/magic/control/buff-luck-fortune-gold.webp"
            });
        }
    }
];
