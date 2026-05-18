import { Assistant } from "assistant.ts";

export const path = ["Spells", "1st Rank", "Daze"];

export const actions: Assistant.Action[] = [
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:daze", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...((await game.assistant.socket.addCondition(data.speaker.actor, "stunned", { value: 1 })) ?? [])
            );

            return reroll;
        }
    }
];
