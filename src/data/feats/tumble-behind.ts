import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";
import { EphemeralEffectRuleElement, TokenMarkRuleElement } from "foundry-pf2e";
import { Utils } from "utils.ts";

export const path = ["Feats", "Tumble Behind"];

export const actions: Assistant.Action[] = [
    {
        trigger: "skill-check",
        predicate: [
            "action:tumble-through",
            { or: ["feat:tumble-behind-rogue", "feat:tumble-behind-swashbuckler"] },
            { or: ["check:outcome:critical-success", "check:outcome:success"] }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.createEmbeddedItem(data.speaker.actor, {
                    name: "Effect: Tumble Behind",
                    type: "effect",
                    system: {
                        description: {
                            value: `<p>Your foe is @UUID[${PF2E_CONDITIONS["off-guard"]}]{Off-Guard} against the next attack you make before the end of your turn.</p>`
                        },
                        rules: [
                            {
                                key: "TokenMark",
                                slug: "tumble-behind",
                                uuid: data.target.token.uuid
                            } as TokenMarkRuleElement["_source"],
                            {
                                key: "EphemeralEffect",
                                predicate: ["target:mark:tumble-behind"],
                                selectors: ["attack-roll", "attack-damage"],
                                uuid: PF2E_CONDITIONS["off-guard"]
                            } as EphemeralEffectRuleElement["_source"]
                        ],
                        slug: "effect-tumble-behind",
                        publication: {
                            title: "Pathfinder Player Core & Pathfinder Player Core 2",
                            license: "ORC",
                            remaster: true
                        },
                        duration: {
                            value: 0,
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
                            },
                            roll: {
                                total: data.roll.total,
                                degreeOfSuccess: data.roll.degreeOfSuccess
                            }
                        }
                    },
                    img: "icons/skills/movement/figure-running-gray.webp"
                }))
            );

            return reroll;
        }
    }
];
