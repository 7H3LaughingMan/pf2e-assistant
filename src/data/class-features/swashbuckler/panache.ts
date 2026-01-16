import { Assistant } from "assistant.ts";
import { PF2E_FEAT_EFFECTS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

export const path = ["Class Features", "Swashbuckler", "Panache"];

export const actions: Assistant.Action[] = [
    {
        trigger: "skill-check",
        predicate: [
            "item:trait:bravado",
            { not: "self:effect:panache" },
            { or: ["check:outcome:critical-success", "check:outcome:success"] }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(data.speaker.actor, PF2E_FEAT_EFFECTS["effect-panache"], {
                    origin: data.speaker,
                    target: data.speaker,
                    roll: data.roll
                }))
            );

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["item:trait:bravado", { not: "self:effect:panache" }, "check:outcome:failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            reroll.removeItem.push(
                ...(await game.assistant.socket.addEffect(data.speaker.actor, PF2E_FEAT_EFFECTS["effect-panache"], {
                    origin: data.speaker,
                    target: data.speaker,
                    roll: data.roll,
                    duration: { expiry: "turn-end", sustained: false, unit: "rounds", value: 1 }
                }))
            );

            return reroll;
        }
    }
];
