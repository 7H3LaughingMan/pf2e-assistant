import { Assistant } from "assistant.ts";
import { PF2E_FEAT_EFFECTS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

export const path = ["Actions", "Bon Mot"];

export const actions: Assistant.Action[] = [
    {
        trigger: "skill-check",
        predicate: ["action:bon-mot", "check:outcome:critical-success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (data.targets.length !== 1) return;
            if (!Utils.Roll.isRolledCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(data.targets[0].actor, PF2E_FEAT_EFFECTS["effect-bon-mot"], {
                    origin: data.speaker,
                    target: data.targets[0],
                    roll: data.roll
                }))
            );

            reroll.addItem.push(
                ...(await game.assistant.socket.deleteEmbeddedItems(
                    Utils.Actor.getEffects(data.speaker.actor, ["effect-bon-mot"], {
                        origin: data.speaker.actor,
                        target: data.targets[0].actor,
                        degreeOfSuccess: 0
                    })
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["action:bon-mot", "check:outcome:success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (data.targets.length !== 1) return;
            if (!Utils.Roll.isRolledCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(data.targets[0].actor, PF2E_FEAT_EFFECTS["effect-bon-mot"], {
                    origin: data.speaker,
                    target: data.targets[0],
                    roll: data.roll
                }))
            );

            reroll.addItem.push(
                ...(await game.assistant.socket.deleteEmbeddedItems(
                    Utils.Actor.getEffects(data.speaker.actor, ["effect-bon-mot"], {
                        origin: data.speaker.actor,
                        target: data.targets[0].actor,
                        degreeOfSuccess: 0
                    })
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["action:bon-mot", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (data.targets.length !== 1) return;
            if (!Utils.Roll.isRolledCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(data.speaker.actor, PF2E_FEAT_EFFECTS["effect-bon-mot"], {
                    origin: data.speaker,
                    target: data.targets[0],
                    roll: data.roll
                }))
            );

            return reroll;
        }
    }
];
