import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

export const path = ["Items", "Runes", "Bloodthirsty"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: [
            "check:outcome:critical-success",
            "item:rune:property:bloodthirsty",
            "target:condition:persistent-damage:bleed"
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            if (!Utils.Actor.hasCondition(data.target.actor, "drained")) {
                await game.assistant.socket.addCondition(data.target.actor, "drained");
            }
        }
    }
];
