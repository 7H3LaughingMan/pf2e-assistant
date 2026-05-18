import { Assistant } from "assistant.ts";

export const path = ["Spells", "4th Rank", "Whispers of the Void"];

export const actions: Assistant.Action[] = [
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:whispers-of-the-void", "check:outcome:success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "persistent-damage", {
                    persistent: {
                        formula: `${Math.floor(data.item.rank / 2)}d8`,
                        damageType: "void",
                        dc: 15,
                        criticalHit: false
                    }
                }))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:whispers-of-the-void", "check:outcome:failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "persistent-damage", {
                    persistent: {
                        formula: `${Math.floor(data.item.rank / 2) * 2}d8`,
                        damageType: "void",
                        dc: 15,
                        criticalHit: false
                    }
                }))
            );

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "drained", { value: 1 }))
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["item:type:spell", "item:whispers-of-the-void", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            if (!data.item?.isOfType("spell")) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "persistent-damage", {
                    persistent: {
                        formula: `${Math.floor(data.item.rank / 2) * 2}d8`,
                        damageType: "void",
                        dc: 15,
                        criticalHit: false
                    }
                }))
            );

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "drained", { value: 2 }))
            );

            reroll.updateCondition.push(
                ...(await game.assistant.socket.addCondition(data.speaker.actor, "doomed", { value: 1 }))
            );

            return reroll;
        }
    }
];
