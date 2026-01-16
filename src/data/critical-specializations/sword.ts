import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";
import { GrantItemSource } from "foundry-pf2e";

export const path = ["Critical Specializations", "Sword"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "critical-specialization", "item:group:sword"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.createEmbeddedItem(data.target.actor, {
                name: "Effect: Critical Specialization (Sword)",
                type: "effect",
                system: {
                    description: {
                        value: `<p>You are off-balance from your foe's attack, becoming @UUID[${PF2E_CONDITIONS["off-guard"]}]{Off-Guard} until the start of their next turn.</p>`
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
                    slug: "effect-critical-specialization-sword",
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
                            token: data.speaker.token.uuid,
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
