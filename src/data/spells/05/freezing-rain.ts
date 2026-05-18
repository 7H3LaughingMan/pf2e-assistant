import { Assistant } from "assistant.ts";

export const path = ["Spells", "5th Rank", "Freezing Rain"];

export const actions: Assistant.Action[] = [
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:freezing-rain", "check:outcome:failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "slowed", { value: 1 }))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:freezing-rain", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "slowed", { value: 2 }))
            );

            return reroll;
        }
    }
];
