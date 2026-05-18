import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

export const path = ["Class Features", "Monk", "Stunning Blows"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["stunning-blows"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            game.assistant.socket.rollSave(data.target.actor, "fortitude", {
                origin: data.speaker.actor,
                dc: Utils.Actor.getClassDC(data.speaker.actor),
                extraRollOptions: ["incapacitation", "item:trait:incapacitation", "stunning-blows"]
            });
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["stunning-blows", "check:outcome:failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...((await game.assistant.socket.addCondition(data.speaker.actor, "stunned", { value: 1 })) ?? [])
            );

            return reroll;
        }
    },
    {
        trigger: "saving-throw",
        predicate: ["stunning-blows", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.origin) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...((await game.assistant.socket.addCondition(data.speaker.actor, "stunned", { value: 3 })) ?? [])
            );

            return reroll;
        }
    }
];
