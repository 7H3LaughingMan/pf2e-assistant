import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "effects.js";
import { Utils } from "utils.ts";

export const path = ["Spells", "1st Rank", "Tangle Vine"];

export const actions: Assistant.Action[] = [
    {
        trigger: "attack-roll",
        predicate: ["item:type:spell", "item:tangle-vine", "check:outcome:success", { lt: ["item:rank", 2] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_SPELL_EFFECTS["spell-effect-tangle-vine"],
                    {
                        origin: data.speaker,
                        item: data.item,
                        target: data.speaker,
                        roll: data.roll,
                        choiceSet: { selection: "success" }
                    }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "attack-roll",
        predicate: ["item:type:spell", "item:tangle-vine", "check:outcome:critical-success", { lt: ["item:rank", 2] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_SPELL_EFFECTS["spell-effect-tangle-vine"],
                    {
                        origin: data.speaker,
                        item: data.item,
                        target: data.speaker,
                        roll: data.roll,
                        choiceSet: { selection: "critical-success" }
                    }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "attack-roll",
        predicate: [
            "item:type:spell",
            "item:tangle-vine",
            "check:outcome:success",
            { gte: ["item:rank", 3] },
            { lt: ["item:rank", 4] }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_SPELL_EFFECTS["spell-effect-tangle-vine"],
                    {
                        origin: data.speaker,
                        item: data.item,
                        target: data.speaker,
                        roll: data.roll,
                        duration: { expiry: "turn-start", sustained: false, unit: "rounds", value: 2 },
                        choiceSet: { selection: "success" }
                    }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "attack-roll",
        predicate: [
            "item:type:spell",
            "item:tangle-vine",
            "check:outcome:critical-success",
            { gte: ["item:rank", 3] },
            { lt: ["item:rank", 4] }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_SPELL_EFFECTS["spell-effect-tangle-vine"],
                    {
                        origin: data.speaker,
                        item: data.item,
                        target: data.speaker,
                        roll: data.roll,
                        duration: { expiry: "turn-start", sustained: false, unit: "rounds", value: 2 },
                        choiceSet: { selection: "critical-success" }
                    }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "attack-roll",
        predicate: ["item:type:spell", "item:tangle-vine", "check:outcome:success", { gte: ["item:rank", 4] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_SPELL_EFFECTS["spell-effect-tangle-vine"],
                    {
                        origin: data.speaker,
                        item: data.item,
                        target: data.speaker,
                        roll: data.roll,
                        duration: { expiry: "turn-start", sustained: false, unit: "minutes", value: 1 },
                        choiceSet: { selection: "success" }
                    }
                ))
            );

            return reroll;
        }
    },
    {
        trigger: "attack-roll",
        predicate: ["item:type:spell", "item:tangle-vine", "check:outcome:critical-success", { gte: ["item:rank", 4] }],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(
                    data.target.actor,
                    PF2E_SPELL_EFFECTS["spell-effect-tangle-vine"],
                    {
                        origin: data.speaker,
                        item: data.item,
                        target: data.speaker,
                        roll: data.roll,
                        duration: { expiry: "turn-start", sustained: false, unit: "minutes", value: 1 },
                        choiceSet: { selection: "critical-success" }
                    }
                ))
            );

            return reroll;
        }
    }
];
