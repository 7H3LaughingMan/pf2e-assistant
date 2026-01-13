import { Assistant } from "assistant.ts";
import { PF2E_ASSISTANT_EFFECTS } from "effects.js";
import { Utils } from "utils.ts";

export const path = ["Spells", "4th Rank", "Painful Vibrations"];

export const actions: Assistant.Action[] = [
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:painful-vibrations", "check:outcome:failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...((await game.assistant.socket.addCondition(data.speaker.actor, "sickened", { value: 1 })) ?? [])
            );

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.speaker.actor,
                    PF2E_ASSISTANT_EFFECTS["spell-effect-painful-vibrations"],
                    { origin: data.origin, item: data.item, target: data.speaker, roll: data.roll }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:painful-vibrations", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;

            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "sickened", { value: 2 }))
            );

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.speaker.actor,
                    PF2E_ASSISTANT_EFFECTS["spell-effect-painful-vibrations"],
                    {
                        origin: data.origin,
                        item: data.item,
                        target: data.speaker,
                        roll: data.roll,
                        duration: { expiry: "turn-start", sustained: false, unit: "minutes", value: 1 }
                    }
                ))
            );

            return reroll;
        }
    }
];
