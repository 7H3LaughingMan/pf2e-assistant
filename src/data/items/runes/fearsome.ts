import { isRolledDamageRoll } from "@7h3laughingman/pf2e-helpers/utilities";
import { Assistant } from "assistant.ts";

export const path = ["Items", "Runes", "Fearsome"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:fearsome"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!isRolledDamageRoll(data.roll)) return;

            await game.assistant.socket.addCondition(data.target.actor, "frightened", { value: 1 });
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:greater-fearsome"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!isRolledDamageRoll(data.roll)) return;

            await game.assistant.socket.addCondition(data.target.actor, "frightened", { value: 2 });
        }
    }
];
