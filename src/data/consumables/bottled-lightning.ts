import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

export const path = ["Consumables", "Bottled Lightning"];

export const actions: Assistant.Action[] = [
    {
        trigger: "attack-roll",
        predicate: [
            { or: ["check:outcome:success", "check:outcome:critical-success"] },
            {
                or: [
                    "item:bottled-lightning-lesser",
                    "item:bottled-lightning-moderate",
                    "item:bottled-lightning-greater",
                    "item:bottled-lightning-major"
                ]
            }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!Utils.Roll.isCheckRoll(data.roll)) return;
            const reroll = Assistant.createReroll();

            const effect = await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_ASSISTANT_EFFECTS["effect-bottled-lightning"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: data.target,
                    roll: data.roll
                }
            );

            if (effect) reroll.removeItem.push({ actor: data.target.actor.uuid, item: effect });

            return reroll;
        }
    }
];
