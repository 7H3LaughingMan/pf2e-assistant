import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "effects.js";
import { EffectSource } from "foundry-pf2e";
import { Utils } from "utils.ts";

export const path = ["Spells", "1st Rank", "Shield"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:shield", { not: "item:tag:psi-cantrip" }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            if (Utils.Actor.hasEffect(data.speaker.actor, "effect-shield-immunity")) {
                ui.notifications.warn(`${data.speaker.actor.name} is temporarily unable to cast Shield.`);
                return;
            }

            await game.assistant.socket.addEffect(data.speaker.actor, PF2E_SPELL_EFFECTS["spell-effect-shield"], {
                origin: data.speaker,
                item: data.item,
                target: data.speaker
            });
        }
    },
    {
        trigger: "spell-cast",
        predicate: ["item:shield", "item:tag:psi-cantrip", { not: "item:tag:amped" }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;
            const target = data.target ?? data.speaker;

            if (Utils.Actor.hasEffect(data.speaker.actor, "effect-shield-immunity")) {
                ui.notifications.warn(`${data.speaker.actor.name} is temporarily unable to cast Shield.`);
                return;
            }

            await game.assistant.socket.addEffect(target.actor, PF2E_SPELL_EFFECTS["spell-effect-shield"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    },
    {
        trigger: "spell-cast",
        predicate: ["item:shield", "item:tag:psi-cantrip", "item:tag:amped"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;
            const target = data.target ?? data.speaker;

            if (Utils.Actor.hasEffect(data.speaker.actor, "effect-shield-immunity")) {
                ui.notifications.warn(`${data.speaker.actor.name} is temporarily unable to cast Shield.`);
                return;
            }

            await game.assistant.socket.addEffect(target.actor, PF2E_SPELL_EFFECTS["spell-effect-shield-amped"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    },
    {
        trigger: "damage-taken",
        predicate: ["self:effect:shield", "self:shield:block"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;

            const shieldEffect = Utils.Actor.getEffect(data.speaker.actor, "spell-effect-shield");
            if (shieldEffect) {
                const origin = shieldEffect.origin;
                if (origin) {
                    await game.assistant.socket.addEmbeddedItem(origin, PF2E_SPELL_EFFECTS["effect-shield-immunity"], {
                        system: { context: shieldEffect.system.context ?? null, level: shieldEffect.system.level }
                    } as EffectSource);
                }

                await game.assistant.socket.deleteEmbeddedItem(shieldEffect);
            }
        }
    },
    {
        trigger: "damage-taken",
        predicate: ["self:effect:shield-amped", "self:shield:block"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;

            const shieldEffect = Utils.Actor.getEffect(data.speaker.actor, "spell-effect-shield-amped");
            if (shieldEffect) {
                const origin = shieldEffect.origin;
                const currentValue = shieldEffect.system.badge?.value;
                const rollOption = shieldEffect.system.rules
                    .filter(Utils.Rules.isRollOption)
                    .find((rule) => rule.option === "shield-block-layers");
                const layers = Number(rollOption?.selection ?? "1");

                if (Utils.Remeda.isNonNullish(currentValue) && Utils.Remeda.isNumber(currentValue)) {
                    if (currentValue - layers !== 0) {
                        await game.assistant.socket.updateEmbeddedItem(shieldEffect, {
                            system: { badge: { value: currentValue - layers } }
                        });
                    } else {
                        if (origin) {
                            await game.assistant.socket.addEmbeddedItem(
                                origin,
                                PF2E_SPELL_EFFECTS["effect-shield-immunity"],
                                {
                                    system: {
                                        context: shieldEffect.system.context ?? null,
                                        level: shieldEffect.system.level
                                    }
                                } as EffectSource
                            );
                        }
                        await game.assistant.socket.deleteEmbeddedItem(shieldEffect);
                    }
                }
            }
        }
    }
];
