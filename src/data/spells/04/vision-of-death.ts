import { Assistant } from "assistant.ts";
import { PF2E_ASSISTANT_EFFECTS } from "effects.js";
import { Utils } from "utils.ts";

export const path = ["Spells", "4th Rank", "Vision of Death"];

export const actions: Assistant.Action[] = [
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:vision-of-death", "check:outcome:success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;

            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "frightened", { value: 1 }))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:vision-of-death", "check:outcome:failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;

            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "frightened", { value: 2 }))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:vision-of-death", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "frightened", { value: 4 }))
            );

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.speaker.actor,
                    PF2E_ASSISTANT_EFFECTS["spell-effect-vision-of-death"],
                    { origin: data.origin, item: data.item, target: data.target, roll: data.roll }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "delete-effect",
        predicate: ["item:frightened", "self:effect:vision-of-death"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;

            if (!data.speaker.actor.hasCondition("frightened")) {
                const effect = Utils.Actor.getEffect(data.speaker.actor, "spell-effect-vision-of-death");

                if (effect) {
                    await game.assistant.socket.deleteEmbeddedItem(effect);
                }
            }
        }
    }
];
